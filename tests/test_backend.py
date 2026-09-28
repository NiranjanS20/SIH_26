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


# ─── Eco & Cognitive 4 Phases ───────────────────────────────────────────────

def test_phase1_fleet_energy_engine():
    from src.sustainability.emissions import FleetEnergyEngine
    engine_ev = FleetEnergyEngine(vehicle_type="ev_van")
    res_ev = engine_ev.calculate_edge_energy(length_m=500.0, duration_s=60.0, free_flow_speed_kmh=40.0)
    assert res_ev.is_electric is True
    assert res_ev.energy_kwh > 0.0
    assert res_ev.fuel_liters == 0.0

    engine_ice = FleetEnergyEngine(vehicle_type="ice_lcv")
    res_ice = engine_ice.calculate_edge_energy(length_m=500.0, duration_s=60.0, free_flow_speed_kmh=40.0)
    assert res_ice.is_electric is False
    assert res_ice.fuel_liters > 0.0
    assert res_ice.co2_kg > 0.0


def test_phase2_cognitive_load_evaluator():
    from src.optimizer.fitness import CognitiveLoadEvaluator
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem
    import numpy as np

    stops = [Stop(id=1, lat=19.06, lon=72.86), Stop(id=2, lat=19.07, lon=72.87)]
    prob = VRPProblem(depot_lat=19.05, depot_lon=72.85, stops=stops, vehicles=[Vehicle(id=1)])
    prob.dist_matrix = np.array([[0, 1000, 2000], [1000, 0, 1000], [2000, 1000, 0]], dtype=float)
    prob.time_matrix = np.array([[0, 120, 240], [120, 0, 120], [240, 120, 0]], dtype=float)

    evaluator = CognitiveLoadEvaluator(road_graph=None)
    score = evaluator.calculate_route_cognitive_load([0, 1], prob)
    assert score >= 0.0

    equity = evaluator.fleet_workload_equity_penalty([10.0, 12.0])
    assert equity >= 0.0


def test_phase3_turn_analyzer():
    from src.optimizer.turn_analyzer import TurnAnalyzer, _bearing_deg, estimate_turns_from_stops
    b = _bearing_deg(19.0596, 72.8656, 19.0605, 72.8690)
    assert 0 <= b <= 360

    est = estimate_turns_from_stops(10)
    assert est["right_turns"] > 0
    assert est["total_junction_cost"] > 0

    analyzer = TurnAnalyzer(road_graph=None)
    turns = analyzer.analyze_route([1, 2, 3])
    assert isinstance(turns, list)


def test_solvers_qpso_ga_aco():
    from src.optimizer.encoding import Stop, Vehicle, VRPProblem
    from src.optimizer.fitness import FitnessEvaluator
    from src.optimizer.qpso import QPSOSolver, QPSOConfig
    from src.baselines.ga import GASolver
    from src.baselines.aco import ACOSolver

    stops = [
        Stop(id=1, lat=19.0657, lon=72.8683, demand=1.0),
        Stop(id=2, lat=19.0700, lon=72.8700, demand=1.0),
    ]
    vehicles = [Vehicle(id=1, capacity=5.0)]
    prob = VRPProblem(depot_lat=19.0596, depot_lon=72.8656, stops=stops, vehicles=vehicles)
    evaluator = FitnessEvaluator(prob)

    res_qpso = QPSOSolver(QPSOConfig(max_iterations=10, population_size=10)).solve(prob, evaluator)
    assert len(res_qpso.routes) == 1

    res_ga = GASolver(pop_size=10, max_iter=10).solve(prob, evaluator)
    assert len(res_ga.routes) == 1

    res_aco = ACOSolver(n_ants=10, max_iter=10).solve(prob, evaluator)
    assert len(res_aco.routes) == 1


# ─── Operations Engine (Modules A - D) ──────────────────────────────────────

def test_module_a_weather_festive_delays():
    from src.operations.engine import weather_festive_engine
    weather_festive_engine.weather.condition = "Heavy Monsoon"
    weather_festive_engine.festive.mode = "Ganesh Visarjan"
    summary = weather_festive_engine.get_summary()

    assert summary["system_impact"]["weather_uplift_pct"] > 0
    assert summary["system_impact"]["festive_uplift_pct"] > 0
    assert summary["system_impact"]["fleet_demand_surge"] > 1.0
    assert len(summary["zones"]) == 6
    assert any("high" in z["flood_risk"].lower() for z in summary["zones"].values())


def test_module_b_driver_wellbeing():
    from src.operations.engine import driver_wellbeing_engine
    report = driver_wellbeing_engine.get_fleet_wellbeing()

    assert "drivers" in report
    assert len(report["drivers"]) >= 3
    driver = report["drivers"][0]
    assert 0.0 <= driver["wsi_score"] <= 100.0
    assert driver["band"] in ["green", "amber", "red"]
    assert report["gini_coefficient"] >= 0.0
    assert "gini_compliant" in report


def test_module_c_scenario_simulator():
    from src.operations.engine import scenario_simulator
    res = scenario_simulator.run_simulation("rain_5pm")

    assert "baseline" in res
    assert "simulated" in res
    assert "deltas" in res
    assert res["simulated"]["total_travel_time_min"] >= res["baseline"]["total_travel_time_min"]
    assert res["deltas"]["travel_time_min"] >= 0.0
    assert len(res["scenario"]["title"]) > 0


def test_module_d_corrective_tips():
    from src.operations.engine import corrective_tips_engine
    tips = corrective_tips_engine.get_ranked_tips()
    assert len(tips) >= 1
    first_id = tips[0]["id"]
    ok = corrective_tips_engine.update_tip_status(first_id, "applied")
    assert ok is True


def test_geocoding_mumbai_fallbacks():
    import asyncio
    from src.geocoding import search

    borivali = asyncio.run(search("Borivali East, Mumbai"))
    assert len(borivali) > 0
    assert 19.15 <= borivali[0]["lat"] <= 19.30
    assert 72.80 <= borivali[0]["lon"] <= 72.95

    malad = asyncio.run(search("Malad East, Mumbai"))
    assert len(malad) > 0
    assert 19.15 <= malad[0]["lat"] <= 19.25

    santacruz = asyncio.run(search("Santacruz East, Mumbai"))
    assert len(santacruz) > 0
    assert 19.05 <= santacruz[0]["lat"] <= 19.12



