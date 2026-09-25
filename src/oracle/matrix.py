"""
src/oracle/matrix.py
────────────────────
Distance & travel-time matrix builder using multi-source Dijkstra
on the ORIGINAL road graph.

Replaces the broken `D[i][j] = time * (30/3.6)` approximation from main.py.
"""

from __future__ import annotations

import logging
import time
from typing import Dict, List, Tuple

import numpy as np

from src.graph.loader import RoadGraph
from src.graph.routing import dijkstra_single_source

logger = logging.getLogger(__name__)


def build_matrix(
    graph: RoadGraph,
    node_ids: List[int],
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Build symmetric distance (metres) and travel-time (seconds) matrices
    for the given graph node IDs.

    Parameters
    ----------
    graph : RoadGraph — the ORIGINAL road graph (not CH-augmented)
    node_ids : List[int] — list of N graph node IDs
        index 0 is typically the depot, 1..N-1 are stop nodes.

    Returns
    -------
    (D, T) — both np.ndarray of shape (N, N)
      D[i][j] = shortest-path distance in metres from node_ids[i] to node_ids[j]
      T[i][j] = shortest-path travel time in seconds
    """
    t0 = time.perf_counter()
    n = len(node_ids)
    D = np.full((n, n), np.inf, dtype=np.float64)
    T = np.full((n, n), np.inf, dtype=np.float64)
    np.fill_diagonal(D, 0.0)
    np.fill_diagonal(T, 0.0)

    G = graph.nx_graph

    for i, src in enumerate(node_ids):
        # Run Dijkstra once from src with weight="weight" (travel time)
        time_dists = dijkstra_single_source(graph, src, targets=node_ids, weight_key="weight")

        # Run Dijkstra once from src with weight="length" (physical distance)
        dist_dists = dijkstra_single_source(graph, src, targets=node_ids, weight_key="length")

        for j, dst in enumerate(node_ids):
            if i == j:
                continue
            T[i][j] = time_dists.get(dst, np.inf)
            D[i][j] = dist_dists.get(dst, np.inf)

    # Replace unreachable (inf) with large penalty to keep solvers working
    unreachable_mask = np.isinf(D) | np.isinf(T)
    unreachable_count = np.count_nonzero(unreachable_mask) - n  # subtract diagonal
    if unreachable_count > 0:
        logger.warning(
            "Matrix has %d unreachable pairs (%.1f%%). Using penalty values.",
            unreachable_count // 2,
            unreachable_count / (n * n) * 100,
        )
        # Use 10x the max finite value as penalty
        max_d = np.max(D[np.isfinite(D)]) if np.any(np.isfinite(D)) else 100_000.0
        max_t = np.max(T[np.isfinite(T)]) if np.any(np.isfinite(T)) else 10_000.0
        D[np.isinf(D)] = max_d * 10
        T[np.isinf(T)] = max_t * 10

    elapsed = time.perf_counter() - t0
    logger.info(
        "Matrix built: %d nodes, %.2fs (%.1f queries/sec)",
        n, elapsed, (n * 2) / max(elapsed, 0.001),
    )
    return D, T
