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

NOTE ON CONSTANTS: All α-weights, normalization divisors, penalty multipliers,
and threshold values in this module are tunable defaults calibrated from
Mumbai urban delivery route heuristics — they are NOT universal physical
constants. Adjust through validation against operational fleet data.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

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

# Cognitive stress α-weights (spec §2B & Feature #6)
# NOTE: These are tunable defaults, not measured constants.
# Calibrated from Mumbai urban delivery route heuristics (TRL India 2023 / SaveLIFE).
_ALPHA_CONGESTION = 1.8       # Congestion-related clutch/brake fatigue per minute
_ALPHA_RIGHT_TURN = 2.5       # High-risk unprotected right-turn across oncoming traffic
_ALPHA_STOP_DENSITY = 3.0     # Excess task-switching penalty per stop above 15
_ALPHA_URGENCY = 2.0          # Delivery-window panic multiplier (Feature #6)
_SIGMA_SLACK_SECONDS = 900.0   # 15 minutes operational slack tolerance

# Speed-ratio threshold below which severe crawl penalty applies
_SEVERE_CRAWL_SPEED_RATIO = 0.4  # < 40% of free-flow speed (tunable)


def compute_gini_coefficient(driver_scores: List[float]) -> float:
    """
    Calculates Gini coefficient of effort across fleet drivers.
    Returns value between 0.0 (perfect equity) and 1.0 (complete inequity).

    Spec: next_feature_quantum.pdf §4 & Feature-by-feature assessment #7.
    """
    if not driver_scores or len(driver_scores) <= 1:
        return 0.0
    active = [s for s in driver_scores if s > 0.0]
    if len(active) <= 1:
        return 0.0
    scores = np.sort(np.array(active, dtype=np.float64))
    n = len(scores)
    total = np.sum(scores)
    if total <= 1e-9:
        return 0.0
    index = np.arange(1, n + 1)
    gini = ((2.0 * np.sum(index * scores)) / (n * total)) - ((n + 1.0) / n)
    return float(np.clip(gini, 0.0, 1.0))


