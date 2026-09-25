"""
src/optimizer/fitness.py
────────────────────────
Multi-objective fitness function for QPSO route evaluation.

F(routes) = w_distance * norm_dist
          + w_time * norm_time
          + w_cost * norm_cost
          + penalty_for_violations
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import List, Optional

import numpy as np

from src.optimizer.encoding import VRPProblem


# ─────────────────────────────────────────────────────────────────────────────
# Fitness weights
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FitnessWeights:
    w_distance: float = 0.33
    w_time: float = 0.33
    w_cost: float = 0.34

    def normalise(self):
        """Ensure weights sum to 1."""
        total = self.w_distance + self.w_time + self.w_cost
        if total > 0:
            self.w_distance /= total
            self.w_time /= total
            self.w_cost /= total


# ─────────────────────────────────────────────────────────────────────────────
# Route cost helpers
# ─────────────────────────────────────────────────────────────────────────────

def route_distance(route: List[int], problem: VRPProblem) -> float:
    """Total metres from depot → stops → depot."""
    D = problem.dist_matrix
    if D is None:
        return 0.0
    nodes = [0] + [s + 1 for s in route] + [0]
    return sum(D[nodes[i]][nodes[i + 1]] for i in range(len(nodes) - 1))


def route_travel_time(route: List[int], problem: VRPProblem) -> float:
    """Total seconds from depot → stops → depot + service times."""
    T = problem.time_matrix
    if T is None:
        return 0.0
    nodes = [0] + [s + 1 for s in route] + [0]
    # Travel time
    travel = sum(T[nodes[i]][nodes[i + 1]] for i in range(len(nodes) - 1))
    # Service time
    service = sum(problem.stops[s].service_time_min * 60.0 for s in route)
    return travel + service


def route_cost(route: List[int], problem: VRPProblem, vehicle_idx: int) -> float:
    """Total cost in INR: fixed cost + distance cost + carbon tax."""
    from src.sustainability.emissions import route_co2_kg

    veh = problem.vehicles[vehicle_idx]
    dist_km = route_distance(route, problem) / 1000.0
    if len(route) == 0:
        return 0.0
        
    base_cost = veh.fixed_cost + (veh.cost_per_km * dist_km)
    
    # Introduce carbon tax for ICE vehicles (₹10 per kg CO2)
    carbon_tax = 0.0
    if not veh.is_ev:
        D = problem.dist_matrix
        if D is not None:
            nodes = [0] + [s + 1 for s in route] + [0]
            distances_m = [D[nodes[i]][nodes[i + 1]] for i in range(len(nodes) - 1)]
            co2_kg = route_co2_kg(distances_m, default_speed=30.0)
            carbon_tax = co2_kg * 10.0
            
    return base_cost + carbon_tax


def constraint_penalties(route: List[int], problem: VRPProblem, vehicle_idx: int) -> float:
    """
    Hard penalty for violating capacity, distance, or duration constraints.
    """
    veh = problem.vehicles[vehicle_idx]
    
    total_demand = sum(problem.stops[s].demand for s in route)
    dist_km = route_distance(route, problem) / 1000.0
    time_min = route_travel_time(route, problem) / 60.0

    penalty = 0.0
    
    # Capacity
    if total_demand > veh.capacity:
        penalty += (total_demand - veh.capacity) * 1000.0  # High penalty per unit over capacity
        
    # Distance
    if dist_km > veh.max_distance_km:
        penalty += (dist_km - veh.max_distance_km) * 1000.0
        
    # Duration
    if time_min > veh.max_duration_min:
        penalty += (time_min - veh.max_duration_min) * 1000.0
        
    return penalty


# ─────────────────────────────────────────────────────────────────────────────
# Main fitness evaluator
# ─────────────────────────────────────────────────────────────────────────────

class FitnessEvaluator:
    def __init__(self, problem: VRPProblem, weights: Optional[FitnessWeights] = None):
        self.problem = problem
        self.weights = weights or FitnessWeights()
        self.weights.normalise()
        # Normalisation denominators
        self._norm_dist: float = 1.0
        self._norm_time: float = 1.0
        self._norm_cost: float = 1.0
        self._calibrated: bool = False

    def calibrate(self, sample_routes: List[List[List[int]]]) -> None:
        """Compute normalisation constants from a sample of solutions."""
        dists, times, costs = [], [], []
        for routes in sample_routes:
            if not isinstance(routes, list):
                continue
            
            total_dist = 0.0
            total_time = 0.0
            total_cost = 0.0
            
            for vi, route in enumerate(routes):
                if not route or not isinstance(route, list):
                    continue
                if not isinstance(route[0], (int, np.integer)):
                    continue
                    
                total_dist += route_distance(route, self.problem)
                total_time += route_travel_time(route, self.problem)
                total_cost += route_cost(route, self.problem, vi)
                
            dists.append(total_dist)
            times.append(total_time)
            costs.append(total_cost)
            
        self._norm_dist = max(max(dists, default=1.0), 1.0)
        self._norm_time = max(max(times, default=1.0), 1.0)
        self._norm_cost = max(max(costs, default=1.0), 1.0)
        self._calibrated = True

    def evaluate(
        self,
        routes: List[List[int]],
        edge_weights: Optional[np.ndarray] = None,
    ) -> float:
        """
        Compute scalar fitness for a set of routes (lower is better).
        """
        w = self.weights
        total_dist   = 0.0
        total_time   = 0.0
        total_cost   = 0.0
        total_viol   = 0.0

        for vi, route in enumerate(routes):
            if not route:
                continue
            total_dist += route_distance(route, self.problem)
            total_time += route_travel_time(route, self.problem)
            total_cost += route_cost(route, self.problem, vi)
            total_viol += constraint_penalties(route, self.problem, vi)

        # Normalise
        nd = total_dist / self._norm_dist
        nt = total_time / self._norm_time
        nc = total_cost / self._norm_cost

        return w.w_distance * nd + w.w_time * nt + w.w_cost * nc + total_viol
