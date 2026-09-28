"""
src/api/main.py
───────────────
QIDRE FastAPI Application — Phase 1

REST endpoints:
  GET  /health                  → health check + area list
  GET  /areas                   → available Mumbai area presets
  POST /graph/load              → load city OSM graph (with caching)
  GET  /graph                   → graph metadata (nodes, edges, bbox)
  POST /graph/traffic           → inject edge-weight update(s)
  POST /route/compare           → Part A: baseline vs QPSO route comparison
  POST /route                   → run solver, return routes (legacy compat)
  POST /route/benchmark         → run all algorithms, return comparison
  GET  /geocode/search          → forward geocoding (Nominatim proxy)
  GET  /geocode/reverse         → reverse geocoding
  GET  /metrics                 → solver and oracle performance stats

CORS is open for local frontend development.
"""

from __future__ import annotations

import logging
import time
import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from src.graph.loader import (
    RoadGraph,
    AREAS,
    load_osm_graph,
    generate_synthetic_graph,
)
from src.graph.spatial_index import SpatialIndex
from src.graph.routing import compute_route, dijkstra, path_metrics, path_to_geojson
from src.oracle.matrix import build_matrix
from src.optimizer.encoding import Stop, Vehicle, VRPProblem
from src.optimizer.fitness import FitnessEvaluator, FitnessWeights
from src.optimizer.qpso import QPSOSolver, QPSOConfig
from src.optimizer.turn_analyzer import TurnAnalyzer
from src.sustainability.emissions import (
    FleetEnergyEngine,
    compute_fleet_emissions,
)
from src.api.jobs import create_job, update_job_progress, complete_job, fail_job, stream_job

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger(__name__)

# Load project credentials for both `python run.py` and direct Uvicorn startup.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# ─────────────────────────────────────────────────────────────────────────────
# App & CORS
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="QIDRE API",
    description="Quantum-Inspired Dynamic Route Engine — SIH 2026",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
# In-memory app state
# ─────────────────────────────────────────────────────────────────────────────

class AppState:
    graph: Optional[RoadGraph] = None
    spatial_index: Optional[SpatialIndex] = None
    area_key: Optional[str] = None
    last_result: Optional[dict] = None
    traffic_source: Optional[str] = None
    traffic_refreshed_at: Optional[str] = None
    traffic_updated_edges: int = 0
    metrics: dict = {
        "total_solves": 0,
        "avg_solve_s": 0.0,
    }

_state = AppState()


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────────────────────────────────────

class LoadGraphRequest(BaseModel):
    area: str = Field("bkc", description="Area preset key from /areas")

class TrafficUpdate(BaseModel):
    edges: List[Dict[str, Any]] = Field(
        ...,
        description='List of {"u": int, "v": int, "weight": float}'
    )

class TrafficRefreshRequest(BaseModel):
    max_segments: int = Field(
        100, ge=1, le=1000,
        description="Maximum TomTom road-segment lookups for this refresh (each lookup uses one monthly request).",
    )

class StopModel(BaseModel):
    id: int
    lat: float
    lon: float
    demand: float = 1.0
    earliest: float = 0.0
    latest: float = 86400.0
    priority: int = 1
    service_time_min: float = 5.0

class VehicleModel(BaseModel):
    id: int
    capacity: float = 100.0
    is_ev: bool = False
    soc: float = 1.0
    type: str = "Van"
    max_distance_km: float = 200.0
    max_duration_min: float = 480.0
    cost_per_km: float = 10.0
    fixed_cost: float = 500.0

class PointModel(BaseModel):
    lat: float
    lon: float

class RouteCompareRequest(BaseModel):
    area: Optional[str] = None
    source: PointModel
    destination: PointModel
    stops: List[PointModel] = Field(default_factory=list)

class WeightsModel(BaseModel):
    w_distance: float = 0.15
    w_time: float = 0.35
    w_cost: float = 0.0       # Legacy; kept for backward compat
    w_energy: float = 0.25   # Thermodynamic energy objective
    w_cognitive: float = 0.25 # Driver ergonomics objective

class RouteRequest(BaseModel):
    depot_lat: float
    depot_lon: float
    stops: List[StopModel]
    vehicles: List[VehicleModel]
    weights: Optional[WeightsModel] = None
    qpso_config: Optional[Dict[str, Any]] = None
    algorithm: str = Field("qpso", pattern="^(qpso|ga|aco|pso|nn|cw)$")

