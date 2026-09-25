"""
src/baselines/ga.py — Genetic Algorithm baseline
src/baselines/aco.py — Ant Colony Optimization baseline
src/baselines/pso_classic.py — Classical Discrete PSO baseline

All implement the same interface as QPSOSolver:
    solver.solve(problem, evaluator) → SolverResult
"""

# ── Genetic Algorithm ────────────────────────────────────────────────────────

from __future__ import annotations
import time
import numpy as np
from src.optimizer.encoding import VRPProblem, decode_particle
from src.optimizer.fitness import FitnessEvaluator
from src.optimizer.qpso import SolverResult


class GASolver:
    """
    Standard Genetic Algorithm with tournament selection,
    single-point crossover on continuous encoding, and Gaussian mutation.
    Uses the same random-key encoding as QPSO for fair comparison.
    """

    def __init__(self, pop_size=50, max_iter=200, mutation_rate=0.1, seed=42):
        self.pop_size = pop_size
        self.max_iter = max_iter
        self.mutation_rate = mutation_rate
        self.seed = seed

    def solve(self, problem: VRPProblem, evaluator: FitnessEvaluator) -> SolverResult:
        rng = np.random.default_rng(self.seed)
        n = len(problem.stops)
        t0 = time.perf_counter()

        pop = rng.random((self.pop_size, n))
        fit = np.array([evaluator.evaluate(decode_particle(p, problem)) for p in pop])
        best_idx = int(np.argmin(fit))
        gbest, gbest_fit = pop[best_idx].copy(), fit[best_idx]
        history, div_hist = [float(gbest_fit)], [float(np.std(pop))]

        for it in range(self.max_iter):
            new_pop = []
            for _ in range(self.pop_size // 2):
                # Tournament selection (k=3)
                def tournament():
                    idxs = rng.integers(0, self.pop_size, size=3)
                    return pop[idxs[int(np.argmin(fit[idxs]))]]

                p1, p2 = tournament(), tournament()
                cut = rng.integers(1, n)
                c1 = np.concatenate([p1[:cut], p2[cut:]])
                c2 = np.concatenate([p2[:cut], p1[cut:]])
                # Mutation
                for child in (c1, c2):
                    if rng.random() < self.mutation_rate:
                        idx = rng.integers(0, n)
                        child[idx] = rng.random()
                    new_pop.append(child)

            pop = np.array(new_pop[:self.pop_size])
            fit = np.array([evaluator.evaluate(decode_particle(p, problem)) for p in pop])
            bi = int(np.argmin(fit))
            if fit[bi] < gbest_fit:
                gbest, gbest_fit = pop[bi].copy(), fit[bi]
            history.append(float(gbest_fit))
            div_hist.append(float(np.std(pop)))

        return SolverResult(
            routes=decode_particle(gbest, problem),
            fitness=float(gbest_fit),
            fitness_history=history,
            diversity_history=div_hist,
            iterations_run=self.max_iter,
            elapsed_s=time.perf_counter() - t0,
            algorithm="GA",
        )
