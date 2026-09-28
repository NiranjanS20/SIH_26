"""
src/optimizer/fitness.py
────────────────────────
QIDRE Multi-Objective Fitness Evaluator (Phase 2 + Phase 3 update)

5-term fitness function per next_feature_quantum.pdf, Section 3:

  Fitness(x) = w_time * norm_time
             + w_distance * norm_dist
             + w_energy * norm_energy
             + w_cognitive * norm_cognitive
             + Penalties

Where:
  - w_time = 0.35, w_distance = 0.15, w_energy = 0.25, w_cognitive = 0.25
    (tunable via API / frontend sliders)
  - Energy uses FleetEnergyEngine thermodynamic model
    (src/sustainability/emissions.py, Phase 1)
  - Cognitive uses CognitiveLoadEvaluator (Phase 2 + Phase 3):
      Phase 2: α₁·CongestionRatio + α₂·UnprotectedRightTurn(estimated) + α₃·StopDensityStrain
      Phase 3: Replaces estimated right-turn count with exact OSMnx geometric
               turn-angle detection via TurnAnalyzer when a RoadGraph is available.
               Uses spec T_junction formula (§3.2): 3.5×(1+cong) right, 1.5 left, 0.2 straight.
  - Fleet equity penalty via Gini coefficient (§4) — triggers steep re-allocation
    penalty when G_fleet > 0.15.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Dict, List, Optional

import numpy as np

from src.optimizer.encoding import VRPProblem
from src.optimizer.turn_analyzer import TurnAnalyzer, estimate_turns_from_stops


# ─────────────────────────────────────────────────────────────────────────────
# Fitness weights (4-objective, tunable)
# Default spec from next_feature_quantum.pdf §3 (Step 3 weights)
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FitnessWeights:
    w_distance: float = 0.15
    w_time: float = 0.35
    w_cost: float = 0.0        # Kept for legacy callers; unused when energy active
    w_energy: float = 0.25     # Thermodynamic EV kWh / ICE fuel cost
    w_cognitive: float = 0.25  # Driver ergonomic stress index

    def normalise(self):
        """Ensure active weights sum to 1."""
        total = self.w_distance + self.w_time + self.w_cost + self.w_energy + self.w_cognitive
        if total > 0:
            self.w_distance /= total
            self.w_time /= total
            self.w_cost /= total
            self.w_energy /= total
            self.w_cognitive /= total


# ─────────────────────────────────────────────────────────────────────────────
# Route cost helpers (legacy, preserved for backward compatibility)
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
    """Total cost in INR: fixed cost + distance cost + carbon tax (legacy)."""
    from src.sustainability.emissions import route_co2_kg

    veh = problem.vehicles[vehicle_idx]
    dist_km = route_distance(route, problem) / 1000.0
    if len(route) == 0:
        return 0.0

    base_cost = veh.fixed_cost + (veh.cost_per_km * dist_km)

    # Carbon tax for ICE vehicles (₹10 per kg CO₂)
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
        penalty += (total_demand - veh.capacity) * 1000.0

    # Distance
    if dist_km > veh.max_distance_km:
        penalty += (dist_km - veh.max_distance_km) * 1000.0

    # Duration
    if time_min > veh.max_duration_min:
        penalty += (time_min - veh.max_duration_min) * 1000.0

    return penalty


# ─────────────────────────────────────────────────────────────────────────────
# PHASE 1 HOOK — Route energy cost via FleetEnergyEngine
# ─────────────────────────────────────────────────────────────────────────────

def route_energy_cost(route: List[int], problem: VRPProblem, vehicle_idx: int) -> float:
    """
    Compute normalised energy cost for a route using the thermodynamic
    FleetEnergyEngine (Phase 1).

    Returns a scalar comparable to route_cost():
      - EV: kWh consumed (proportional to battery draw + CO₂ via grid)
      - ICE: fuel cost in INR (liters × ₹95/liter diesel, IOCL 2026)

    Falls back gracefully if matrices are absent.
    """
    from src.sustainability.emissions import FleetEnergyEngine

    D = problem.dist_matrix
    T = problem.time_matrix
    if D is None or T is None or not route:
        return route_cost(route, problem, vehicle_idx)

    veh = problem.vehicles[vehicle_idx] if vehicle_idx < len(problem.vehicles) else None
    if veh is None:
        return 0.0

    engine = FleetEnergyEngine.from_vehicle(veh)
    nodes = [0] + [s + 1 for s in route] + [0]

    edge_list = []
    for i in range(len(nodes) - 1):
        d_m = float(D[nodes[i]][nodes[i + 1]])
        t_s = float(T[nodes[i]][nodes[i + 1]])
        edge_list.append({
            "length_m": d_m,
            "duration_s": max(t_s, 1.0),
            "free_flow_speed_kmh": 40.0,  # Mumbai urban free-flow baseline
            "elevation_gain_m": 0.0,       # Mumbai is predominantly flat
        })

    result = engine.calculate_route_energy(edge_list)

    if engine.is_electric:
        # Return kWh as scalar (will be normalised vs fleet total)
        return result.total_energy_kwh
    else:
        # ICE: convert liters → INR cost (IOCL Mumbai diesel ₹95/L)
        return result.total_fuel_liters * 95.0


# ─────────────────────────────────────────────────────────────────────────────
# PHASE 2 — Driver Cognitive Workload & Stress Index
# Spec: next_feature_quantum.pdf, §2B and §3 (Step 2)
#
# S_cognitive = α₁·Σ CongestionRatio(e)
#             + α₂·Σ I_UnprotectedRightTurn(e)
#             + α₃·StopDensityStrain
#
# CongestionRatio(e) = (v_freeflow - v_predicted) / v_freeflow   [0, 1]
# I_UnprotectedRightTurn = 1 if crossing oncoming traffic, else 0
# StopDensityStrain = max(0, stop_count - 15) * 3.0
# ─────────────────────────────────────────────────────────────────────────────

# Cognitive stress α-weights (spec §2B)
_ALPHA_CONGESTION = 1.8     # Congestion-related clutch/brake fatigue per minute
_ALPHA_RIGHT_TURN = 2.5     # High-risk unprotected right-turn across oncoming traffic
_ALPHA_STOP_DENSITY = 3.0   # Excess task-switching penalty per stop above 15

# Speed-ratio threshold below which severe crawl penalty applies
_SEVERE_CRAWL_SPEED_RATIO = 0.4  # < 40% of free-flow speed


class CognitiveLoadEvaluator:
    """
    Computes ergonomic stress score per route using deterministic
    transportation-engineering factors (no biometric sensors required).

    Spec: next_feature_quantum.pdf §2B, §3.2 — Route Ergonomics & Cognitive Stress Reduction
    Four additive components (Phase 2 + Phase 3):

    1. Traffic Friction Index / Congestion Fatigue (C_friction)
       — speed_ratio < 0.4 triggers severe crawl: α₁=1.8 × duration_min
       — otherwise light congestion: 0.5 × duration_min

    2. Junction Maneuver Risk / T_junction (Phase 3 upgrade)
       — Phase 3 (graph available): exact OSMnx bearing → T_junction(e) formula
         right turn: 3.5 × (1 + CongestionFactor), left: 1.5, straight: 0.2, U-turn: 4.5
       — Phase 2 fallback (no graph): empirical 15% right-turn estimate × 2.5

    3. Stop Density Strain / W_density
       — +3.0 per stop exceeding 15 (task-switching overload)

    4. Fleet Workload Inequity (G_fleet, Gini coefficient)
       — CV² metric; steep penalty injected when G_fleet > 0.15
    """

    def __init__(self, road_graph=None):
        """
        Args:
            road_graph: Optional RoadGraph from src.graph.loader.
                        When provided, enables Phase 3 exact turn-angle analysis.
        """
        self._turn_analyzer = TurnAnalyzer(road_graph)
        self._has_graph = road_graph is not None

    def calculate_route_cognitive_load(
        self,
        route: List[int],
        problem: VRPProblem,
        free_flow_speed_kmh: float = 40.0,
    ) -> float:
        """
        Compute cognitive stress score for a single vehicle route.

        Phase 3 upgrade: when a RoadGraph is loaded, uses exact OSMnx
        bearing-based turn-angle detection (TurnAnalyzer) instead of
        the Phase 2 empirical 15% right-turn estimate.

        Args:
            route: List of stop indices (0-based, mapped to problem.stops).
            problem: The VRPProblem instance with dist/time matrices.
            free_flow_speed_kmh: Baseline free-flow speed for this route.

        Returns:
            Scalar stress score (higher = more stressful for driver).
        """
        D = problem.dist_matrix
        T = problem.time_matrix

        if not route:
            return 0.0

        stress_score = 0.0
        stop_count = len(route)
        nodes = [0] + [s + 1 for s in route] + [0]

        # Per-edge speed ratios (for congestion factor computation)
        speed_ratios: List[float] = []

        # ── Component 1: Traffic Friction Index (C_friction) ──────────────
        for i in range(len(nodes) - 1):
            d_m = float(D[nodes[i]][nodes[i + 1]]) if D is not None else 100.0
            t_s = float(T[nodes[i]][nodes[i + 1]]) if T is not None else 10.0
            duration_min = t_s / 60.0

            if t_s > 0 and d_m > 0:
                actual_speed_kmh = (d_m / 1000.0) / (t_s / 3600.0)
            else:
                actual_speed_kmh = free_flow_speed_kmh

            speed_ratio = actual_speed_kmh / max(free_flow_speed_kmh, 1.0)
            speed_ratios.append(speed_ratio)

            if speed_ratio < _SEVERE_CRAWL_SPEED_RATIO:
                stress_score += _ALPHA_CONGESTION * duration_min
            else:
                stress_score += 0.5 * duration_min

        # ── Component 2: Junction Maneuver Risk (T_junction) ──────────────
        # Phase 3: use exact OSMnx geometric turn detection if graph loaded
        if self._has_graph and hasattr(problem, "node_ids") and problem.node_ids:
            # Build the actual OSM node ID sequence for this route
            osm_nodes = [problem.node_ids[n] for n in nodes if n < len(problem.node_ids)]
            if len(osm_nodes) >= 3:
                turn_events = self._turn_analyzer.analyze_route(
                    osm_nodes, congestion_ratios=speed_ratios
                )
                junction_cost = self._turn_analyzer.total_junction_cost(turn_events)
                stress_score += junction_cost
            else:
                # Fallback: empirical estimate
                est = estimate_turns_from_stops(stop_count)
                stress_score += est["total_junction_cost"]
        else:
            # Phase 2 fallback: empirical 15% right-turn estimate
            # (TRL India 2023 Mumbai urban delivery study)
            estimated_right_turns = stop_count * 0.15
            stress_score += _ALPHA_RIGHT_TURN * estimated_right_turns

        # ── Component 3: Stop Density Strain (W_density) ──────────────────
        if stop_count > 15:
            stress_score += (stop_count - 15) * _ALPHA_STOP_DENSITY

        return stress_score

    def fleet_workload_equity_penalty(
        self, per_route_scores: List[float]
    ) -> float:
        """
        Gini coefficient-inspired equity penalty.

        Spec: next_feature_quantum.pdf §4 — G_fleet formula:
          G_fleet = Σᵢ Σⱼ |Sᵢ - Sⱼ| / (2K·Σₖ Sₖ)

        When G_fleet > 0.15, injects a steep quadratic penalty into the swarm
        fitness to force route re-allocation (§4: 'if G_fleet > 0.15, steep
        quadratic penalty is injected').

        Implementation uses the numerically stable sorted-array Gini formula.
        """
        active = [s for s in per_route_scores if s > 0.0]
        if len(active) < 2:
            return 0.0

        arr = np.sort(np.array(active, dtype=float))
        n = len(arr)
        total = np.sum(arr)
        if total < 1e-9:
            return 0.0

        # Gini coefficient via sorted-array formula
        index = np.arange(1, n + 1)
        gini = (2.0 * np.sum(index * arr) - (n + 1) * total) / (n * total)
        gini = float(np.clip(gini, 0.0, 1.0))

        # Spec §4: steep quadratic penalty when G_fleet > 0.15
        _GINI_THRESHOLD = 0.15
        if gini > _GINI_THRESHOLD:
            excess = gini - _GINI_THRESHOLD
            return 10.0 * (excess ** 2)  # quadratic re-allocation pressure
        return 0.0


# ─────────────────────────────────────────────────────────────────────────────
# Main fitness evaluator (extended to 5-term)
# ─────────────────────────────────────────────────────────────────────────────

class FitnessEvaluator:
    def __init__(
        self,
        problem: VRPProblem,
        weights: Optional[FitnessWeights] = None,
        road_graph=None,
    ):
        """
        Args:
            problem: The VRP problem instance.
            weights: Optional FitnessWeights (defaults to spec values).
            road_graph: Optional RoadGraph for Phase 3 turn-angle detection.
                        Pass _state.graph from the API to enable exact junction analysis.
        """
        self.problem = problem
        self.weights = weights or FitnessWeights()
        self.weights.normalise()
        # Normalisation denominators (calibrated from sample solutions)
        self._norm_dist: float = 1.0
        self._norm_time: float = 1.0
        self._norm_cost: float = 1.0
        self._norm_energy: float = 1.0
        self._norm_cognitive: float = 1.0
        self._calibrated: bool = False

        # Phase 3: pass road_graph for exact turn-angle detection
        self._cognitive_evaluator = CognitiveLoadEvaluator(road_graph=road_graph)

    def calibrate(self, sample_routes: List[List[List[int]]]) -> None:
        """Compute normalisation constants from a sample of solutions."""
        dists, times, costs, energies, cognitives = [], [], [], [], []

        for routes in sample_routes:
            if not isinstance(routes, list):
                continue

            total_dist = 0.0
            total_time = 0.0
            total_cost = 0.0
            total_energy = 0.0
            total_cognitive = 0.0

            for vi, route in enumerate(routes):
                if not route or not isinstance(route, list):
                    continue
                if not isinstance(route[0], (int, np.integer)):
                    continue

                total_dist += route_distance(route, self.problem)
                total_time += route_travel_time(route, self.problem)
                total_cost += route_cost(route, self.problem, vi)
                total_energy += route_energy_cost(route, self.problem, vi)
                total_cognitive += self._cognitive_evaluator.calculate_route_cognitive_load(
                    route, self.problem
                )

            dists.append(total_dist)
            times.append(total_time)
            costs.append(total_cost)
            energies.append(total_energy)
            cognitives.append(total_cognitive)

        self._norm_dist = max(max(dists, default=1.0), 1.0)
        self._norm_time = max(max(times, default=1.0), 1.0)
        self._norm_cost = max(max(costs, default=1.0), 1.0)
        self._norm_energy = max(max(energies, default=1.0), 1.0)
        self._norm_cognitive = max(max(cognitives, default=1.0), 1.0)
        self._calibrated = True

    def evaluate(
        self,
        routes: List[List[int]],
        edge_weights: Optional[np.ndarray] = None,
    ) -> float:
        """
        Compute scalar fitness for a set of routes (lower is better).

        5-term objective:
          F = w_time·T̂ + w_dist·D̂ + w_energy·Ê + w_cognitive·Ŝ + Penalties
        """
        w = self.weights
        total_dist = 0.0
        total_time = 0.0
        total_energy = 0.0
        total_cognitive = 0.0
        total_viol = 0.0

        per_route_cognitive: List[float] = []

        for vi, route in enumerate(routes):
            if not route:
                continue

            total_dist += route_distance(route, self.problem)
            total_time += route_travel_time(route, self.problem)
            total_energy += route_energy_cost(route, self.problem, vi)
            total_viol += constraint_penalties(route, self.problem, vi)

            cog_score = self._cognitive_evaluator.calculate_route_cognitive_load(
                route, self.problem
            )
            total_cognitive += cog_score
            per_route_cognitive.append(cog_score)

        # Fleet workload equity (Gini-variance penalty)
        equity_penalty = self._cognitive_evaluator.fleet_workload_equity_penalty(
            per_route_cognitive
        )

        # Normalise all objectives
        nd = total_dist / self._norm_dist
        nt = total_time / self._norm_time
        ne = total_energy / self._norm_energy
        nc = total_cognitive / self._norm_cognitive

        return (
            w.w_distance * nd
            + w.w_time * nt
            + w.w_energy * ne
            + w.w_cognitive * nc
            + equity_penalty        # Fleet equity term (scale-free)
            + total_viol            # Hard constraint penalties
        )