class BenchmarkRequest(BaseModel):
    depot_lat: float
    depot_lon: float
    stops: List[StopModel]
    vehicles: List[VehicleModel]
    algorithms: List[str] = Field(default=["qpso", "ga", "aco", "pso", "nn", "cw"])


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _ensure_graph(area: Optional[str] = None) -> RoadGraph:
    """Load graph if needed; return it."""
    target_area = (area or _state.area_key or "bkc").lower()
    if _state.graph is not None and _state.area_key == target_area:
        return _state.graph
    graph = load_osm_graph(target_area)
    _state.graph = graph
    _state.spatial_index = SpatialIndex(graph.node_coords)
    _state.area_key = target_area
    _state.traffic_source = None
    _state.traffic_refreshed_at = None
    _state.traffic_updated_edges = 0
    return graph


def _snap_to_node(lat: float, lon: float) -> int:
    """Snap a lat/lon to the nearest graph node."""
    if _state.spatial_index is None:
        raise HTTPException(status_code=400, detail="Graph not loaded")
    return _state.spatial_index.nearest(lat, lon)


def _build_problem(req_stops, req_vehicles, depot_lat, depot_lon) -> VRPProblem:
    """Build a VRPProblem and populate its distance/time matrices from the real graph."""
    stops = [
        Stop(id=s.id, lat=s.lat, lon=s.lon, demand=s.demand,
             earliest=s.earliest, latest=s.latest, priority=s.priority,
             service_time_min=s.service_time_min)
        for s in req_stops
    ]
    vehicles = [
        Vehicle(id=v.id, capacity=v.capacity, is_ev=v.is_ev, soc=v.soc,
                type=v.type, max_distance_km=v.max_distance_km,
                max_duration_min=v.max_duration_min, cost_per_km=v.cost_per_km,
                fixed_cost=v.fixed_cost)
        for v in req_vehicles
    ]
    prob = VRPProblem(depot_lat=depot_lat, depot_lon=depot_lon, stops=stops, vehicles=vehicles)

    # Populate real distance/time matrices from the graph
    if _state.graph and _state.spatial_index:
        import numpy as np
        coords = [(depot_lat, depot_lon)] + [(s.lat, s.lon) for s in stops]
        node_ids = [_state.spatial_index.nearest(lat, lon) for lat, lon in coords]

        D, T = build_matrix(_state.graph, node_ids)

        prob.dist_matrix = D   # metres
        prob.time_matrix = T   # seconds
        prob.node_ids = node_ids

    return prob


