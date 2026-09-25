"""
src/graph/loader.py
───────────────────
Graph Data Layer — Phase 1
Loads a road network from OSM (via osmnx) or generates a synthetic
graph for testing/demo.  Caches downloaded graphs as GraphML files
under data/osm/ so they are only fetched once.
"""

from __future__ import annotations

import logging
import math
import os
import random
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import networkx as nx
import numpy as np

logger = logging.getLogger(__name__)

# Resolve project root (two levels up from this file)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_CACHE_DIR = _PROJECT_ROOT / "data" / "osm"


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Edge:
    u: int
    v: int
    weight: float          # travel time in seconds
    length: float          # metres
    speed: float           # km/h
    is_shortcut: bool = False
    contracted_through: Optional[int] = None   # for CH shortcuts


@dataclass
class RoadGraph:
    """Thin wrapper around a NetworkX DiGraph with extra metadata."""
    nx_graph: nx.DiGraph
    node_coords: Dict[int, Tuple[float, float]]  # node_id -> (lat, lon)
    city: str = "synthetic"
    num_nodes: int = 0
    num_edges: int = 0

    # CSR representation (built lazily)
    _csr_row: Optional[np.ndarray] = field(default=None, repr=False)
    _csr_col: Optional[np.ndarray] = field(default=None, repr=False)
    _csr_data: Optional[np.ndarray] = field(default=None, repr=False)
    _node_index: Optional[Dict[int, int]] = field(default=None, repr=False)

    def __post_init__(self):
        self.num_nodes = self.nx_graph.number_of_nodes()
        self.num_edges = self.nx_graph.number_of_edges()

    # ------------------------------------------------------------------
    # Edge weight updates (live traffic)
    # ------------------------------------------------------------------

    def update_edge_weight(self, u: int, v: int, new_weight: float) -> bool:
        """Update travel time on edge (u→v). Returns False if edge missing."""
        if not self.nx_graph.has_edge(u, v):
            return False
        self.nx_graph[u][v]["weight"] = max(0.1, new_weight)
        # Invalidate CSR cache
        self._csr_data = None
        return True

    def update_edge_speed(self, u: int, v: int, new_speed_kmh: float) -> bool:
        """Recompute travel time from new speed (km/h)."""
        if not self.nx_graph.has_edge(u, v):
            return False
        length_m = self.nx_graph[u][v].get("length", 100.0)
        new_weight = (length_m / 1000.0) / max(1.0, new_speed_kmh) * 3600.0
        self.nx_graph[u][v]["speed"] = new_speed_kmh
        return self.update_edge_weight(u, v, new_weight)

    def apply_congestion(self, congestion_factor: float, fraction: float = 0.2) -> List[Tuple[int, int]]:
        """
        Randomly multiply travel times on `fraction` of edges by
        `congestion_factor`.  Returns list of affected (u, v) pairs.
        """
        edges = list(self.nx_graph.edges())
        k = max(1, int(len(edges) * fraction))
        affected = random.sample(edges, k)
        for u, v in affected:
            old_w = self.nx_graph[u][v]["weight"]
            self.update_edge_weight(u, v, old_w * congestion_factor)
        logger.info("Congestion applied to %d edges (×%.1f)", k, congestion_factor)
        return affected

    # ------------------------------------------------------------------
    # CSR build
    # ------------------------------------------------------------------

    def build_csr(self) -> None:
        """Build Compressed Sparse Row arrays for cache-efficient traversal."""
        nodes = sorted(self.nx_graph.nodes())
        self._node_index = {n: i for i, n in enumerate(nodes)}
        n = len(nodes)
        row, col, data = [], [], []
        for u, v, attrs in self.nx_graph.edges(data=True):
            row.append(self._node_index[u])
            col.append(self._node_index[v])
            data.append(attrs.get("weight", 1.0))
        self._csr_row = np.array(row, dtype=np.int32)
        self._csr_col = np.array(col, dtype=np.int32)
        self._csr_data = np.array(data, dtype=np.float64)
        logger.debug("CSR built: %d nodes, %d edges", n, len(row))

    def get_neighbors(self, node: int) -> List[Tuple[int, float]]:
        """Return [(neighbor, weight), ...] for a node."""
        return [
            (v, self.nx_graph[node][v]["weight"])
            for v in self.nx_graph.successors(node)
        ]

    def get_reverse_neighbors(self, node: int) -> List[Tuple[int, float]]:
        """Return [(neighbor, weight), ...] on reverse graph."""
        return [
            (u, self.nx_graph[u][node]["weight"])
            for u in self.nx_graph.predecessors(node)
        ]

    @property
    def bbox(self) -> Optional[Tuple[float, float, float, float]]:
        """Return (south, west, north, east) bounding box of all nodes."""
        if not self.node_coords:
            return None
        lats = [c[0] for c in self.node_coords.values()]
        lons = [c[1] for c in self.node_coords.values()]
        return (min(lats), min(lons), max(lats), max(lons))

    def to_dict(self) -> dict:
        """Serialise graph metadata for API responses."""
        return {
            "city": self.city,
            "num_nodes": self.num_nodes,
            "num_edges": self.num_edges,
            "bbox": self.bbox,
        }


