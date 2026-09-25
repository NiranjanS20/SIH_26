"""
src/optimizer/encoding.py
─────────────────────────
Random-Key Encoding for VRP route representation.

QPSO particles live in continuous ℝⁿ space. This module maps
each particle vector → a valid set of vehicle routes via argsort.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import List, Optional

import numpy as np


# ─────────────────────────────────────────────────────────────────────────────
# Problem definition
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Stop:
    id: int
    lat: float
    lon: float
    demand: float = 1.0
    earliest: float = 0.0      # earliest service time (seconds from depot departure)
    latest: float = 86400.0    # latest service time
    priority: int = 1          # 1=low, 2=med, 3=high
    service_time_min: float = 5.0 # time taken to service the stop


@dataclass
class Vehicle:
    id: int
    capacity: float = 100.0
    is_ev: bool = False
    soc: float = 1.0           # state of charge [0, 1]
    energy_per_km: float = 0.2 # kWh per km (EV)
    max_distance_km: float = 200.0
    max_duration_min: float = 480.0
    cost_per_km: float = 10.0
    fixed_cost: float = 500.0
    type: str = "Van"          # Bike, Van, Mini Truck


@dataclass
class VRPProblem:
    depot_lat: float
    depot_lon: float
    stops: List[Stop]
    vehicles: List[Vehicle]
    dist_matrix: Optional[np.ndarray] = field(default=None, repr=False)
    time_matrix: Optional[np.ndarray] = field(default=None, repr=False)
    node_ids: Optional[List[int]] = field(default=None, repr=False)

    def __post_init__(self):
        if self.dist_matrix is None:
            self._build_euclidean_matrices()

    def _build_euclidean_matrices(self):
        """Fallback: build distance/time matrices from coordinates."""
        n = len(self.stops) + 1   # +1 for depot
        coords = [(self.depot_lat, self.depot_lon)] + [(s.lat, s.lon) for s in self.stops]
        D = np.zeros((n, n), dtype=np.float64)
        for i in range(n):
            for j in range(n):
                if i != j:
                    dlat = (coords[i][0] - coords[j][0]) * 111_000
                    dlon = (coords[i][1] - coords[j][1]) * 111_000 * math.cos(math.radians(coords[i][0]))
                    D[i][j] = math.hypot(dlat, dlon)
        self.dist_matrix = D
        self.time_matrix = D / (30 * 1000 / 3600)   # assume 30 km/h → seconds


# ─────────────────────────────────────────────────────────────────────────────
# Encoder / Decoder
# ─────────────────────────────────────────────────────────────────────────────

def decode_particle(
    particle: np.ndarray,
    problem: VRPProblem,
) -> List[List[int]]:
    """
    Decode a QPSO particle vector into a list of routes.
    Greedy assignment considering capacity, distance, and duration.
    """
    n_stops   = len(problem.stops)
    n_vehicles = len(problem.vehicles)

    perm = np.argsort(particle[:n_stops]).tolist()

    routes: List[List[int]] = [[] for _ in range(n_vehicles)]
    capacities = [v.capacity for v in problem.vehicles]
    max_distances = [v.max_distance_km * 1000.0 for v in problem.vehicles]
    max_durations = [v.max_duration_min * 60.0 for v in problem.vehicles]
    
    loads = [0.0] * n_vehicles
    distances = [0.0] * n_vehicles
    durations = [0.0] * n_vehicles
    current_nodes = [0] * n_vehicles # 0 is depot

    D = problem.dist_matrix
    T = problem.time_matrix

    veh_idx = 0
    for stop_idx in perm:
        demand = problem.stops[stop_idx].demand
        srv_time = problem.stops[stop_idx].service_time_min * 60.0
        node_idx = stop_idx + 1 # index in matrix

        placed = False
        start_veh = veh_idx
        while True:
            # Check if it fits in current vehicle
            dist_to = D[current_nodes[veh_idx]][node_idx]
            dist_home = D[node_idx][0]
            time_to = T[current_nodes[veh_idx]][node_idx]
            time_home = T[node_idx][0]

            if (loads[veh_idx] + demand <= capacities[veh_idx] and
                distances[veh_idx] + dist_to + dist_home <= max_distances[veh_idx] and
                durations[veh_idx] + time_to + srv_time + time_home <= max_durations[veh_idx]):
                
                # Assign
                routes[veh_idx].append(stop_idx)
                loads[veh_idx] += demand
                distances[veh_idx] += dist_to
                durations[veh_idx] += time_to + srv_time
                current_nodes[veh_idx] = node_idx
                placed = True
                break
            else:
                veh_idx = (veh_idx + 1) % n_vehicles
                if veh_idx == start_veh:
                    break

        if not placed:
            # Force assign to the vehicle with the most remaining capacity (violating constraints, will be penalized)
            best_v = int(np.argmax([c - l for c, l in zip(capacities, loads)]))
            routes[best_v].append(stop_idx)
            dist_to = D[current_nodes[best_v]][node_idx]
            time_to = T[current_nodes[best_v]][node_idx]
            loads[best_v] += demand
            distances[best_v] += dist_to
            durations[best_v] += time_to + srv_time
            current_nodes[best_v] = node_idx

    return routes


def encode_greedy(problem: VRPProblem) -> np.ndarray:
    n = len(problem.stops)
    D = problem.dist_matrix
    visited = [False] * n
    order = []
    current = 0

    for _ in range(n):
        best_dist = math.inf
        best_j = -1
        for j in range(1, n + 1):
            if not visited[j - 1] and D[current][j] < best_dist:
                best_dist = D[current][j]
                best_j = j
        if best_j == -1:
            break
        visited[best_j - 1] = True
        order.append(best_j - 1)
        current = best_j

    particle = np.zeros(n)
    for rank, stop_idx in enumerate(order):
        particle[stop_idx] = rank / n

    return particle