def _routes_to_response(routes, problem, elapsed_s, algo, fitness_hist, div_hist):
    """Format solver routes into API response with eco-energy and cognitive metrics."""
    from src.optimizer.fitness import CognitiveLoadEvaluator
    from src.optimizer.turn_analyzer import TurnAnalyzer

    em = compute_fleet_emissions(routes, problem)
    cognitive_eval = CognitiveLoadEvaluator(road_graph=_state.graph)
    turn_analyzer  = TurnAnalyzer(_state.graph)

    route_list = []
    fleet_cognitive_scores = []

    for vi, route in enumerate(routes):
        veh = problem.vehicles[vi] if vi < len(problem.vehicles) else None
        nodes = [0] + [s + 1 for s in route] + [0]

        dist_m = sum(
            problem.dist_matrix[nodes[i]][nodes[i+1]]
            for i in range(len(nodes)-1)
        ) if problem.dist_matrix is not None else 0.0

        time_s = sum(
            problem.time_matrix[nodes[i]][nodes[i+1]]
            for i in range(len(nodes)-1)
        ) if problem.time_matrix is not None else 0.0

        stops_info = [
            {
                "stop_id": problem.stops[s].id,
                "lat": problem.stops[s].lat,
                "lon": problem.stops[s].lon,
            }
            for s in route
        ]

        # ── Phase 4: Per-route energy breakdown ──────────────────────────────
        energy_breakdown = {}
        if veh is not None and problem.dist_matrix is not None and problem.time_matrix is not None:
            engine = FleetEnergyEngine.from_vehicle(veh)
            edge_list = [
                {
                    "length_m": float(problem.dist_matrix[nodes[i]][nodes[i+1]]),
                    "duration_s": max(float(problem.time_matrix[nodes[i]][nodes[i+1]]), 1.0),
                    "free_flow_speed_kmh": 40.0,
                    "elevation_gain_m": 0.0,
                }
                for i in range(len(nodes) - 1)
            ]
            route_energy = engine.calculate_route_energy(edge_list)
            energy_breakdown = {
                "vehicle_type": route_energy.vehicle_type,
                "is_electric": route_energy.is_electric,
                "total_energy_kwh": route_energy.total_energy_kwh,
                "total_fuel_liters": route_energy.total_fuel_liters,
                "co2_kg": route_energy.total_co2_kg,
                "mechanical_kwh": route_energy.total_mechanical_kwh,
                "aux_kwh": route_energy.total_aux_kwh,
                "regen_recovered_kwh": route_energy.total_regen_recovered_kwh,
            }

        # ── Phase 4: Per-route cognitive stress score ─────────────────────────
        cog_score = cognitive_eval.calculate_route_cognitive_load(route, problem)
        fleet_cognitive_scores.append(cog_score)

        # Turn analysis summary (Phase 3)
        turns_summary = {"right_turns": 0, "left_turns": 0, "u_turns": 0, "method": "empirical"}
        if _state.graph and hasattr(problem, "node_ids") and problem.node_ids:
            osm_nodes = [problem.node_ids[n] for n in nodes if n < len(problem.node_ids)]
            if len(osm_nodes) >= 3:
                turn_events = turn_analyzer.analyze_route(osm_nodes)
                counts = turn_analyzer.count_by_type(turn_events)
                turns_summary = {
                    "right_turns": counts.get("right", 0),
                    "left_turns":  counts.get("left", 0),
                    "u_turns":     counts.get("uturn", 0),
                    "straight":    counts.get("straight", 0),
                    "method": "osmnx_geometric",
                }

        # ── Road-following polyline ───────────────────────────────────────────
        polyline = []
        if hasattr(problem, 'node_ids') and _state.graph:
            try:
                for i in range(len(nodes)-1):
                    u = problem.node_ids[nodes[i]]
                    v = problem.node_ids[nodes[i+1]]
                    _, path = dijkstra(_state.graph, u, v)
                    for pid in path:
                        if pid in _state.graph.node_coords:
                            coord = _state.graph.node_coords[pid]
                            if not polyline or polyline[-1] != [coord[0], coord[1]]:
                                polyline.append([coord[0], coord[1]])
            except Exception:
                pass

        route_list.append({
            "vehicle_id":       veh.id if veh else vi,
            "is_ev":            veh.is_ev if veh else False,
            "stops":            stops_info,
            "distance_km":      round(dist_m / 1000.0, 3),
            "travel_time_min":  round(time_s / 60.0, 1),
            "stop_count":       len(route),
            "polyline":         polyline,
            # Phase 4 additions
            "energy":           energy_breakdown,
            "cognitive_stress": round(cog_score, 3),
            "turns":            turns_summary,
        })

    # Fleet-level Gini equity
    from src.optimizer.fitness import CognitiveLoadEvaluator as _CLE
    _tmp = _CLE()
    gini_penalty = _tmp.fleet_workload_equity_penalty(fleet_cognitive_scores)

    return {
        "routes":           route_list,
        "elapsed_s":        round(elapsed_s, 4),
        "algorithm":        algo,
        "emissions":        em.__dict__,
        "convergence":      fitness_hist,
        "diversity":        div_hist,
        "depot":            {"lat": problem.depot_lat, "lon": problem.depot_lon},
        # Phase 4: fleet-level eco-cognitive summary
        "eco_cognitive": {
            "fleet_cognitive_scores":    [round(s, 3) for s in fleet_cognitive_scores],
            "total_cognitive_stress":    round(sum(fleet_cognitive_scores), 3),
            "gini_equity_penalty":       round(gini_penalty, 4),
            "fleet_co2_kg":              round(em.total_co2_kg, 3),
            "fleet_energy_kwh":          round(em.total_energy_kwh, 3),
            "fleet_fuel_liters":         round(em.total_fuel_liters, 3),
            "fleet_regen_recovered_kwh": round(em.total_regen_recovered_kwh, 3),
            "co2_reduction_pct":         em.co2_reduction_pct,
        },
    }


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["system"])
async def health():
    return {
        "service": "QIDRE",
        "version": "1.1.0",
        "status": "ok",
        "graph_loaded": _state.graph is not None,
        "area": _state.area_key,
        "areas_available": list(AREAS.keys()),
    }


# Legacy compat: GET / also returns health
@app.get("/", tags=["system"])
async def root():
    return await health()


@app.get("/areas", tags=["graph"])
async def list_areas():
    """Return available Mumbai area presets."""
    return [
        {
            "id": key,
            "name": preset["name"],
            "center_lat": preset["center"][0],
            "center_lon": preset["center"][1],
            "radius_m": preset["radius_m"],
        }
        for key, preset in AREAS.items()
    ]


