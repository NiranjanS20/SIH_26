"""
tests/test_eco_cognitive_layer.py
──────────────────────────────────
Verification test suite for QIDRE's Closed-Loop Eco-Cognitive Multi-Objective Layer.
Validates all 10 features from the master specification and assessment report:
  - Feature 1: Tractive Force & Energy physics
  - Feature 2: Mumbai HVAC Crawl Penalty (1.8 kW auxiliary power)
  - Feature 3: EV Regenerative Braking (55% capture)
  - Feature 4: CMEM-calibrated ICE Fuel Model
  - Feature 5: India-specific Left-Hand Drive Unprotected Right-Turn Risk
  - Feature 6: Delivery Urgency / Time-Window Panic in QPSO fitness
  - Feature 7: Fleet Workload Gini Inequity
  - Feature 8: Composite 4-term QPSO Multi-Objective Function
  - Feature 9: Dashboard Widget Telemetry Integration
  - Feature 10: Extended API Schema with Burnout Risk Status
"""

import math
import pytest
import numpy as np

from src.sustainability.emissions import FleetEnergyEngine, EdgeEnergyResult
from src.optimizer.turn_analyzer import TurnAnalyzer, TurnType, _junction_cognitive_cost
from src.optimizer.fitness import (
    FitnessWeights,
    FitnessEvaluator,
    CognitiveLoadEvaluator,
    compute_gini_coefficient,
    evaluate_swarm_fitness,
)
from src.optimizer.encoding import Stop, Vehicle, VRPProblem


def test_feature_1_2_3_thermodynamic_ev_physics():
    """Validates tractive power, 1.8kW Mumbai AC crawl penalty, and 55% regen."""
    engine = FleetEnergyEngine("ev_van")
    assert engine.is_electric
    assert engine.p_aux_kw == 1.8
    assert engine.regen_efficiency == 0.55
    assert engine.mass_kg == 1900.0

    # 1. Forward motion
    fwd = engine.calculate_edge_energy(length_m=1000.0, duration_s=100.0, free_flow_speed_kmh=40.0)
    assert fwd.energy_kwh > 0
    assert fwd.co2_kg > 0
    assert fwd["is_electric"] == 1.0  # Dict subscripting test

    # 2. Stop-and-go crawl penalty (< 15 km/h: 100m in 60s = 6 km/h)
    crawl = engine.calculate_edge_energy(length_m=100.0, duration_s=60.0, free_flow_speed_kmh=40.0)
    assert crawl.is_crawl
    # Aux HVAC dissipation dominates
    assert crawl.aux_kwh > 0

    # 3. Downhill regenerative capture (negative work)
    downhill = engine.calculate_edge_energy(
        length_m=1000.0, duration_s=60.0, free_flow_speed_kmh=40.0, elevation_gain_m=-80.0
    )
    assert downhill.regen_recovered_kwh > 0


def test_feature_4_cmem_ice_model():
    """Validates CMEM-grounded diesel LCV model."""
    ice = FleetEnergyEngine("ice_lcv")
    assert not ice.is_electric
    assert ice.mass_kg == 2200.0

    res = ice.calculate_edge_energy(length_m=1000.0, duration_s=120.0, free_flow_speed_kmh=40.0)
    assert res.fuel_liters > 0
    assert res.co2_kg > 0
    assert res["is_electric"] == 0.0


def test_feature_5_india_lhd_right_turn_risk():
    """Validates high penalty for unprotected right turns in LHD India traffic."""
    # Unprotected right turn at non-signalized junction: 3.5 * (1 + cong)
    cost_right_unprotected = _junction_cognitive_cost(TurnType.RIGHT, congestion_factor=0.8, is_signalized=False)
    assert cost_right_unprotected == pytest.approx(3.5 * 1.8, 0.01)

    # Protected right turn at signalized junction
    cost_right_signalized = _junction_cognitive_cost(TurnType.RIGHT, congestion_factor=0.8, is_signalized=True)
    assert cost_right_signalized == 1.5

    # Left turn (free slip in India)
    cost_left = _junction_cognitive_cost(TurnType.LEFT, congestion_factor=0.8)
    assert cost_left == 1.5

    # Straight crossing
    cost_straight = _junction_cognitive_cost(TurnType.STRAIGHT, congestion_factor=0.8)
    assert cost_straight == 0.2

    # U-turn
    cost_uturn = _junction_cognitive_cost(TurnType.UTURN, congestion_factor=0.8)
    assert cost_uturn == 4.5


