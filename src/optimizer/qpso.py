"""
src/optimizer/qpso.py
─────────────────────
Quantum-Behaved Particle Swarm Optimization (QPSO) — Phase 3

Implements the QPSO algorithm by Sun et al. (2004):
  Each particle position is governed by a quantum delta-potential well,
  enabling global exploration without velocity tuning.

Update rule:
  mbest  = (1/M) Σ pbest_i            (mean of all personal bests)
  phi    = U(0, 1)
  p_i    = phi * pbest_i + (1-phi) * gbest    (local attractor)
  u      = U(0, 1)
  L      = beta * |x_i - p_i|         (characteristic length of well)
  x_i    = p_i ± L * ln(1/u)          (quantum position update)

The ± sign is chosen randomly. beta (contraction-expansion coefficient)
controls convergence speed: beta < 1 → convergent, beta > 1 → divergent.
"""

from __future__ import annotations

import logging
import math
import time
from dataclasses import dataclass, field
from typing import Callable, List, Optional, Tuple

import numpy as np

from src.optimizer.encoding import VRPProblem, decode_particle, encode_greedy
from src.optimizer.fitness import FitnessEvaluator, FitnessWeights

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class QPSOConfig:
    population_size: int  = 60    # larger swarm = better diversity
    max_iterations:  int  = 200
    beta_start:      float = 1.0   # contraction-expansion: start (annealed down)
    beta_end:        float = 0.4   # end (more convergent)
    greedy_fraction: float = 0.5   # 50% seeded greedy
    seed:            int   = 42
    early_stop_tol:  float = 1e-7  # tighter tolerance
    patience:        int   = 50    # wait longer before stopping


# ─────────────────────────────────────────────────────────────────────────────
# Solver result
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class SolverResult:
    routes:              List[List[int]]         # best routes
    fitness:             float                   # best fitness value
    fitness_history:     List[float]             # gbest per iteration
    diversity_history:   List[float]             # population spread per iter
    iterations_run:      int
    elapsed_s:           float
    algorithm:           str = "QPSO"


# ─────────────────────────────────────────────────────────────────────────────
# QPSO Solver
# ─────────────────────────────────────────────────────────────────────────────