@app.post("/graph/load", tags=["graph"])
async def load_graph(req: LoadGraphRequest):
    """Load a road graph from OSM (with GraphML caching)."""
    try:
        t0 = time.perf_counter()
        graph = _ensure_graph(req.area)
        elapsed = time.perf_counter() - t0

        return {
            "status": "loaded",
            "area": graph.city,
            "num_nodes": graph.num_nodes,
            "num_edges": graph.num_edges,
            "bbox": graph.bbox,
            "load_seconds": round(elapsed, 2),
        }
    except Exception as e:
        logger.exception("Graph load failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/graph", tags=["graph"])
async def get_graph():
    """Return graph metadata (not full edge list for large graphs)."""
    if _state.graph is None:
        raise HTTPException(status_code=404, detail="No graph loaded. POST /graph/load first.")
    g = _state.graph

    # Return a small preview of nodes (first 200) for map display
    all_nodes = list(g.node_coords.items())
    preview_nodes = all_nodes[:200]

    return {
        "area": g.city,
        "num_nodes": g.num_nodes,
        "num_edges": g.num_edges,
        "bbox": g.bbox,
        "nodes_preview": [
            {"id": n, "lat": c[0], "lon": c[1]} for n, c in preview_nodes
        ],
    }


@app.post("/graph/traffic", tags=["graph"])
async def update_traffic(req: TrafficUpdate):
    """Inject live edge-weight updates (simulated congestion)."""
    if _state.graph is None:
        raise HTTPException(status_code=400, detail="Graph not loaded")

    updated = []
    for edge in req.edges:
        u, v, w = edge["u"], edge["v"], edge["weight"]
        ok = _state.graph.update_edge_weight(u, v, w)
        if ok:
            updated.append({"u": u, "v": v, "weight": w})

    _state.traffic_source = "manual"
    _state.traffic_refreshed_at = datetime.now(timezone.utc).isoformat()
    _state.traffic_updated_edges = len(updated)

    return {"updated": len(updated), "edges": updated}


