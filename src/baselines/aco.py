"""
src/baselines/aco.py
────────────────────
Ant Colony Optimization baseline for VRP.

Each ant constructs a valid route sequence by probabilistically choosing
next stops based on pheromone (tau) × heuristic (1/distance) attractiveness.
The result is directly decoded into vehicle routes via capacity-split,
using the same random-key encoding scheme for a fair fitness comparison.
"""

from __future__ import annotations
import time
import numpy as np
from src.optimizer.encoding import VRPProblem, decode_particle
from src.optimizer.fitness import FitnessEvaluator
from src.optimizer.qpso import SolverResult


class ACOSolver:
    """
    Max-Min Ant System (MMAS) for the Capacitated VRP.
    Ants build visit orderings; solutions are decoded via random-key method.
    """

    def __init__(self, n_ants=40, max_iter=200, alpha=1.2, beta=3.0,
                 rho=0.15, tau_min=0.01, tau_max=10.0, seed=42):
        self.n_ants   = n_ants
        self.max_iter = max_iter
        self.alpha    = alpha    # pheromone importance
        self.beta     = beta     # heuristic importance (larger → greedier)
        self.rho      = rho      # evaporation rate
        self.tau_min  = tau_min
        self.tau_max  = tau_max
        self.seed     = seed

    def solve(self, problem: VRPProblem, evaluator: FitnessEvaluator) -> SolverResult:
        rng    = np.random.default_rng(self.seed)
        n      = len(problem.stops)
        t0     = time.perf_counter()

        # Distance heuristic: eta[i][j] = 1 / dist_matrix[i+1][j+1] (stop-to-stop)
        # Use stop sub-matrix (rows/cols 1..n of full matrix)
        D_stop = problem.dist_matrix[1:n+1, 1:n+1]
        eta    = 1.0 / (D_stop + 1e-9)
        np.fill_diagonal(eta, 0.0)

        # Also include depot→stop (row 0 of dist_matrix → cols 1..n)
        eta_depot = 1.0 / (problem.dist_matrix[0, 1:n+1] + 1e-9)

        # Pheromone matrix: n×n (stop-to-stop)
        tau = np.full((n, n), (self.tau_min + self.tau_max) / 2)

        gbest_particle = None
        gbest_fit = float("inf")
        history, div_hist = [], []

        for it in range(self.max_iter):
            ant_particles = []
            ant_fits = []

            for _ in range(self.n_ants):
                # Build a visit order via probabilistic construction
                unvisited = list(range(n))
                order = []
                current = -1   # -1 = depot

                while unvisited:
                    if current == -1:
                        # From depot
                        probs = (eta_depot[unvisited] ** self.beta)
                    else:
                        probs = (
                            (tau[current][unvisited] ** self.alpha) *
                            (eta[current][unvisited] ** self.beta)
                        )
                    prob_sum = probs.sum()
                    if prob_sum == 0 or not np.isfinite(prob_sum):
                        probs = np.ones(len(unvisited))
                        prob_sum = len(unvisited)
                    probs /= prob_sum
                    chosen_idx = rng.choice(len(unvisited), p=probs)
                    chosen     = unvisited.pop(chosen_idx)
                    order.append(chosen)
                    current = chosen

                # Convert order to random-key particle (rank-based)
                particle = np.zeros(n)
                for rank, stop_idx in enumerate(order):
                    particle[stop_idx] = rank / n

                ant_particles.append(particle)
                f = evaluator.evaluate(decode_particle(particle, problem))
                ant_fits.append(f)
                if f < gbest_fit:
                    gbest_fit = f
                    gbest_particle = particle.copy()

            # MMAS pheromone update
            tau *= (1.0 - self.rho)

            # Only best ant deposits
            best_idx = int(np.argmin(ant_fits))
            deposit  = 1.0 / (ant_fits[best_idx] + 1e-9)
            best_order = np.argsort(ant_particles[best_idx])
            for k in range(len(best_order) - 1):
                i, j = best_order[k], best_order[k+1]
                tau[i][j] = min(tau[i][j] + deposit, self.tau_max)

            # MMAS clipping
            tau = np.clip(tau, self.tau_min, self.tau_max)

            history.append(float(gbest_fit))
            div_hist.append(float(np.std(ant_particles)))

        best_routes = (
            decode_particle(gbest_particle, problem)
            if gbest_particle is not None
            else [[] for _ in problem.vehicles]
        )
        return SolverResult(
            routes=best_routes,
            fitness=float(gbest_fit),
            fitness_history=history,
            diversity_history=div_hist,
            iterations_run=self.max_iter,
            elapsed_s=time.perf_counter() - t0,
            algorithm="ACO",
        )
