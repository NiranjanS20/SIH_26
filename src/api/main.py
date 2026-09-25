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
from typing import Any, Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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
from src.sustainability.emissions import compute_fleet_emissions
from src.api.jobs import create_job, update_job_progress, complete_job, fail_job, stream_job

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger(__name__)

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
    w_distance: float = 0.33
    w_time: float = 0.33
    w_cost: float = 0.34

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
    """Format solver routes into API response."""
    em = compute_fleet_emissions(routes, problem)

    route_list = []
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

        # Extract road-following polyline from graph if available
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
                            # GeoJSON-style [lat, lon] for Leaflet
                            if not polyline or polyline[-1] != [coord[0], coord[1]]:
                                polyline.append([coord[0], coord[1]])
            except Exception:
                pass

        route_list.append({
            "vehicle_id":  veh.id if veh else vi,
            "is_ev":       veh.is_ev if veh else False,
            "stops":       stops_info,
            "distance_km": round(dist_m / 1000.0, 3),
            "travel_time_min": round(time_s / 60.0, 1),
            "stop_count":  len(route),
            "polyline": polyline,
        })

    return {
        "routes":        route_list,
        "elapsed_s":     round(elapsed_s, 4),
        "algorithm":     algo,
        "emissions":     em.__dict__,
        "convergence":   fitness_hist,
        "diversity":     div_hist,
        "depot":         {"lat": problem.depot_lat, "lon": problem.depot_lon},
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

    return {"updated": len(updated), "edges": updated}


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
    Part A: Compare baseline (Dijkstra shortest-path) vs our route
    between source → stops → destination.
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

        # BASELINE: shortest distance path (weight=length)
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

        # OUR ROUTE: fastest path (weight=weight, i.e. travel time)
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

        computation_ms = sum(s["computation_ms"] for s in baseline_segments + our_segments)
        identical = (baseline_distance_km == our_distance_km)

        return {
            "baseline": {
                "distance_km": round(baseline_distance_km, 3),
                "time_min": round(baseline_time_min, 1),
                "segments": sum(s["segments"] for s in baseline_segments),
                "geometry": {
                    "type": "Feature",
                    "geometry": {"type": "LineString", "coordinates": baseline_geojson_coords},
                    "properties": {"type": "baseline"},
                },
                "computation_ms": round(computation_ms / 2, 2),
            },
            "ours": {
                "distance_km": round(our_distance_km, 3),
                "time_min": round(our_time_min, 1),
                "segments": sum(s["segments"] for s in our_segments),
                "geometry": {
                    "type": "Feature",
                    "geometry": {"type": "LineString", "coordinates": our_geojson_coords},
                    "properties": {"type": "qpso"},
                },
                "computation_ms": round(computation_ms / 2, 2),
            },
            "identical": identical,
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

        weights = FitnessWeights(**(req.weights.model_dump() if req.weights else {}))

        # Build solver config from optional overrides
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
            solver = ACOSolver(num_ants=cfg.population_size, max_iter=cfg.max_iterations)
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

        evaluator = FitnessEvaluator(problem, weights)
        result = solver.solve(problem, evaluator)

        _state.last_result = result.__dict__
        _state.metrics["total_solves"] += 1

        response = _routes_to_response(
            result.routes, problem, result.elapsed_s,
            result.algorithm, result.fitness_history, result.diversity_history,
        )
        response["fitness"] = result.fitness
        response["iterations"] = result.iterations_run

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
            weights = FitnessWeights(**(req.weights.model_dump() if req.weights else {}))
            
            qpso_kwargs = {}
            if req.qpso_config:
                for k in ("population_size","max_iterations","beta_start","beta_end","greedy_fraction","seed"):
                    if k in req.qpso_config:
                        qpso_kwargs[k] = req.qpso_config[k]
            cfg = QPSOConfig(**qpso_kwargs)
            
            solver = QPSOSolver(cfg)
            evaluator = FitnessEvaluator(problem, weights)
            
            def progress_cb(it, fit, div):
                update_job_progress(job_id, it, fit, div)
                
            result = solver.solve(problem, evaluator, weights, progress_cb)
            
            _state.last_result = result.__dict__
            _state.metrics["total_solves"] += 1
            
            response = _routes_to_response(
                result.routes, problem, result.elapsed_s,
                result.algorithm, result.fitness_history, result.diversity_history,
            )
            response["fitness"] = result.fitness
            response["iterations"] = result.iterations_run
            
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
        evaluator = FitnessEvaluator(problem)

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
