"""
src/baselines/pso_classic.py
────────────────────────────
Classical (continuous) PSO baseline — for direct comparison with QPSO.
Uses standard velocity-position update instead of quantum tunneling.
"""

from __future__ import annotations
import time
import numpy as np
from src.optimizer.encoding import VRPProblem, decode_particle
from src.optimizer.fitness import FitnessEvaluator
from src.optimizer.qpso import SolverResult


class ClassicPSOSolver:
    def __init__(self, pop_size=50, max_iter=200, w=0.7, c1=1.5, c2=1.5, seed=42):
        self.pop_size = pop_size
        self.max_iter = max_iter
        self.w  = w    # inertia weight
        self.c1 = c1   # cognitive coefficient
        self.c2 = c2   # social coefficient
        self.seed = seed

    def solve(self, problem: VRPProblem, evaluator: FitnessEvaluator) -> SolverResult:
        rng = np.random.default_rng(self.seed)
        n = len(problem.stops)
        t0 = time.perf_counter()

        pos = rng.random((self.pop_size, n))
        vel = rng.uniform(-0.5, 0.5, (self.pop_size, n))
        fit = np.array([evaluator.evaluate(decode_particle(p, problem)) for p in pos])

        pbest, pbest_fit = pos.copy(), fit.copy()
        gi = int(np.argmin(pbest_fit))
        gbest, gbest_fit = pbest[gi].copy(), pbest_fit[gi]
        history, div_hist = [float(gbest_fit)], [float(np.std(pos))]

        for it in range(self.max_iter):
            r1 = rng.random((self.pop_size, n))
            r2 = rng.random((self.pop_size, n))
            vel = (self.w * vel
                   + self.c1 * r1 * (pbest - pos)
                   + self.c2 * r2 * (gbest - pos))
            vel = np.clip(vel, -1.0, 1.0)
            pos = np.clip(pos + vel, 0.0, 1.0)

            fit = np.array([evaluator.evaluate(decode_particle(p, problem)) for p in pos])
            improved = fit < pbest_fit
            pbest[improved] = pos[improved]
            pbest_fit[improved] = fit[improved]

            gi = int(np.argmin(pbest_fit))
            if pbest_fit[gi] < gbest_fit:
                gbest, gbest_fit = pbest[gi].copy(), pbest_fit[gi]

            history.append(float(gbest_fit))
            div_hist.append(float(np.std(pos)))

        return SolverResult(
            routes=decode_particle(gbest, problem),
            fitness=float(gbest_fit),
            fitness_history=history,
            diversity_history=div_hist,
            iterations_run=self.max_iter,
            elapsed_s=time.perf_counter() - t0,
            algorithm="PSO",
        )
