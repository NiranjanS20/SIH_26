"""
src/optimizer/feasibility.py
────────────────────────────
Checks whether a given set of routes satisfies all constraints.
Returns a boolean and a list of violation messages.
"""

from typing import List, Tuple
from src.optimizer.encoding import VRPProblem
from src.optimizer.fitness import route_distance, route_travel_time

def check_feasibility(
    routes: List[List[int]],
    problem: VRPProblem
) -> Tuple[bool, List[str]]:
    """
    Check if routes are strictly feasible.
    """
    is_feasible = True
    violations = []

    # Check all stops are visited exactly once
    visited = set()
    for vi, route in enumerate(routes):
        for s in route:
            if s in visited:
                is_feasible = False
                violations.append(f"Stop {s} visited multiple times.")
            visited.add(s)
            
    if len(visited) != len(problem.stops):
        is_feasible = False
        violations.append(f"Not all stops were visited. Missing {len(problem.stops) - len(visited)} stops.")

    # Check vehicle constraints
    for vi, route in enumerate(routes):
        veh = problem.vehicles[vi]
        
        # Capacity
        total_demand = sum(problem.stops[s].demand for s in route)
        if total_demand > veh.capacity:
            is_feasible = False
            violations.append(f"Vehicle {veh.id} exceeded capacity: {total_demand} > {veh.capacity}")

        # Max distance
        dist_km = route_distance(route, problem) / 1000.0
        if dist_km > veh.max_distance_km:
            is_feasible = False
            violations.append(f"Vehicle {veh.id} exceeded max distance: {dist_km:.1f}km > {veh.max_distance_km}km")

        # Max duration
        duration_min = route_travel_time(route, problem) / 60.0
        if duration_min > veh.max_duration_min:
            is_feasible = False
            violations.append(f"Vehicle {veh.id} exceeded max duration: {duration_min:.1f}min > {veh.max_duration_min}min")

    return is_feasible, violations
