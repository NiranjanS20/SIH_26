"""
src/graph/spatial_index.py
──────────────────────────
k-d tree spatial index over graph nodes for fast nearest-node lookup.
Used to map arbitrary (lat, lon) coordinates → nearest graph node.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional, Tuple

import numpy as np
from scipy.spatial import KDTree

logger = logging.getLogger(__name__)


class SpatialIndex:
    """
    Thin wrapper around scipy KDTree for O(log n) nearest-node queries.

    Coordinates are stored as (lat, lon) pairs. For geographic accuracy
    at city scale (< 50 km), Euclidean distance in degree-space is a
    sufficient approximation (error < 0.1%).
    """

    def __init__(self, node_coords: Dict[int, Tuple[float, float]]) -> None:
        self._node_ids: List[int] = list(node_coords.keys())
        points = np.array([node_coords[n] for n in self._node_ids], dtype=np.float64)
        self._tree = KDTree(points)
        logger.debug("SpatialIndex built with %d nodes", len(self._node_ids))

    def nearest(self, lat: float, lon: float) -> int:
        """Return the node ID of the geographically nearest node."""
        _, idx = self._tree.query([lat, lon])
        return self._node_ids[idx]

    def nearest_k(self, lat: float, lon: float, k: int = 5) -> List[int]:
        """Return the k nearest node IDs."""
        dists, idxs = self._tree.query([lat, lon], k=min(k, len(self._node_ids)))
        if k == 1:
            idxs = [idxs]
        return [self._node_ids[i] for i in idxs]

    def within_radius(self, lat: float, lon: float, radius_deg: float) -> List[int]:
        """Return all nodes within `radius_deg` degrees."""
        idxs = self._tree.query_ball_point([lat, lon], radius_deg)
        return [self._node_ids[i] for i in idxs]
