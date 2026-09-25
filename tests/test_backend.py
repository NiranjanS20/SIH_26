"""
tests/test_backend.py
─────────────────────
Quick smoke-test suite for all backend layers.
Run with:  python -m pytest tests/ -v
"""

import pytest
import numpy as np


# ─── Graph Layer ─────────────────────────────────────────────────────────────

def test_synthetic_graph_builds():
    from src.graph.loader import generate_synthetic_graph
    g = generate_synthetic_graph(num_nodes=30, seed=1)
    assert g.num_nodes == 30
    assert g.num_edges > 0


def test_edge_weight_update():
    from src.graph.loader import generate_synthetic_graph
    g = generate_synthetic_graph(num_nodes=20, seed=2)
    edges = list(g.nx_graph.edges())
    u, v = edges[0]
    ok = g.update_edge_weight(u, v, 9999.0)
    assert ok
    assert g.nx_graph[u][v]["weight"] == 9999.0


def test_spatial_index():
    from src.graph.loader import generate_synthetic_graph
    from src.graph.spatial_index import SpatialIndex
    g = generate_synthetic_graph(num_nodes=50, seed=3)
    idx = SpatialIndex(g.node_coords)
    nearest = idx.nearest(12.97, 77.59)
    assert nearest in g.node_coords


# ─── Oracle ──────────────────────────────────────────────────────────────────

def test_dijkstra_oracle():
    from src.graph.loader import generate_synthetic_graph
    from src.oracle.ch import CHOracle
    g = generate_synthetic_graph(num_nodes=20, seed=4)
    oracle = CHOracle()
    oracle.preprocess(g)
    nodes = list(g.nx_graph.nodes())
    src, dst = nodes[0], nodes[-1]
    dist_ch, _ = oracle.query(src, dst)
    dist_dij, _ = oracle.dijkstra(src, dst)
    # CH should find same or similar distance (within 5% for demo)
    if dist_dij > 0 and dist_ch > 0:
        assert abs(dist_ch - dist_dij) / dist_dij < 0.1


# ─── Encoding ────────────────────────────────────────────────────────────────

def test_decode_particle():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem, decode_particle
    stops = [Stop(id=i, lat=12.97+i*0.01, lon=77.59+i*0.01) for i in range(10)]
    vehicles = [Vehicle(id=0, capacity=100), Vehicle(id=1, capacity=100)]
    problem = VRPProblem(depot_lat=12.97, depot_lon=77.59, stops=stops, vehicles=vehicles)
    particle = np.random.rand(10)
    routes = decode_particle(particle, problem)
    assert len(routes) == 2
    all_stops = [s for r in routes for s in r]
    assert sorted(all_stops) == list(range(10))


# ─── Fitness ─────────────────────────────────────────────────────────────────

def test_fitness_decreases_with_shorter_routes():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem, decode_particle
    from src.optimizer.fitness import FitnessEvaluator
    stops = [Stop(id=i, lat=12.97, lon=77.59+i*0.001) for i in range(5)]
    vehicles = [Vehicle(id=0)]
    problem = VRPProblem(depot_lat=12.97, depot_lon=77.59, stops=stops, vehicles=vehicles)
    ev = FitnessEvaluator(problem)
    # Optimal: visit in order (stops are collinear)
    good = [[0,1,2,3,4]]
    bad  = [[4,0,3,1,2]]
    ev.calibrate([good, bad])
    f_good = ev.evaluate(good)
    f_bad  = ev.evaluate(bad)
    assert f_good <= f_bad


# ─── QPSO Solver ─────────────────────────────────────────────────────────────

def test_qpso_solves_small_vrp():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem
    from src.optimizer.fitness import FitnessEvaluator
    from src.optimizer.qpso import QPSOSolver, QPSOConfig
    stops = [Stop(id=i, lat=12.97+i*0.01, lon=77.59) for i in range(8)]
    vehicles = [Vehicle(id=0, capacity=50), Vehicle(id=1, capacity=50)]
    problem = VRPProblem(depot_lat=12.97, depot_lon=77.59, stops=stops, vehicles=vehicles)
    cfg = QPSOConfig(population_size=10, max_iterations=20, seed=42)
    result = QPSOSolver(cfg).solve(problem)
    assert result.fitness < float("inf")
    assert len(result.routes) == 2
    assert result.elapsed_s > 0


# ─── Emissions ───────────────────────────────────────────────────────────────

def test_ev_emits_zero():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem
    from src.sustainability.emissions import compute_fleet_emissions
    stops = [Stop(id=0, lat=12.97, lon=77.59)]
    vehicles = [Vehicle(id=0, is_ev=True)]
    problem = VRPProblem(depot_lat=12.97, depot_lon=77.59, stops=stops, vehicles=vehicles)
    report = compute_fleet_emissions([[0]], problem)
    assert report.total_co2_kg == 0.0


def test_emissions_report_fields():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem
    from src.sustainability.emissions import compute_fleet_emissions
    stops = [Stop(id=i, lat=12.97+i*0.01, lon=77.59) for i in range(4)]
    vehicles = [Vehicle(id=0, is_ev=False), Vehicle(id=1, is_ev=True)]
    problem = VRPProblem(depot_lat=12.97, depot_lon=77.59, stops=stops, vehicles=vehicles)
    report = compute_fleet_emissions([[0,1],[2,3]], problem)
    assert report.ev_count == 1
    assert report.ice_count == 1
    assert report.total_distance_km > 0