class QPSOSolver:
    """
    Quantum-Inspired Particle Swarm Optimiser for the Capacitated VRP.

    Usage:
        solver = QPSOSolver(config)
        result = solver.solve(problem, evaluator)
    """

    def __init__(self, config: Optional[QPSOConfig] = None):
        self.config = config or QPSOConfig()

    def solve(
        self,
        problem: VRPProblem,
        evaluator: Optional[FitnessEvaluator] = None,
        weights: Optional[FitnessWeights] = None,
        progress_cb: Optional[Callable[[int, float, float], None]] = None,
    ) -> SolverResult:
        """
        Run QPSO to minimise the VRP fitness function.

        Args:
            problem:     VRP problem instance
            evaluator:   pre-built FitnessEvaluator (or one is created)
            weights:     FitnessWeights override
            progress_cb: callback(iteration, gbest_fitness, diversity)

        Returns:
            SolverResult with best routes and convergence history
        """
        cfg = self.config
        rng = np.random.default_rng(cfg.seed)
        t0  = time.perf_counter()

        n_stops = len(problem.stops)
        n_pop   = cfg.population_size

        if evaluator is None:
            evaluator = FitnessEvaluator(problem, weights)

        # ── Initialise population ──────────────────────────────────────
        pop = rng.random((n_pop, n_stops)).astype(np.float64)

        # Seed greedy fraction
        n_greedy = max(1, int(n_pop * cfg.greedy_fraction))
        greedy_particle = encode_greedy(problem)
        for i in range(n_greedy):
            # Add small noise to greedy seed for diversity
            pop[i] = greedy_particle + rng.normal(0, 0.05, n_stops)
            pop[i] = np.clip(pop[i], 0, 1)

        # ── Evaluate initial population ────────────────────────────────
        fitness = np.array([
            evaluator.evaluate(decode_particle(pop[i], problem))
            for i in range(n_pop)
        ])

        # Calibrate evaluator normalisation constants
        sample = [decode_particle(pop[i], problem) for i in range(min(10, n_pop))]
        evaluator.calibrate(sample)

        # Re-evaluate after calibration
        fitness = np.array([
            evaluator.evaluate(decode_particle(pop[i], problem))
            for i in range(n_pop)
        ])

        pbest       = pop.copy()
        pbest_fit   = fitness.copy()
        gbest_idx   = int(np.argmin(pbest_fit))
        gbest       = pbest[gbest_idx].copy()
        gbest_fit   = pbest_fit[gbest_idx]

        fitness_history   = [float(gbest_fit)]
        diversity_history = [float(np.std(pop))]

        no_improve = 0
        best_ever_fit = gbest_fit

        # ── Main QPSO loop ─────────────────────────────────────────────
        for it in range(1, cfg.max_iterations + 1):

            # Anneal beta: linearly from beta_start → beta_end
            beta = cfg.beta_start - (cfg.beta_start - cfg.beta_end) * (it / cfg.max_iterations)

            # Mean best position (mbest)
            mbest = np.mean(pbest, axis=0)

            for i in range(n_pop):
                phi = rng.random(n_stops)
                # Local attractor
                p_i = phi * pbest[i] + (1 - phi) * gbest
                # Quantum delta-potential well update
                u = rng.random(n_stops)
                u = np.clip(u, 1e-10, 1.0)   # avoid log(0)
                sign = rng.choice([-1, 1], size=n_stops)
                # Correct QPSO characteristic length uses mbest
                L = beta * np.abs(mbest - pop[i])
                pop[i] = p_i + sign * L * np.log(1.0 / u)

            # Diversity-preserving mutation
            diversity = float(np.mean(np.std(pop, axis=0)))
            if diversity < 0.05:
                # Mutate worst 10% of population
                worst_indices = np.argsort(pbest_fit)[-int(n_pop*0.1):]
                for idx in worst_indices:
                    pop[idx] += rng.normal(0, 0.2, n_stops)
                    pop[idx] = np.clip(pop[idx], 0, 1)

            # Evaluate new positions
            for i in range(n_pop):
                routes_i = decode_particle(pop[i], problem)
                f_i = evaluator.evaluate(routes_i)
                if f_i < pbest_fit[i]:
                    pbest[i] = pop[i].copy()
                    pbest_fit[i] = f_i
                    if f_i < gbest_fit:
                        gbest = pop[i].copy()
                        gbest_fit = f_i

            # Track convergence
            fitness_history.append(float(gbest_fit))
            diversity = float(np.mean(np.std(pop, axis=0)))
            diversity_history.append(diversity)

            # Progress callback
            if progress_cb:
                progress_cb(it, gbest_fit, diversity)

            # Early stopping
            if gbest_fit < best_ever_fit - cfg.early_stop_tol:
                best_ever_fit = gbest_fit
                no_improve = 0
            else:
                no_improve += 1
                if no_improve >= cfg.patience:
                    logger.info("QPSO early stop at iteration %d (patience=%d)", it, cfg.patience)
                    break

            if it % 20 == 0:
                logger.debug(
                    "QPSO iter %3d/%d | gbest=%.4f | beta=%.3f | div=%.4f",
                    it, cfg.max_iterations, gbest_fit, beta, diversity,
                )

        elapsed = time.perf_counter() - t0
        best_routes = decode_particle(gbest, problem)

        logger.info(
            "QPSO done: %.3fs | %d iters | gbest=%.4f | routes=%d",
            elapsed, len(fitness_history) - 1, gbest_fit, len(best_routes),
        )

        return SolverResult(
            routes=best_routes,
            fitness=float(gbest_fit),
            fitness_history=fitness_history,
            diversity_history=diversity_history,
            iterations_run=len(fitness_history) - 1,
            elapsed_s=elapsed,
            algorithm="QPSO",
        )