# ─────────────────────────────────────────────────────────────────────────────
# Synthetic graph generator (fallback / testing)
# ─────────────────────────────────────────────────────────────────────────────

def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in metres."""
    R = 6_371_000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def generate_synthetic_graph(
    num_nodes: int = 200,
    center_lat: float = 12.9716,
    center_lon: float = 77.5946,
    spread_deg: float = 0.15,
    avg_degree: int = 4,
    seed: int = 42,
) -> RoadGraph:
    """
    Build a synthetic road-like directed graph using a random geometric model.
    Nodes get random (lat, lon) coordinates; edges connect nodes within a
    radius threshold derived from `avg_degree`.
    """
    rng = random.Random(seed)
    np.random.seed(seed)

    # Generate node coordinates
    coords: Dict[int, Tuple[float, float]] = {}
    for i in range(num_nodes):
        lat = center_lat + rng.uniform(-spread_deg, spread_deg)
        lon = center_lon + rng.uniform(-spread_deg, spread_deg)
        coords[i] = (lat, lon)

    # Determine connection radius so that expected degree ≈ avg_degree
    # area ≈ (2*spread_deg * 111_000)^2 m^2
    area_m2 = (2 * spread_deg * 111_000) ** 2
    radius_m = math.sqrt(avg_degree * area_m2 / (math.pi * num_nodes))

    G = nx.DiGraph()
    for i in range(num_nodes):
        G.add_node(i, lat=coords[i][0], lon=coords[i][1])

    edge_count = 0
    for i in range(num_nodes):
        for j in range(num_nodes):
            if i == j:
                continue
            dist = _haversine(*coords[i], *coords[j])
            if dist <= radius_m:
                speed_kmh = rng.uniform(20.0, 60.0)
                travel_s = (dist / 1000.0) / speed_kmh * 3600.0
                G.add_edge(
                    i, j,
                    weight=travel_s,
                    length=dist,
                    speed=speed_kmh,
                )
                edge_count += 1

    # Ensure connectivity: add chain edges if graph is fragmented
    nodes = list(G.nodes())
    for k in range(len(nodes) - 1):
        if not nx.has_path(G, nodes[k], nodes[k + 1]):
            dist = _haversine(*coords[nodes[k]], *coords[nodes[k + 1]])
            speed_kmh = 30.0
            travel_s = (dist / 1000.0) / speed_kmh * 3600.0
            G.add_edge(nodes[k], nodes[k + 1], weight=travel_s, length=dist, speed=speed_kmh)
            G.add_edge(nodes[k + 1], nodes[k], weight=travel_s, length=dist, speed=speed_kmh)

    graph = RoadGraph(nx_graph=G, node_coords=coords, city="synthetic")
    graph.build_csr()
    logger.info(
        "Synthetic graph built: %d nodes, %d edges",
        graph.num_nodes, graph.num_edges
    )
    return graph


# ─────────────────────────────────────────────────────────────────────────────
# Area presets (Mumbai)
# ─────────────────────────────────────────────────────────────────────────────

AREAS = {
    "bkc": {
        "name": "BKC, Mumbai",
        "center": (19.0654, 72.8656),
        "radius_m": 5000,
    },
    "churchgate": {
        "name": "Churchgate, Mumbai",
        "center": (18.9322, 72.8264),
        "radius_m": 5000,
    },
    "lower_parel": {
        "name": "Lower Parel, Mumbai",
        "center": (18.9953, 72.8300),
        "radius_m": 5000,
    },
    "andheri": {
        "name": "Andheri, Mumbai",
        "center": (19.1136, 72.8697),
        "radius_m": 5000,
    },
    "powai": {
        "name": "Powai, Mumbai",
        "center": (19.1176, 72.9060),
        "radius_m": 5000,
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# GraphML cache helpers
# ─────────────────────────────────────────────────────────────────────────────

def _cache_path(area: str) -> Path:
    """Return the path to the cached GraphML file for an area."""
    _CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return _CACHE_DIR / f"{area.lower()}.graphml"


def _save_graphml(G_multi, area: str) -> None:
    """Save an osmnx MultiDiGraph as GraphML for later reuse."""
    import osmnx as ox
    path = _cache_path(area)
    ox.save_graphml(G_multi, filepath=str(path))
    logger.info("Graph cached to %s", path)


def _load_graphml(area: str):
    """Load a cached osmnx MultiDiGraph from GraphML. Returns None if missing."""
    path = _cache_path(area)
    if not path.exists():
        return None
    import osmnx as ox
    logger.info("Loading cached graph from %s", path)
    return ox.load_graphml(filepath=str(path))


# ─────────────────────────────────────────────────────────────────────────────
# OSM loader with caching
# ─────────────────────────────────────────────────────────────────────────────

def _multidigraph_to_roadgraph(G_multi, city: str) -> RoadGraph:
    """
    Convert an osmnx MultiDiGraph to our RoadGraph format.
    Uses osmnx speed imputation for missing maxspeed tags.
    """
    import osmnx as ox

    # Impute speeds from OSM maxspeed tags or highway type defaults
    G_multi = ox.add_edge_speeds(G_multi)
    G_multi = ox.add_edge_travel_times(G_multi)

    # Convert MultiDiGraph → DiGraph (keep shortest edge per pair)
    G = nx.DiGraph()
    coords: Dict[int, Tuple[float, float]] = {}

    for node, data in G_multi.nodes(data=True):
        G.add_node(node, **data)
        coords[node] = (data.get("y", 0.0), data.get("x", 0.0))

    for u, v, data in G_multi.edges(data=True):
        length_m = data.get("length", 100.0)
        speed_kmh = data.get("speed_kph", 30.0)
        if isinstance(speed_kmh, list):
            speed_kmh = float(speed_kmh[0])
        travel_s = data.get("travel_time", (length_m / 1000.0) / max(1.0, speed_kmh) * 3600.0)
        if isinstance(travel_s, list):
            travel_s = float(travel_s[0])

        if G.has_edge(u, v):
            if G[u][v]["weight"] > travel_s:
                G[u][v].update(weight=travel_s, length=length_m, speed=speed_kmh)
        else:
            G.add_edge(u, v, weight=travel_s, length=length_m, speed=speed_kmh)

    road_graph = RoadGraph(nx_graph=G, node_coords=coords, city=city)
    road_graph.build_csr()
    return road_graph


def load_osm_graph(area: str = "bkc") -> RoadGraph:
    """
    Load a real road network from OSM via osmnx.

    Checks for a cached GraphML file first.  If not found, downloads
    from the Overpass API and caches for next time.

    Parameters
    ----------
    area : str — key from AREAS dict (e.g. "bkc", "churchgate")

    Returns
    -------
    RoadGraph — the loaded road network.
    """
    preset = AREAS.get(area.lower())
    if preset is None:
        raise ValueError(f"Unknown area '{area}'. Available: {list(AREAS.keys())}")

    t0 = time.perf_counter()

    # Try cached first
    G_multi = _load_graphml(area)

    if G_multi is None:
        import osmnx as ox
        logger.info("Downloading OSM graph for %s (first time) ...", preset["name"])
        G_multi = ox.graph_from_point(
            preset["center"],
            dist=preset["radius_m"],
            network_type="drive",
            simplify=True,
        )
        _save_graphml(G_multi, area)

    road_graph = _multidigraph_to_roadgraph(G_multi, area)
    elapsed = time.perf_counter() - t0
    logger.info(
        "OSM graph ready [%s]: %d nodes, %d edges (%.2fs)",
        preset["name"], road_graph.num_nodes, road_graph.num_edges, elapsed,
    )
    return road_graph


# ─────────────────────────────────────────────────────────────────────────────
# Traffic profile simulation
# ─────────────────────────────────────────────────────────────────────────────

def apply_time_of_day_profile(graph: RoadGraph, hour: int) -> None:
    """
    Scale edge weights by a time-of-day factor.
    Peak hours (8–10, 17–20) → slower; off-peak → faster.
    """
    if 8 <= hour <= 10 or 17 <= hour <= 20:
        factor = 1.6   # 60% slower during peak
    elif 0 <= hour <= 5 or 22 <= hour <= 23:
        factor = 0.7   # 30% faster at night
    else:
        factor = 1.0

    for u, v in graph.nx_graph.edges():
        base_w = graph.nx_graph[u][v].get("base_weight", graph.nx_graph[u][v]["weight"])
        graph.nx_graph[u][v]["base_weight"] = base_w   # preserve original
        graph.update_edge_weight(u, v, base_w * factor)

    logger.info("Time-of-day profile applied: hour=%d factor=%.1f", hour, factor)
