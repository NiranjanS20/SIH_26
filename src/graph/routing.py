"""
src/graph/routing.py
────────────────────
Single-pair and multi-source Dijkstra on the ORIGINAL road graph.

This is the ground-truth router used for:
  - Part A route comparison (baseline shortest/fastest path)
  - Building the distance/time matrix for VRP solvers
  - Extracting road-following GeoJSON polylines

Unlike the CH oracle, this module operates on the un-contracted graph,
so paths are always real road-network node sequences.
"""

from __future__ import annotations

import heapq
import logging
import math
from typing import Dict, List, Optional, Tuple

from src.graph.loader import RoadGraph

logger = logging.getLogger(__name__)

INF = math.inf


# ─────────────────────────────────────────────────────────────────────────────
# Single-pair Dijkstra
# ─────────────────────────────────────────────────────────────────────────────

def dijkstra(
    graph: RoadGraph,
    src: int,
    dst: int,
    weight_key: str = "weight",
) -> Tuple[float, List[int]]:
    """
    Standard Dijkstra from src to dst on the road graph.

    Parameters
    ----------
    graph : RoadGraph
    src, dst : int  — OSM node IDs
    weight_key : str — edge attribute to use as cost.
        "weight" = travel time (seconds)
        "length" = physical distance (metres)

    Returns
    -------
    (cost, path)  where path is list of OSM node IDs [src, …, dst].
    Returns (INF, []) if dst is unreachable.
    """
    G = graph.nx_graph
    if src not in G or dst not in G:
        return INF, []
    if src == dst:
        return 0.0, [src]

    dist: Dict[int, float] = {src: 0.0}
    prev: Dict[int, Optional[int]] = {src: None}
    pq: List[Tuple[float, int]] = [(0.0, src)]

    while pq:
        d, u = heapq.heappop(pq)
        if u == dst:
            break
        if d > dist.get(u, INF):
            continue
        for v in G.successors(u):
            w = G[u][v].get(weight_key, G[u][v].get("weight", 1.0))
            nd = d + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                prev[v] = u
                heapq.heappush(pq, (nd, v))

    if dst not in dist:
        return INF, []

    # Reconstruct path
    path: List[int] = []
    node: Optional[int] = dst
    while node is not None:
        path.append(node)
        node = prev.get(node)
    path.reverse()
    return dist[dst], path


# ─────────────────────────────────────────────────────────────────────────────
# Single-source Dijkstra (for matrix building)
# ─────────────────────────────────────────────────────────────────────────────

def dijkstra_single_source(
    graph: RoadGraph,
    src: int,
    targets: Optional[List[int]] = None,
    weight_key: str = "weight",
) -> Dict[int, float]:
    """
    Dijkstra from src to all nodes (or until all targets are found).

    Returns dict {node_id: cost}.
    """
    G = graph.nx_graph
    if src not in G:
        return {}

    dist: Dict[int, float] = {src: 0.0}
    pq: List[Tuple[float, int]] = [(0.0, src)]
    found = 0
    target_set = set(targets) if targets else None
    target_count = len(target_set) if target_set else 0

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, INF):
            continue
        if target_set and u in target_set:
            found += 1
            if found >= target_count:
                break
        for v in G.successors(u):
            w = G[u][v].get(weight_key, G[u][v].get("weight", 1.0))
            nd = d + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return dist


# ─────────────────────────────────────────────────────────────────────────────
# Path metrics: extract distance AND time from a path
# ─────────────────────────────────────────────────────────────────────────────

def path_metrics(
    graph: RoadGraph,
    path: List[int],
) -> Dict[str, float]:
    """
    Given a road-network path (list of OSM node IDs), compute:
      - distance_m: total physical distance in metres
      - travel_time_s: total travel time in seconds
      - segments: number of road segments
    """
    if len(path) < 2:
        return {"distance_m": 0.0, "travel_time_s": 0.0, "segments": 0}

    G = graph.nx_graph
    total_dist = 0.0
    total_time = 0.0
    segments = 0

    for i in range(len(path) - 1):
        u, v = path[i], path[i + 1]
        if G.has_edge(u, v):
            total_dist += G[u][v].get("length", 0.0)
            total_time += G[u][v].get("weight", 0.0)
            segments += 1

    return {
        "distance_m": total_dist,
        "travel_time_s": total_time,
        "segments": segments,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Path → GeoJSON LineString
# ─────────────────────────────────────────────────────────────────────────────

def path_to_geojson(
    graph: RoadGraph,
    path: List[int],
) -> Dict:
    """
    Convert a path of OSM node IDs to a GeoJSON Feature with LineString geometry.
    Coordinates are [lon, lat] per GeoJSON spec.
    """
    coords = graph.node_coords
    coordinates = []
    for node in path:
        if node in coords:
            lat, lon = coords[node]
            coordinates.append([lon, lat])  # GeoJSON is [lon, lat]

    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates,
        },
        "properties": {},
    }


# ─────────────────────────────────────────────────────────────────────────────
# Full route with both path and metrics
# ─────────────────────────────────────────────────────────────────────────────

def compute_route(
    graph: RoadGraph,
    src_node: int,
    dst_node: int,
    weight_key: str = "weight",
) -> Dict:
    """
    Compute a route between two graph nodes and return all details.

    Returns dict with:
      - distance_km, time_min, segments
      - path (list of node IDs)
      - geojson (GeoJSON Feature)
      - computation_ms
    """
    import time
    t0 = time.perf_counter()

    cost, path = dijkstra(graph, src_node, dst_node, weight_key)

    if not path:
        elapsed_ms = (time.perf_counter() - t0) * 1000
        return {
            "distance_km": 0.0,
            "time_min": 0.0,
            "segments": 0,
            "path": [],
            "geojson": None,
            "computation_ms": round(elapsed_ms, 2),
            "reachable": False,
        }

    metrics = path_metrics(graph, path)
    geojson = path_to_geojson(graph, path)

    elapsed_ms = (time.perf_counter() - t0) * 1000

    return {
        "distance_km": round(metrics["distance_m"] / 1000.0, 3),
        "time_min": round(metrics["travel_time_s"] / 60.0, 1),
        "segments": metrics["segments"],
        "path": path,
        "geojson": geojson,
        "computation_ms": round(elapsed_ms, 2),
        "reachable": True,
    }
