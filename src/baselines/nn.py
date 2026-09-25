"""
src/baselines/nn.py
───────────────────
Nearest Neighbour baseline solver for VRP.
"""

from typing import List
from src.optimizer.encoding import VRPProblem
from src.optimizer.fitness import FitnessEvaluator
import math
import numpy as np
import time

class NNSolver:
    def solve(self, problem: VRPProblem, evaluator: FitnessEvaluator):
        t0 = time.perf_counter()
        
        n_stops = len(problem.stops)
        n_vehicles = len(problem.vehicles)
        D = problem.dist_matrix
        
        visited = [False] * n_stops
        routes = [[] for _ in range(n_vehicles)]
        loads = [0.0] * n_vehicles
        
        current_v = 0
        current_node = 0
        
        for _ in range(n_stops):
            best_dist = math.inf
            best_s = -1
            
            for s in range(n_stops):
                if not visited[s]:
                    node_idx = s + 1
                    if D[current_node][node_idx] < best_dist:
                        demand = problem.stops[s].demand
                        # Check capacity
                        if loads[current_v] + demand <= problem.vehicles[current_v].capacity:
                            best_dist = D[current_node][node_idx]
                            best_s = s
                            
            if best_s == -1:
                # No stop fits, move to next vehicle
                current_v += 1
                if current_v >= n_vehicles:
                    break # Not all stops assigned
                current_node = 0
                
                # Find best stop for new vehicle
                for s in range(n_stops):
                    if not visited[s]:
                        node_idx = s + 1
                        if D[current_node][node_idx] < best_dist:
                            demand = problem.stops[s].demand
                            if loads[current_v] + demand <= problem.vehicles[current_v].capacity:
                                best_dist = D[current_node][node_idx]
                                best_s = s
                                
            if best_s != -1:
                visited[best_s] = True
                routes[current_v].append(best_s)
                loads[current_v] += problem.stops[best_s].demand
                current_node = best_s + 1

        fitness = evaluator.evaluate(routes)
        elapsed = time.perf_counter() - t0
        
        from types import SimpleNamespace
        return SimpleNamespace(
            routes=routes,
            fitness=fitness,
            elapsed_s=elapsed,
            iterations_run=1,
            fitness_history=[fitness],
            diversity_history=[0.0],
            algorithm="nn"
        )
