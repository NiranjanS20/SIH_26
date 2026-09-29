"""
src/quantum/cluster_detector.py
───────────────────────────────
Phase 2 — Dense Cluster Detection for Micro-QAOA Decomposition

Identifies spatially dense sub-clusters within each vehicle's route that
qualify for quantum micro-optimization via QAOA.

A qualifying cluster has:
  - 4 to 8 stops (QAOA feasibility window on NISQ hardware)
  - All stops within a configurable radius (default 2 km)

Algorithm:
  1. For each vehicle route, compute pairwise distances between assigned stops
  2. Use greedy radius-based clustering: pick seed stop, grow cluster by
     absorbing all stops within MAX_CLUSTER_RADIUS_KM
  3. If cluster size is in [MIN_CLUSTER_SIZE, MAX_CLUSTER_SIZE], mark it
     as QAOA-eligible
  4. Remaining stops stay on the classical QPSO path

NOTE ON CONSTANTS: Radius and size bounds are tunable defaults for Mumbai
urban delivery zones, not universal thresholds. Adjust for different cities
or fleet configurations.
"""

from __future__ import annotations

import math
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np

from src.optimizer.encoding import VRPProblem

logger = logging.getLogger(__name__)

# Cluster detection parameters (tunable defaults for Mumbai urban zones)
MIN_CLUSTER_SIZE = 4      # Minimum stops for QAOA to be worthwhile
MAX_CLUSTER_SIZE = 8      # Maximum stops for NISQ circuit feasibility
MAX_CLUSTER_RADIUS_KM = 2.0  # Spatial radius for dense cluster detection


@dataclass
class StopCluster:
    """A group of stops identified as a dense local cluster."""
    vehicle_idx: int                    # Which vehicle owns this cluster
    stop_indices: List[int]             # Stop indices within the route
    centroid_lat: float                 # Cluster centroid latitude
    centroid_lon: float                 # Cluster centroid longitude
    max_intra_distance_km: float       # Maximum pairwise distance in cluster
    is_qaoa_eligible: bool             # Whether cluster qualifies for QAOA


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in kilometres between two lat/lon points."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
         * math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def detect_clusters(
    routes: List[List[int]],
    problem: VRPProblem,
    min_size: int = MIN_CLUSTER_SIZE,
    max_size: int = MAX_CLUSTER_SIZE,
    radius_km: float = MAX_CLUSTER_RADIUS_KM,
) -> List[StopCluster]:
    """
    Detect dense spatial clusters within each vehicle's route.

    For each route, uses greedy radius-based clustering:
      1. Pick the unvisited stop closest to the route centroid as seed
      2. Absorb all unvisited stops within radius_km of the seed
      3. If cluster size is in [min_size, max_size], mark as QAOA-eligible
      4. Repeat until all stops are clustered or checked

    Args:
        routes: List of routes, each route is a list of stop indices.
        problem: VRP problem instance with stop coordinates.
        min_size: Minimum stops for QAOA eligibility.
        max_size: Maximum stops for QAOA eligibility.
        radius_km: Spatial radius for cluster detection.

    Returns:
        List of StopCluster objects for qualifying clusters.
    """
    clusters: List[StopCluster] = []

    for vi, route in enumerate(routes):
        if len(route) < min_size:
            continue

        # Get coordinates for all stops in this route
        stop_coords = []
        for si in route:
            stop = problem.stops[si]
            stop_coords.append((stop.lat, stop.lon))

        # Greedy radius-based clustering
        used = [False] * len(route)

        for seed_idx in range(len(route)):
            if used[seed_idx]:
                continue

            seed_lat, seed_lon = stop_coords[seed_idx]
            cluster_indices = [seed_idx]
            used[seed_idx] = True

            # Find all nearby unused stops within radius
            for j in range(len(route)):
                if used[j]:
                    continue
                dist = _haversine_km(seed_lat, seed_lon,
                                     stop_coords[j][0], stop_coords[j][1])
                if dist <= radius_km:
                    cluster_indices.append(j)
                    used[j] = True

                    # Don't exceed max cluster size
                    if len(cluster_indices) >= max_size:
                        break

            if len(cluster_indices) < min_size:
                # Too small — release stops back to unvisited pool
                for ci in cluster_indices:
                    used[ci] = False
                continue

            # Compute cluster metrics
            actual_stop_indices = [route[ci] for ci in cluster_indices]
            lats = [stop_coords[ci][0] for ci in cluster_indices]
            lons = [stop_coords[ci][1] for ci in cluster_indices]
            centroid_lat = sum(lats) / len(lats)
            centroid_lon = sum(lons) / len(lons)

            # Max intra-cluster distance
            max_dist = 0.0
            for a in range(len(cluster_indices)):
                for b in range(a + 1, len(cluster_indices)):
                    d = _haversine_km(
                        stop_coords[cluster_indices[a]][0],
                        stop_coords[cluster_indices[a]][1],
                        stop_coords[cluster_indices[b]][0],
                        stop_coords[cluster_indices[b]][1],
                    )
                    max_dist = max(max_dist, d)

            cluster = StopCluster(
                vehicle_idx=vi,
                stop_indices=actual_stop_indices,
                centroid_lat=centroid_lat,
                centroid_lon=centroid_lon,
                max_intra_distance_km=round(max_dist, 3),
                is_qaoa_eligible=(min_size <= len(actual_stop_indices) <= max_size),
            )
            clusters.append(cluster)

            logger.info(
                "Cluster detected: vehicle %d, %d stops, radius %.2f km, QAOA=%s",
                vi, len(actual_stop_indices), max_dist, cluster.is_qaoa_eligible,
            )

    return clusters


def apply_resequencing(
    route: List[int],
    cluster: StopCluster,
    new_order: List[int],
) -> List[int]:
    """
    Apply a resequenced sub-order to a vehicle route.

    Replaces the cluster's stop indices in the route with the new ordering
    while preserving the position of non-cluster stops.

    Args:
        route: Original vehicle route (list of stop indices).
        cluster: The StopCluster being resequenced.
        new_order: New ordering of cluster.stop_indices (same stops, different order).

    Returns:
        Updated route with cluster stops resequenced.
    """
    # Find positions of cluster stops in the route
    cluster_set = set(cluster.stop_indices)
    positions = [i for i, s in enumerate(route) if s in cluster_set]

    if len(positions) != len(new_order):
        logger.warning(
            "Resequencing mismatch: %d positions vs %d new stops",
            len(positions), len(new_order),
        )
        return route

    # Replace cluster stops with new ordering
    updated = list(route)
    for pos, new_stop in zip(positions, new_order):
        updated[pos] = new_stop

    return updated
