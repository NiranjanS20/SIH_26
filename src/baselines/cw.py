"""
src/baselines/cw.py
───────────────────
Clarke-Wright Savings baseline solver for VRP.
"""

from typing import List
from src.optimizer.encoding import VRPProblem
from src.optimizer.fitness import FitnessEvaluator
import math
import numpy as np
import time

class CWSolver:
    def solve(self, problem: VRPProblem, evaluator: FitnessEvaluator):
        t0 = time.perf_counter()
        
        n_stops = len(problem.stops)
        n_vehicles = len(problem.vehicles)
        D = problem.dist_matrix
        
        # Calculate savings
        savings = []
        for i in range(1, n_stops + 1):
            for j in range(i + 1, n_stops + 1):
                s = D[i][0] + D[0][j] - D[i][j]
                savings.append((s, i-1, j-1))
                
        savings.sort(reverse=True, key=lambda x: x[0])
        
        routes = [[i] for i in range(n_stops)]
        route_loads = [problem.stops[i].demand for i in range(n_stops)]
        route_of = {i: i for i in range(n_stops)}
        
        capacity = problem.vehicles[0].capacity if n_vehicles > 0 else 100.0
        
        for s, i, j in savings:
            ri = route_of[i]
            rj = route_of[j]
            
            if ri != rj:
                # Check if i is end of its route and j is start of its route (or vice versa)
                if (routes[ri][-1] == i and routes[rj][0] == j) or (routes[rj][-1] == j and routes[ri][0] == i):
                    if (routes[rj][-1] == j and routes[ri][0] == i):
                        ri, rj = rj, ri
                        
                    # Can we merge?
                    if route_loads[ri] + route_loads[rj] <= capacity:
                        routes[ri].extend(routes[rj])
                        route_loads[ri] += route_loads[rj]
                        
                        for node in routes[rj]:
                            route_of[node] = ri
                        routes[rj] = []
                        
        final_routes = [r for r in routes if len(r) > 0]
        
        # Fit into available vehicles
        if len(final_routes) > n_vehicles:
            final_routes = final_routes[:n_vehicles]
        elif len(final_routes) < n_vehicles:
            final_routes.extend([[] for _ in range(n_vehicles - len(final_routes))])
            
        fitness = evaluator.evaluate(final_routes)
        elapsed = time.perf_counter() - t0
        
        from types import SimpleNamespace
        return SimpleNamespace(
            routes=final_routes,
            fitness=fitness,
            elapsed_s=elapsed,
            iterations_run=1,
            fitness_history=[fitness],
            diversity_history=[0.0],
            algorithm="cw"
        )