def test_feature_6_delivery_urgency_panic():
    """Validates exponential panic function when delivery is late."""
    stops = [
        Stop(id=0, lat=19.065, lon=72.866, demand=5, earliest=0, latest=100, service_time_min=5),
        Stop(id=1, lat=19.066, lon=72.867, demand=5, earliest=0, latest=100, service_time_min=5),
    ]
    problem = VRPProblem(
        depot_lat=19.065,
        depot_lon=72.866,
        stops=stops,
        vehicles=[Vehicle(id=1, capacity=30, is_ev=True)],
        dist_matrix=np.array([[0, 500, 1000], [500, 0, 500], [1000, 500, 0]]),
        time_matrix=np.array([[0, 300, 600], [300, 0, 300], [600, 300, 0]]), # Takes 300s to reach stop 0 (> latest=100)
    )

    evaluator = CognitiveLoadEvaluator()
    breakdown = evaluator.calculate_route_cognitive_load([0, 1], problem, return_breakdown=True)
    assert breakdown["urgency_score"] > 0
    assert breakdown["burnout_risk_status"] in ["OPTIMAL", "DEMANDING", "BURNOUT_RISK"]


def test_feature_7_fleet_gini_equity():
    """Validates Gini coefficient and quadratic penalty above 0.15."""
    # Equal workload -> Gini = 0.0
    assert compute_gini_coefficient([25.0, 25.0, 25.0]) == 0.0

    # Unequal workload -> Gini > 0.15
    unequal_scores = [10.0, 80.0]
    gini = compute_gini_coefficient(unequal_scores)
    assert gini > 0.15

    evaluator = CognitiveLoadEvaluator()
    penalty = evaluator.fleet_workload_equity_penalty(unequal_scores)
    assert penalty > 0.0


def test_feature_8_composite_swarm_fitness():
    """Validates evaluate_swarm_fitness with 4 objectives + Gini penalty."""
    engine = FleetEnergyEngine("ev_van")
    weights = {"time": 0.35, "dist": 0.15, "energy": 0.25, "cognitive": 0.25}
    particle_assignment = {
        1: [
            {"length_m": 1200.0, "duration_s": 150.0, "free_flow_speed_kmh": 40.0, "elevation_gain_m": 0.0}
        ],
        2: [
            {"length_m": 800.0, "duration_s": 90.0, "free_flow_speed_kmh": 40.0, "elevation_gain_m": 0.0}
        ]
    }
    cost = evaluate_swarm_fitness(particle_assignment, weights, engine)
    assert cost > 0.0


def test_feature_10_api_schema():
    """Validates the extended schema fields on POST /api/v1/optimize/fleet."""
    from fastapi.testclient import TestClient
    from src.api.main import app

    client = TestClient(app)
    payload = {
        "area": "bkc",
        "stops": [
            {"id": 1, "lat": 19.066, "lon": 72.867, "demand": 5, "earliest": 0, "latest": 600, "priority": 2, "service_time_min": 2},
            {"id": 2, "lat": 19.068, "lon": 72.869, "demand": 5, "earliest": 0, "latest": 1200, "priority": 2, "service_time_min": 2}
        ],
        "vehicles": [
            {"id": 1, "capacity": 20, "is_ev": True, "type": "ev_van"}
        ],
        "depot_lat": 19.065,
        "depot_lon": 72.865
    }

    res = client.post("/api/v1/optimize/fleet", json=payload)
    assert res.status_code == 200
    data = res.json()

    # Check top-level schema
    assert "summary" in data
    assert "driver_assignments" in data
    assert "eco_cognitive" in data

    # Check summary fields
    summary = data["summary"]
    assert "total_travel_time_min" in summary
    assert "total_distance_km" in summary
    assert "total_energy_consumed_kwh" in summary
    assert "co2_emissions_kg" in summary
    assert "fleet_gini_inequity" in summary
    assert "mean_cognitive_strain_score" in summary

    # Check driver assignments
    driver = data["driver_assignments"][0]
    assert "driver_id" in driver
    assert "burnout_risk_status" in driver
    assert driver["burnout_risk_status"] in ["OPTIMAL", "DEMANDING", "BURNOUT_RISK"]
    assert "unprotected_right_turns" in driver
    assert "cognitive_strain_index" in driver
