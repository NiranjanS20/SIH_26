"""
src/baselines/ilp.py
────────────────────
Exact ILP solver for VRP using the Miller-Tucker-Zemlin (MTZ) subtour
elimination formulation, solved via PuLP (CBC backend).

Capped at 25 stops for tractability — used as ground-truth optimal
to measure the "optimality gap" of metaheuristic approaches.
"""

from __future__ import annotations

import logging
import math
import time
from typing import List, Optional

import numpy as np

from src.optimizer.encoding import VRPProblem, Stop, Vehicle
from src.optimizer.fitness import FitnessEvaluator
from src.optimizer.qpso import SolverResult

logger = logging.getLogger(__name__)

MAX_STOPS_ILP = 25   # hard cap — ILP is NP-hard beyond this


def _route_distance_from_x(x_vals, n, D):
    """Reconstruct route distance from ILP x variable values."""
    total = 0.0
    for i in range(n + 1):
        for j in range(n + 1):
            if i != j and x_vals.get((i, j), 0) > 0.5:
                total += D[i][j]
    return total


class ILPSolver:
    """
    MTZ-formulation capacitated VRP solved exactly with PuLP/CBC.
    Only practical for ≤ 25 stops; raises ValueError otherwise.
    """

    def __init__(self, time_limit_s: int = 120):
        self.time_limit_s = time_limit_s

    def solve(self, problem: VRPProblem, evaluator: Optional[FitnessEvaluator] = None) -> SolverResult:
        n = len(problem.stops)
        if n > MAX_STOPS_ILP:
            raise ValueError(
                f"ILP capped at {MAX_STOPS_ILP} stops (got {n}). "
                "Use QPSO/GA/ACO for larger instances."
            )

        try:
            import pulp
        except ImportError:
            raise ImportError("PuLP required: pip install pulp")

        t0 = time.perf_counter()
        K  = len(problem.vehicles)   # number of vehicles
        D  = problem.dist_matrix     # (n+1) × (n+1), index 0 = depot
        Q  = [v.capacity for v in problem.vehicles]
        q  = [s.demand for s in problem.stops]

        # Node indices: 0 = depot, 1..n = stops
        nodes = list(range(n + 1))
        stops = list(range(1, n + 1))

        # ── Decision variables ────────────────────────────────────────
        prob = pulp.LpProblem("CVRP_MTZ", pulp.LpMinimize)

        # x[i][j][k] = 1 if vehicle k travels edge i→j
        x = {
            (i, j, k): pulp.LpVariable(f"x_{i}_{j}_{k}", cat="Binary")
            for i in nodes for j in nodes for k in range(K)
            if i != j
        }

        # u[i][k] = MTZ position variable (subtour elimination)
        u = {
            (i, k): pulp.LpVariable(f"u_{i}_{k}", lowBound=0, upBound=n)
            for i in stops for k in range(K)
        }

        # ── Objective: minimise total travel distance ─────────────────
        prob += pulp.lpSum(
            D[i][j] * x[(i, j, k)]
            for i in nodes for j in nodes for k in range(K) if i != j
        )

        # ── Constraints ───────────────────────────────────────────────

        # Each stop visited exactly once across all vehicles
        for j in stops:
            prob += (
                pulp.lpSum(x[(i, j, k)] for i in nodes for k in range(K) if i != j) == 1,
                f"visit_{j}"
            )

        # Flow conservation: each vehicle leaves every stop it enters
        for k in range(K):
            for h in stops:
                prob += (
                    pulp.lpSum(x[(i, h, k)] for i in nodes if i != h) ==
                    pulp.lpSum(x[(h, j, k)] for j in nodes if j != h),
                    f"flow_{h}_{k}"
                )

        # Each vehicle departs depot at most once
        for k in range(K):
            prob += (
                pulp.lpSum(x[(0, j, k)] for j in stops) <= 1,
                f"depart_{k}"
            )

        # Capacity: total demand per vehicle ≤ capacity
        for k in range(K):
            prob += (
                pulp.lpSum(q[j - 1] * x[(i, j, k)] for i in nodes for j in stops if i != j) <= Q[k],
                f"cap_{k}"
            )

        # MTZ subtour elimination
        for k in range(K):
            for i in stops:
                for j in stops:
                    if i != j:
                        prob += (
                            u[(i, k)] - u[(j, k)] + n * x[(i, j, k)] <= n - 1,
                            f"mtz_{i}_{j}_{k}"
                        )

        # ── Solve ─────────────────────────────────────────────────────
        solver = pulp.PULP_CBC_CMD(
            msg=0,
            timeLimit=self.time_limit_s,
            gapRel=0.01,   # accept 1% optimality gap
        )
        prob.solve(solver)
        elapsed = time.perf_counter() - t0

        status = pulp.LpStatus[prob.status]
        logger.info("ILP status: %s | %.3fs", status, elapsed)

        if prob.status not in (1, -2):   # 1=Optimal, -2=TimeLimitFeasible
            logger.warning("ILP did not find feasible solution (status=%s)", status)
            return SolverResult(
                routes=[[] for _ in range(K)],
                fitness=float("inf"),
                fitness_history=[float("inf")],
                diversity_history=[0.0],
                iterations_run=0,
                elapsed_s=elapsed,
                algorithm="ILP",
            )

        # ── Extract routes ────────────────────────────────────────────
        routes: List[List[int]] = [[] for _ in range(K)]
        for k in range(K):
            # Follow the chain from depot
            current = 0
            visited = set()
            for _ in range(n):
                nxt = None
                for j in nodes:
                    if j != current and (current, j, k) in x:
                        if pulp.value(x[(current, j, k)]) and pulp.value(x[(current, j, k)]) > 0.5:
                            nxt = j
                            break
                if nxt is None or nxt == 0 or nxt in visited:
                    break
                routes[k].append(nxt - 1)   # convert to 0-based stop idx
                visited.add(nxt)
                current = nxt

        best_dist = pulp.value(prob.objective) or float("inf")

        # Fitness via evaluator for comparable numbers
        fitness = evaluator.evaluate(routes) if evaluator else best_dist / 1e6

        return SolverResult(
            routes=routes,
            fitness=fitness,
            fitness_history=[fitness],
            diversity_history=[0.0],
            iterations_run=1,
            elapsed_s=elapsed,
            algorithm="ILP",
        )