class CognitiveLoadEvaluator:
    """
    Computes ergonomic stress score per route using deterministic
    transportation-engineering factors (no biometric sensors required).

    Spec: next_feature_quantum.pdf §2B, §3.2 — Route Ergonomics & Cognitive Stress Reduction
    Four additive components (Phase 2 + Phase 3 + Feature #6):

    1. Traffic Friction Index / Congestion Fatigue (C_friction)
       — speed_ratio < 0.4 triggers severe crawl: α₁=1.8 × duration_min
       — otherwise light congestion: 0.5 × duration_min

    2. Junction Maneuver Risk / T_junction (MoRTH / SaveLIFE LHD safety model)
       — Phase 3: exact OSMnx bearing → T_junction(e) formula
         unprotected right turn: 3.5 × (1 + CongestionFactor), left: 1.5, straight: 0.2, U-turn: 4.5
       — Fallback (no graph): empirical 15% right-turn estimate × 2.5

    3. Stop Density Strain / W_density
       — +3.0 per stop exceeding 15 (task-switching overload)

    4. Delivery Urgency / Time-Window Panic (P_urgency) — Feature #6
       — exp(max(0, (t_arrival - t_latest) / σ_slack)) - 1
       — Baked directly into the swarm's search objective to prevent burnout

    5. Fleet Workload Inequity (G_fleet, Gini coefficient)
       — Steep penalty injected when G_fleet > 0.15
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
        return_breakdown: bool = False,
    ):
        """
        Compute cognitive stress score for a single vehicle route.

        Args:
            route: List of stop indices (0-based, mapped to problem.stops).
            problem: The VRPProblem instance with dist/time matrices.
            free_flow_speed_kmh: Baseline free-flow speed for this route.
            return_breakdown: If True, returns dict with sub-scores.

        Returns:
            Scalar stress score (higher = more stressful for driver) if return_breakdown is False,
            otherwise dict with component breakdown.
        """
        D = problem.dist_matrix
        T = problem.time_matrix

        if not route:
            if return_breakdown:
                return {
                    "total_score": 0.0,
                    "friction_score": 0.0,
                    "junction_score": 0.0,
                    "density_score": 0.0,
                    "urgency_score": 0.0,
                    "burnout_risk_status": "OPTIMAL",
                }
            return 0.0

        friction_score = 0.0
        junction_score = 0.0
        density_score = 0.0
        urgency_score = 0.0

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
                friction_score += _ALPHA_CONGESTION * duration_min
            else:
                friction_score += 0.5 * duration_min

        # ── Component 2: Junction Maneuver Risk (T_junction) ──────────────
        # Exact OSMnx geometric turn detection if graph loaded
        if self._has_graph and hasattr(problem, "node_ids") and problem.node_ids:
            osm_nodes = [problem.node_ids[n] for n in nodes if n < len(problem.node_ids)]
            if len(osm_nodes) >= 3:
                turn_events = self._turn_analyzer.analyze_route(
                    osm_nodes, congestion_ratios=speed_ratios
                )
                junction_score += self._turn_analyzer.total_junction_cost(turn_events)
            else:
                est = estimate_turns_from_stops(stop_count)
                junction_score += est["total_junction_cost"]
        else:
            # Empirical 15% right-turn estimate (TRL India 2023 Mumbai study)
            estimated_right_turns = stop_count * 0.15
            junction_score += _ALPHA_RIGHT_TURN * estimated_right_turns

        # ── Component 3: Stop Density Strain (W_density) ──────────────────
        if stop_count > 15:
            density_score += (stop_count - 15) * _ALPHA_STOP_DENSITY

        # ── Component 4: Delivery Urgency / Time-Window Panic (P_urgency) ───
        # Feature #6: exp(max(0, (t_arrival - t_latest) / sigma_slack)) - 1
        current_time_s = 0.0
        urgency_panic_total = 0.0

        for i in range(len(nodes) - 1):
            u, v = nodes[i], nodes[i + 1]
            t_edge = float(T[u][v]) if T is not None else 10.0
            current_time_s += max(t_edge, 0.0)

            # Check if destination v is a customer stop (1-based in nodes, 0-based in route)
            if v > 0 and (v - 1) < len(problem.stops):
                stop = problem.stops[v - 1]
                t_latest = getattr(stop, "latest", 86400.0)
                t_lateness = max(0.0, current_time_s - t_latest)
                if t_lateness > 0.0:
                    panic = math.exp(min(t_lateness / _SIGMA_SLACK_SECONDS, 5.0)) - 1.0
                    urgency_panic_total += panic
                srv_s = getattr(stop, "service_time_min", 5.0) * 60.0
                current_time_s += srv_s

        urgency_score = _ALPHA_URGENCY * urgency_panic_total

        total_stress = friction_score + junction_score + density_score + urgency_score

        if return_breakdown:
            burnout_status = "OPTIMAL" if total_stress < 35.0 else ("DEMANDING" if total_stress <= 60.0 else "BURNOUT_RISK")
            return {
                "total_score": round(total_stress, 3),
                "friction_score": round(friction_score, 3),
                "junction_score": round(junction_score, 3),
                "density_score": round(density_score, 3),
                "urgency_score": round(urgency_score, 3),
                "burnout_risk_status": burnout_status,
            }

        return total_stress

    def fleet_workload_equity_penalty(
        self, per_route_scores: List[float]
    ) -> float:
        """
        Gini coefficient-inspired equity penalty.

        Spec: next_feature_quantum.pdf §4 — G_fleet formula:
          G_fleet = Σᵢ Σⱼ |Sᵢ - Sⱼ| / (2K·Σₖ Sₖ)

        When G_fleet > 0.15, injects a steep quadratic penalty into the swarm
        fitness to force route re-allocation.
        """
        gini = compute_gini_coefficient(per_route_scores)

        # Spec §4: steep penalty when G_fleet > 0.15
        _GINI_THRESHOLD = 0.15
        if gini > _GINI_THRESHOLD:
            excess = gini - _GINI_THRESHOLD
            return 15.0 * excess + 10.0 * (excess ** 2)
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


def evaluate_swarm_fitness(
    particle_assignment: Dict[int, List[Dict]],
    weights: Dict[str, float],
    energy_engine: Any,
) -> float:
    """
    Evaluates particle multi-objective fitness factoring time, distance,
    energy consumption, cognitive fatigue, and fleet equity.

    Spec: next_feature_quantum.pdf §5.2 (Page 6).
    """
    total_time_s = 0.0
    total_dist_m = 0.0
    total_energy_kwh = 0.0
    total_fuel_l = 0.0
    driver_stress_scores: List[float] = []

    for vehicle_id, route_edges in particle_assignment.items():
        v_time = sum(e.get("duration_s", 0.0) for e in route_edges)
        v_dist = sum(e.get("length_m", 0.0) for e in route_edges)
        v_energy = 0.0
        v_fuel = 0.0
        v_stress = 0.0

        for edge in route_edges:
            e_metrics = energy_engine.calculate_edge_energy(
                length_m=edge.get("length_m", 0.0),
                duration_s=edge.get("duration_s", 1.0),
                free_flow_speed_kmh=edge.get("free_flow_speed_kmh", 40.0),
                elevation_gain_m=edge.get("elevation_gain_m", 0.0),
            )
            v_energy += e_metrics.get("energy_kwh", 0.0)
            v_fuel += e_metrics.get("fuel_liters", 0.0)

            # Edge-level friction stress
            speed_ratio = (edge.get("length_m", 0.0) / max(edge.get("duration_s", 1.0), 0.1) * 3.6) / max(edge.get("free_flow_speed_kmh", 40.0), 1.0)
            if speed_ratio < _SEVERE_CRAWL_SPEED_RATIO:
                v_stress += _ALPHA_CONGESTION * (edge.get("duration_s", 1.0) / 60.0)
            else:
                v_stress += 0.5 * (edge.get("duration_s", 1.0) / 60.0)

        total_time_s += v_time
        total_dist_m += v_dist
        total_energy_kwh += v_energy
        total_fuel_l += v_fuel
        driver_stress_scores.append(v_stress)

    gini_inequity = compute_gini_coefficient(driver_stress_scores)

    # Baselines for normalization
    norm_time = total_time_s / 3600.0  # hours
    norm_dist = total_dist_m / 1000.0  # km
    norm_energy = total_energy_kwh if total_energy_kwh > 0 else (total_fuel_l * 9.8)
    norm_stress = sum(driver_stress_scores)

    composite_cost = (
        weights.get("time", 0.35) * norm_time +
        weights.get("dist", 0.15) * norm_dist +
        weights.get("energy", 0.25) * norm_energy +
        weights.get("cognitive", 0.25) * norm_stress +
        (15.0 * gini_inequity)  # Hard penalty for fleet work imbalance
    )
    return composite_cost