@app.post("/graph/traffic/refresh", tags=["graph"])
async def refresh_traffic_from_tomtom(req: TrafficRefreshRequest):
    """Refresh a bounded, evenly sampled set of graph edges from live TomTom flow data."""
    if _state.graph is None:
        raise HTTPException(status_code=400, detail="Graph not loaded")

    api_key = os.getenv("TOMTOM_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="TomTom traffic is not configured. Add TOMTOM_API_KEY to .env and restart the backend.",
        )

    import httpx

    graph = _state.graph
    edges = sorted(graph.nx_graph.edges())
    if not edges:
        return {"source": "tomtom_live", "updated": 0, "requested": 0, "failed": 0}

    # Spread a small free-tier request budget across the area instead of only
    # refreshing the first geographically clustered edges in graph order.
    count = min(req.max_segments, len(edges))
    selected = [edges[(i * len(edges)) // count] for i in range(count)]
    request_slots = asyncio.Semaphore(8)

    async def fetch_flow(client, u, v):
        u_lat, u_lon = graph.node_coords[u]
        v_lat, v_lon = graph.node_coords[v]
        point = f"{(u_lat + v_lat) / 2:.6f},{(u_lon + v_lon) / 2:.6f}"
        try:
            async with request_slots:
                response = await client.get(
                    "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json",
                    params={"key": api_key, "point": point},
                )
            if response.status_code != 200:
                return u, v, None
            flow = response.json().get("flowSegmentData", {})
            speed = float(flow.get("currentSpeed", 0))
            confidence = float(flow.get("confidence", 0))
            raw_coordinates = flow.get("coordinates", {}).get("coordinate", [])
            geometry = [
                [float(point["longitude"]), float(point["latitude"])]
                for point in raw_coordinates
                if "longitude" in point and "latitude" in point
            ]
            if speed <= 0 or confidence < 0.4 or flow.get("roadClosure") is True:
                return u, v, None
            return u, v, {
                "speed_kmh": speed,
                "confidence": confidence,
                "free_flow_speed_kmh": float(flow.get("freeFlowSpeed", 0)),
                "current_travel_time_s": flow.get("currentTravelTime"),
                "geometry": geometry if len(geometry) >= 2 else [],
            }
        except (httpx.HTTPError, ValueError, TypeError, KeyError):
            # Avoid logging exception strings: request URLs contain the API key.
            return u, v, None

    async with httpx.AsyncClient(timeout=12.0) as client:
        results = await asyncio.gather(*(fetch_flow(client, u, v) for u, v in selected))

    updated = []
    for u, v, flow in results:
        if flow and graph.update_edge_speed(u, v, flow["speed_kmh"]):
            updated.append({"u": u, "v": v, **flow})
    failed = count - len(updated)

    if updated:
        _state.traffic_source = "tomtom_live"
        _state.traffic_refreshed_at = datetime.now(timezone.utc).isoformat()
        _state.traffic_updated_edges = len(updated)
    return {
        "source": "tomtom_live",
        "area": graph.city,
        "refreshed_at": datetime.now(timezone.utc).isoformat(),
        "requested": count,
        "updated": len(updated),
        "failed_or_low_confidence": failed,
        "monthly_free_tier_limit": 20000,
        "edges": updated,
    }


# ── Geocoding ────────────────────────────────────────────────────────────────

@app.get("/geocode/search", tags=["geocoding"])
async def geocode_search(
    q: str = Query(..., description="Search query"),
    area: Optional[str] = Query(None, description="Area key to restrict bbox"),
):
    """Forward geocode: text → lat/lon via Nominatim."""
    from src.geocoding import search

    bbox = None
    if area and _state.graph and _state.area_key == area:
        bbox = _state.graph.bbox

    results = await search(q, bbox=bbox)
    return results


@app.get("/geocode/reverse", tags=["geocoding"])
async def geocode_reverse(
    lat: float = Query(...),
    lon: float = Query(...),
):
    """Reverse geocode: lat/lon → display name."""
    from src.geocoding import reverse
    result = await reverse(lat, lon)
    if result is None:
        return {"display_name": "", "lat": lat, "lon": lon}
    return result


# ── Part A: Route Comparison ─────────────────────────────────────────────────

@app.post("/route/compare", tags=["routing"])
async def compare_routes(req: RouteCompareRequest):
    """
    Compare shortest-distance and fastest-time Dijkstra routes over the
    loaded OSM graph between source → stops → destination. Travel-time
    weights use static OSM estimates until updated by a traffic feed.
    """
    try:
        graph = _ensure_graph(req.area)
        si = _state.spatial_index

        # Snap all points to graph nodes
        src_node = si.nearest(req.source.lat, req.source.lon)
        dst_node = si.nearest(req.destination.lat, req.destination.lon)
        stop_nodes = [si.nearest(s.lat, s.lon) for s in req.stops]

        # Build waypoint chain: source → stop1 → stop2 → ... → destination
        waypoints = [src_node] + stop_nodes + [dst_node]

        # Baseline: shortest physical distance using static OSM lengths.
        baseline_segments = []
        for i in range(len(waypoints) - 1):
            seg = compute_route(graph, waypoints[i], waypoints[i+1], weight_key="length")
            baseline_segments.append(seg)

        baseline_distance_km = sum(s["distance_km"] for s in baseline_segments)
        baseline_time_min = sum(s["time_min"] for s in baseline_segments)
        baseline_geojson_coords = []
        for seg in baseline_segments:
            if seg["geojson"]:
                baseline_geojson_coords.extend(seg["geojson"]["geometry"]["coordinates"])

        # Alternative: fastest estimated travel time using static OSM speeds.
        our_segments = []
        for i in range(len(waypoints) - 1):
            seg = compute_route(graph, waypoints[i], waypoints[i+1], weight_key="weight")
            our_segments.append(seg)

        our_distance_km = sum(s["distance_km"] for s in our_segments)
        our_time_min = sum(s["time_min"] for s in our_segments)
        our_geojson_coords = []
        for seg in our_segments:
            if seg["geojson"]:
                our_geojson_coords.extend(seg["geojson"]["geometry"]["coordinates"])

        baseline_computation_ms = sum(s["computation_ms"] for s in baseline_segments)
        our_computation_ms = sum(s["computation_ms"] for s in our_segments)
        baseline_path = [node for segment in baseline_segments for node in segment["path"]]
        our_path = [node for segment in our_segments for node in segment["path"]]
        identical = baseline_path == our_path

        return {
            "baseline": {
                "method": "dijkstra_shortest_distance",
                "cost_basis": "static_osm_length",
                "distance_km": round(baseline_distance_km, 3),
                "time_min": round(baseline_time_min, 1),
                "segments": sum(s["segments"] for s in baseline_segments),
                "geometry": {
                    "type": "Feature",
                    "geometry": {"type": "LineString", "coordinates": baseline_geojson_coords},
                    "properties": {"type": "baseline", "method": "dijkstra_shortest_distance"},
                },
                "computation_ms": round(baseline_computation_ms, 2),
            },
            "ours": {
                "method": "dijkstra_fastest_time",
                "cost_basis": "graph_travel_time_weights",
                "distance_km": round(our_distance_km, 3),
                "time_min": round(our_time_min, 1),
                "segments": sum(s["segments"] for s in our_segments),
                "geometry": {
                    "type": "Feature",
                    "geometry": {"type": "LineString", "coordinates": our_geojson_coords},
                    "properties": {"type": "fastest_time", "method": "dijkstra_fastest_time"},
                },
                "computation_ms": round(our_computation_ms, 2),
            },
            "identical": identical,
            "traffic_aware": _state.traffic_source == "tomtom_live",
            "traffic_source": _state.traffic_source or "static_osm_estimate",
            "traffic_refreshed_at": _state.traffic_refreshed_at,
            "traffic_updated_edges": _state.traffic_updated_edges,
            "source_snapped": {
                "node_id": src_node,
                "lat": graph.node_coords[src_node][0],
                "lon": graph.node_coords[src_node][1],
            },
            "destination_snapped": {
                "node_id": dst_node,
                "lat": graph.node_coords[dst_node][0],
                "lon": graph.node_coords[dst_node][1],
            },
        }

    except Exception as e:
        logger.exception("Route comparison failed")
        raise HTTPException(status_code=500, detail=str(e))


# ── Legacy /route endpoint ───────────────────────────────────────────────────

@app.post("/route", tags=["optimizer"])
async def solve_route(req: RouteRequest):
    """Run a solver and return optimised vehicle routes."""
    if not req.stops:
        raise HTTPException(status_code=400, detail="No stops provided")
    if not req.vehicles:
        raise HTTPException(status_code=400, detail="No vehicles provided")

    try:
        _ensure_graph()
        problem = _build_problem(req.stops, req.vehicles, req.depot_lat, req.depot_lon)

        weights_dict = req.weights.model_dump() if req.weights else {}
        # Remove legacy cost key if present so FitnessWeights doesn't choke
        weights_dict.pop("w_cost", None)
        weights = FitnessWeights(**weights_dict)

        # Phase 4: pass loaded graph so Phase 3 turn-angle detection is active
        evaluator = FitnessEvaluator(problem, weights, road_graph=_state.graph)
        qpso_kwargs = {}
        if req.qpso_config:
            for k in ("population_size","max_iterations","beta_start","beta_end","greedy_fraction","seed"):
                if k in req.qpso_config:
                    qpso_kwargs[k] = req.qpso_config[k]
        cfg = QPSOConfig(**qpso_kwargs)

        if req.algorithm == "ga":
            from src.baselines.ga import GASolver
            solver = GASolver(pop_size=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
        elif req.algorithm == "aco":
            from src.baselines.aco import ACOSolver
            solver = ACOSolver(n_ants=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
        elif req.algorithm == "pso":
            from src.baselines.pso_classic import ClassicPSOSolver
            solver = ClassicPSOSolver(pop_size=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
        elif req.algorithm == "nn":
            from src.baselines.nn import NNSolver
            solver = NNSolver()
        elif req.algorithm == "cw":
            from src.baselines.cw import CWSolver
            solver = CWSolver()
        else:
            solver = QPSOSolver(cfg)

        result = solver.solve(problem, evaluator)

        response = _routes_to_response(
            result.routes, problem, result.elapsed_s,
            result.algorithm, result.fitness_history, result.diversity_history,
        )
        response["fitness"] = result.fitness
        response["iterations"] = result.iterations_run

        _state.last_result = response
        _state.metrics["total_solves"] += 1

        return response

    except Exception as e:
        logger.exception("Route solve failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/route/job", tags=["optimizer"])
async def start_route_job(req: RouteRequest):
    """Part B: Start a solver job and return a job ID for SSE streaming."""
    if not req.stops:
        raise HTTPException(status_code=400, detail="No stops provided")
    if not req.vehicles:
        raise HTTPException(status_code=400, detail="No vehicles provided")

    job_id = create_job()

    def run_solver():
        try:
            _ensure_graph()
            problem = _build_problem(req.stops, req.vehicles, req.depot_lat, req.depot_lon)
            weights_dict = req.weights.model_dump() if req.weights else {}
            weights_dict.pop("w_cost", None)
            weights = FitnessWeights(**weights_dict)
            
            qpso_kwargs = {}
            if req.qpso_config:
                for k in ("population_size","max_iterations","beta_start","beta_end","greedy_fraction","seed"):
                    if k in req.qpso_config:
                        qpso_kwargs[k] = req.qpso_config[k]
            cfg = QPSOConfig(**qpso_kwargs)
            
            evaluator = FitnessEvaluator(problem, weights, road_graph=_state.graph)

            if req.algorithm == "ga":
                from src.baselines.ga import GASolver
                solver = GASolver(pop_size=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
                result = solver.solve(problem, evaluator)
            elif req.algorithm == "aco":
                from src.baselines.aco import ACOSolver
                solver = ACOSolver(n_ants=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
                result = solver.solve(problem, evaluator)
            elif req.algorithm == "pso":
                from src.baselines.pso_classic import ClassicPSOSolver
                solver = ClassicPSOSolver(pop_size=cfg.population_size, max_iter=cfg.max_iterations, seed=cfg.seed)
                result = solver.solve(problem, evaluator)
            elif req.algorithm == "nn":
                from src.baselines.nn import NNSolver
                solver = NNSolver()
                result = solver.solve(problem, evaluator)
            elif req.algorithm == "cw":
                from src.baselines.cw import CWSolver
                solver = CWSolver()
                result = solver.solve(problem, evaluator)
            else:
                solver = QPSOSolver(cfg)
                def progress_cb(it, fit, div):
                    update_job_progress(job_id, it, fit, div)
                result = solver.solve(problem, evaluator, weights, progress_cb)
            
            response = _routes_to_response(
                result.routes, problem, result.elapsed_s,
                result.algorithm, result.fitness_history, result.diversity_history,
            )
            response["fitness"] = result.fitness
            response["iterations"] = result.iterations_run

            _state.last_result = response
            _state.metrics["total_solves"] += 1
            
            complete_job(job_id, response)
        except Exception as e:
            logger.exception(f"Job {job_id} failed")
            fail_job(job_id, str(e))

    # Run solver in background thread
    executor = ThreadPoolExecutor(max_workers=1)
    loop = asyncio.get_event_loop()
    loop.run_in_executor(executor, run_solver)

    return {"job_id": job_id, "status": "started"}

@app.get("/route/job/{job_id}/stream", tags=["optimizer"])
async def stream_route_job(job_id: str):
    """Part B: Stream solver convergence via Server-Sent Events (SSE)."""
    return StreamingResponse(stream_job(job_id), media_type="text/event-stream")

@app.post("/route/benchmark", tags=["optimizer"])
async def benchmark(req: BenchmarkRequest):
    """Run multiple algorithms on the same problem and return a comparison."""
    try:
        _ensure_graph()
        problem  = _build_problem(req.stops, req.vehicles, req.depot_lat, req.depot_lon)
        evaluator = FitnessEvaluator(problem, road_graph=_state.graph)

        # Calibrate evaluator on a quick greedy sample
        from src.optimizer.encoding import encode_greedy, decode_particle
        greedy_p  = encode_greedy(problem)
        greedy_r  = decode_particle(greedy_p, problem)
        evaluator.calibrate([greedy_r])

        results  = {}
        n_stops  = len(req.stops)

        ALGO_MAP = {
            "ilp":  lambda: _run_ilp(problem, evaluator, n_stops),
            "qpso": lambda: QPSOSolver(QPSOConfig(max_iterations=150, population_size=40)).solve(problem, evaluator),
            "ga":   lambda: __import__("src.baselines.ga",  fromlist=["GASolver"]).GASolver(max_iter=150).solve(problem, evaluator),
            "aco":  lambda: __import__("src.baselines.aco", fromlist=["ACOSolver"]).ACOSolver(max_iter=150).solve(problem, evaluator),
            "pso":  lambda: __import__("src.baselines.pso_classic", fromlist=["ClassicPSOSolver"]).ClassicPSOSolver(max_iter=150).solve(problem, evaluator),
            "nn":   lambda: __import__("src.baselines.nn", fromlist=["NNSolver"]).NNSolver().solve(problem, evaluator),
            "cw":   lambda: __import__("src.baselines.cw", fromlist=["CWSolver"]).CWSolver().solve(problem, evaluator),
        }

        for algo in req.algorithms:
            if algo not in ALGO_MAP:
                continue
            try:
                res = ALGO_MAP[algo]()
                results[algo] = {
                    "fitness":    round(res.fitness, 6),
                    "elapsed_s":  round(res.elapsed_s, 4),
                    "iterations": res.iterations_run,
                    "convergence": res.fitness_history,
                    "diversity":   res.diversity_history,
                    "routes":      len(res.routes),
                }
            except Exception as algo_err:
                logger.warning("Algorithm %s failed: %s", algo, algo_err)
                results[algo] = {"error": str(algo_err)}

        # Compute optimality gaps
        best_fitness = min(
            (r["fitness"] for r in results.values() if "fitness" in r),
            default=1.0,
        )
        for algo, r in results.items():
            if "fitness" in r and best_fitness > 0:
                r["gap_pct"] = round((r["fitness"] - best_fitness) / best_fitness * 100, 2)

        return {
            "algorithms":  results,
            "num_stops":   n_stops,
            "num_vehicles": len(req.vehicles),
            "best_fitness": round(best_fitness, 6),
        }

    except Exception as e:
        logger.exception("Benchmark failed")
        raise HTTPException(status_code=500, detail=str(e))


def _run_ilp(problem, evaluator, n_stops):
    from src.baselines.ilp import ILPSolver, MAX_STOPS_ILP
    if n_stops > MAX_STOPS_ILP:
        raise ValueError(f"ILP skipped: {n_stops} stops > {MAX_STOPS_ILP} cap")
    return ILPSolver(time_limit_s=60).solve(problem, evaluator)


@app.get("/metrics", tags=["system"])
async def get_metrics():
    """Return solver performance statistics."""
    return {
        "solver": _state.metrics,
        "graph": {
            "loaded": _state.graph is not None,
            "area": _state.area_key,
            "nodes": _state.graph.num_nodes if _state.graph else 0,
            "edges": _state.graph.num_edges if _state.graph else 0,
        },
    }


# ── Phase 4: Eco-Cognitive Fleet Metrics ─────────────────────────────────────

@app.get("/fleet/eco-metrics", tags=["eco-cognitive"])
async def get_fleet_eco_metrics():
    """
    Phase 4 — Eco-Energy & Driver Cognitive Metrics from last fleet solve.

    Feeds the frontend dashboard panels:
      • Driver Ergonomics & Wellness Gauge (Optimal/Demanding/Burnout Risk)
      • EV Range & Eco Profile (battery discharge breakdown)
      • CO₂ reduction vs all-ICE baseline
      • Fleet equity Gini coefficient (G_fleet ≤ 0.15 target)

    Returns 404 if no solve has been run yet in this session.
    """
    if _state.last_result is None:
        raise HTTPException(
            status_code=404,
            detail="No fleet solve result available. Run POST /route or POST /route/job first.",
        )

    result = _state.last_result
    eco = result.get("eco_cognitive", {})
    emissions = result.get("emissions", {})

    # Build driver wellness classification per spec §3.2 thresholds
    fleet_scores = eco.get("fleet_cognitive_scores", [])
    driver_wellness = []
    for i, score in enumerate(fleet_scores):
        if score < 20.0:
            level, label = "optimal", "Optimal"
        elif score < 45.0:
            level, label = "demanding", "Demanding"
        else:
            level, label = "burnout_risk", "Burnout Risk"
        driver_wellness.append({
            "driver_index": i,
            "cognitive_stress": score,
            "wellness_level": level,
            "wellness_label": label,
        })

    gini = eco.get("gini_equity_penalty", 0.0)

    return {
        "last_algorithm": result.get("algorithm", "unknown"),
        "last_elapsed_s": result.get("elapsed_s", 0.0),
        # Driver ergonomics (Subsystem B)
        "driver_wellness": driver_wellness,
        "total_cognitive_stress": eco.get("total_cognitive_stress", 0.0),
        "gini_equity_coefficient": gini,
        "gini_threshold": 0.15,
        "gini_compliant": gini == 0.0,
        # Fleet energy (Subsystem A)
        "fleet_co2_kg": eco.get("fleet_co2_kg", emissions.get("total_co2_kg", 0.0)),
        "fleet_energy_kwh": eco.get("fleet_energy_kwh", emissions.get("total_energy_kwh", 0.0)),
        "fleet_fuel_liters": eco.get("fleet_fuel_liters", emissions.get("total_fuel_liters", 0.0)),
        "fleet_regen_recovered_kwh": eco.get("fleet_regen_recovered_kwh", 0.0),
        "co2_reduction_pct": eco.get("co2_reduction_pct", emissions.get("co2_reduction_pct", 0.0)),
        "co2_saved_vs_all_ice_kg": emissions.get("co2_saved_vs_all_ice", 0.0),
        # India carbon intensity constants (for frontend display)
        "grid_carbon_factor_kg_per_kwh": 0.716,
        "diesel_co2_kg_per_liter": 2.68,
        # Per-route breakdown
        "routes": [
            {
                "vehicle_id": r.get("vehicle_id"),
                "is_ev": r.get("is_ev"),
                "stop_count": r.get("stop_count"),
                "cognitive_stress": r.get("cognitive_stress"),
                "turns": r.get("turns", {}),
                "energy": r.get("energy", {}),
            }
            for r in result.get("routes", [])
        ],
    }
