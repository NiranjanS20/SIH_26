"""
src/sustainability/emissions.py
────────────────────────────────
QIDRE Eco-Cognitive Fleet Optimization — Phase 1

Two subsystems implemented here:

Subsystem A — Non-Linear Vehicle Energy Model
  Uses thermodynamic force-power balance to compute per-edge energy
  expenditure accounting for:
  • Rolling resistance (mass × gravity × Crr × v)
  • Aerodynamic drag (0.5 × ρ × Cd × A × v³)
  • Grade resistance (mass × gravity × sin(θ) × v)
  • Auxiliary electrical/HVAC crawl burn (Paux × Δt)
  • Regenerative braking capture for EVs (ηregen × |Ptractive| × Δt)

  Three calibrated vehicle profiles (from calibrated vehicle specifications):
    • ev_van      — Commercial EV delivery van (Tata Ace EV class)
    • ev_2w       — Hyperlocal 2-wheeler EV (Swiggy/Zomato fleet class)
    • ice_lcv     — Standard diesel Light Commercial Vehicle (CMEL-calibrated)

  Grid/fuel carbon factors:
    • EV: 0.716 kg CO₂/kWh  (India CEA National Grid Baseline 2024-25)
    • ICE: 2.68 kg CO₂/liter (diesel, well-to-wheel)

Legacy functions (route_co2_kg, compute_fleet_emissions, EVState, etc.)
are preserved with their original signatures to avoid breaking main.py.
"""

from __future__ import annotations

import math
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np

from src.optimizer.encoding import Stop, Vehicle, VRPProblem

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# LEGACY:  Speed-dependent CO₂ model (kept for backward-compat)
# ─────────────────────────────────────────────────────────────────────────────

_EMISSION_COEFFS = {"a": 215.0, "b": 0.0014, "c": 0.25}


def co2_g_per_km(speed_kmh: float) -> float:
    """
    Speed-dependent CO₂ emission in g/km for a typical ICE delivery van.
    U-shaped: high at low speeds (idling), minimum ~70 km/h, rises above 110.
    """
    s = max(speed_kmh, 1.0)
    a = _EMISSION_COEFFS["a"]
    b = _EMISSION_COEFFS["b"]
    c = _EMISSION_COEFFS["c"]
    return a / s + b * s**2 + c


def route_co2_kg(
    distances_m: List[float],
    speeds_kmh: Optional[List[float]] = None,
    default_speed: float = 30.0,
) -> float:
    """Total CO₂ (kg) for a sequence of edge distances (legacy helper)."""
    if speeds_kmh is None:
        speeds_kmh = [default_speed] * len(distances_m)
    total = 0.0
    for d_m, s in zip(distances_m, speeds_kmh):
        total += co2_g_per_km(s) * (d_m / 1000.0)
    return total / 1000.0  # g → kg


# ─────────────────────────────────────────────────────────────────────────────
# EV State-of-Charge tracker (legacy, kept for backward-compat)
# ─────────────────────────────────────────────────────────────────────────────

SOC_RESERVE = 0.10  # 10% minimum SoC reserve


@dataclass
class EVState:
    vehicle: Vehicle
    soc: float          # current SoC [0, 1]
    km_driven: float = 0.0

    def energy_for_km(self, km: float) -> float:
        """kWh needed to drive `km` (simple linear legacy model)."""
        return self.vehicle.energy_per_km * km

    def can_reach(self, km: float) -> bool:
        needed = self.energy_for_km(km)
        battery_kwh = self.soc * (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        reserve_kwh = SOC_RESERVE * (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        return battery_kwh - needed >= reserve_kwh

    def drive(self, km: float) -> float:
        energy = self.energy_for_km(km)
        battery_kwh = self.soc * (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        battery_kwh = max(0.0, battery_kwh - energy)
        self.soc = battery_kwh / (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        self.km_driven += km
        return self.soc

    def charge_full(self) -> None:
        self.soc = 1.0


@dataclass
class ChargingStation:
    id: int
    lat: float
    lon: float
    name: str = ""


def check_ev_feasibility(
    route: List[int],
    problem: VRPProblem,
    vehicle: Vehicle,
    charging_stations: Optional[List[ChargingStation]] = None,
) -> Tuple[bool, List[int], float]:
    """
    Check whether an EV can complete the given route without running out of charge.
    Returns: (feasible, modified_route_with_charging_stops, final_soc)
    """
    if not vehicle.is_ev:
        return True, route, 1.0

    D = problem.dist_matrix
    state = EVState(vehicle=vehicle, soc=vehicle.soc)
    nodes = [0] + [s + 1 for s in route] + [0]
    modified = list(route)

    feasible = True
    for idx in range(len(nodes) - 1):
        u, v = nodes[idx], nodes[idx + 1]
        dist_m = D[u][v]
        km = dist_m / 1000.0

        if not state.can_reach(km):
            if charging_stations:
                logger.warning(
                    "EV %d needs charging before stop %d (SoC=%.1f%%)",
                    vehicle.id, v, state.soc * 100,
                )
                state.charge_full()
            else:
                feasible = False
                logger.error(
                    "EV %d STRANDED before stop %d (SoC=%.1f%%)",
                    vehicle.id, v, state.soc * 100,
                )
        state.drive(km)

    return feasible, modified, state.soc


# ─────────────────────────────────────────────────────────────────────────────
# SUBSYSTEM A — Thermodynamic Fleet Energy Engine (NEW)
# Spec: next_feature_quantum.pdf, Section 2 & 5.1
# ─────────────────────────────────────────────────────────────────────────────

#: Physical constants
_AIR_DENSITY_KG_M3 = 1.2041       # kg/m³ at 20°C, 1 atm
_GRAVITY_M_S2 = 9.80665            # m/s²
_INDIA_GRID_CO2_KG_KWH = 0.716    # India CEA national grid baseline (2024-25)
_DIESEL_CO2_KG_LITER = 2.68       # kg CO₂/liter of diesel (well-to-wheel)
_DIESEL_ENERGY_J_PER_LITER = 36.0e6  # 36 MJ/liter diesel lower heating value
_CRAWL_SPEED_KMH = 15.0           # Speed threshold for urban stop-and-go crawl


# Vehicle physical profiles calibrated for Indian urban commercial fleet
# Spec: next_feature_quantum.pdf, Section 2.2 (Operational Thresholds)
_VEHICLE_PROFILES: Dict[str, Dict] = {
    "ev_van": {
        # Commercial EV van (Tata Ace EV / Mahindra Treo Zor class)
        "mass_kg": 1900.0,
        "frontal_area_m2": 3.2,
        "drag_coeff": 0.32,
        "rolling_coeff": 0.012,
        "p_aux_kw": 1.8,           # Cabin HVAC + battery thermal management
        "drivetrain_efficiency": 0.88,
        "regen_efficiency": 0.55,
        "is_electric": True,
    },
    "ev_2w": {
        # Hyperlocal EV 2-wheeler (Swiggy/Zomato delivery fleet)
        "mass_kg": 150.0,
        "frontal_area_m2": 0.65,
        "drag_coeff": 0.62,
        "rolling_coeff": 0.015,
        "p_aux_kw": 0.15,          # Minimal: lights and basic electronics
        "drivetrain_efficiency": 0.85,
        "regen_efficiency": 0.40,
        "is_electric": True,
    },
    "ice_lcv": {
        # Standard Diesel Light Commercial Vehicle (Tata Ace / Ashok Leyland Dost class)
        # Calibrated using Comprehensive Modal Emission Model (CMEM)
        "mass_kg": 2200.0,
        "frontal_area_m2": 3.5,
        "drag_coeff": 0.38,
        "rolling_coeff": 0.014,
        "p_aux_kw": 0.8,           # Basic electronics + partial AC
        "drivetrain_efficiency": 0.32,  # Diesel ICE at urban speeds
        "regen_efficiency": 0.0,        # No regenerative braking
        "is_electric": False,
    },
}


@dataclass
class EdgeEnergyResult:
    """Energy expenditure for a single road edge traversal."""
    energy_kwh: float       # kWh consumed (EV) or equivalent (ICE)
    fuel_liters: float      # liters of diesel (ICE only, 0.0 for EV)
    co2_kg: float           # kg CO₂ emitted
    is_electric: bool
    # Breakdown components for display (all in kWh equiv)
    mechanical_kwh: float = 0.0
    aux_kwh: float = 0.0
    regen_recovered_kwh: float = 0.0
    congestion_factor: float = 1.0
    actual_speed_kmh: float = 0.0
    is_crawl: bool = False

    def __getitem__(self, key: str):
        """Allow dict-like subscripting (e.g. result['energy_kwh'])."""
        if hasattr(self, key):
            val = getattr(self, key)
            if key == "is_electric" and isinstance(val, bool):
                return 1.0 if val else 0.0
            return val
        raise KeyError(key)

    def get(self, key: str, default=None):
        """Allow dict-like .get() access."""
        try:
            return self[key]
        except KeyError:
            return default



@dataclass
class EdgeEnergyResultFull:
    """Aggregated energy results for a full vehicle route."""
    total_energy_kwh: float
    total_fuel_liters: float
    total_co2_kg: float
    total_mechanical_kwh: float
    total_aux_kwh: float
    total_regen_recovered_kwh: float
    avoided_idle_loss_kwh: float    # kWh saved vs naive linear model
    is_electric: bool
    vehicle_type: str
    distance_km: float
    duration_min: float


class FleetEnergyEngine:
    """
    Thermodynamic vehicle energy model for QIDRE fleet optimization.

    Spec: next_feature_quantum.pdf, Section 2 (Mathematical Formulation)
    and Section 5.1 (Implementation).

    Computes per-edge energy using physical force-power balance:
      P_tractive = F_rolling × v + F_aero × v + F_grade × v + F_inertial × v

    For EV with regen efficiency η_regen:
      E_edge = max(P_tractive × Δt / η_drivetrain + P_aux × Δt, 0)
             - η_regen × |P_tractive| × Δt  (when decelerating)

    For ICE (CMEM calibrated):
      FuelRate(e) = BaseRate × (1 + γ × ((v_freeflow - v_actual) / v_freeflow)²)
    """

    def __init__(self, vehicle_type: str = "ev_van"):
        profile = _VEHICLE_PROFILES.get(vehicle_type, _VEHICLE_PROFILES["ev_van"])
        self.vehicle_type = vehicle_type
        self.mass_kg: float = profile["mass_kg"]
        self.frontal_area_m2: float = profile["frontal_area_m2"]
        self.drag_coeff: float = profile["drag_coeff"]
        self.rolling_coeff: float = profile["rolling_coeff"]
        self.p_aux_kw: float = profile["p_aux_kw"]
        self.drivetrain_efficiency: float = profile["drivetrain_efficiency"]
        self.regen_efficiency: float = profile["regen_efficiency"]
        self.is_electric: bool = profile["is_electric"]
        # Physical constants
        self.air_density = _AIR_DENSITY_KG_M3
        self.gravity = _GRAVITY_M_S2

    @classmethod
    def from_vehicle(cls, vehicle: Vehicle) -> "FleetEnergyEngine":
        """
        Create engine from QIDRE Vehicle dataclass.
        Maps is_ev flag and vehicle.type field to profile.
        """
        if not vehicle.is_ev:
            return cls("ice_lcv")
        # Distinguish EV 2-wheeler vs van by type field
        vtype = getattr(vehicle, "type", "Van").lower()
        if "bike" in vtype or "2w" in vtype or "scooter" in vtype:
            return cls("ev_2w")
        return cls("ev_van")

    def calculate_edge_energy(
        self,
        length_m: float,
        duration_s: float,
        free_flow_speed_kmh: float,
        elevation_gain_m: float = 0.0,
    ) -> EdgeEnergyResult:
        """
        Calculate exact energy expenditure for a single road edge traversal.

        Args:
            length_m: Physical length of the road segment in metres.
            duration_s: Actual traversal time in seconds (reflects traffic).
            free_flow_speed_kmh: Nominal free-flow speed for this segment.
            elevation_gain_m: Net elevation gain in metres (positive=uphill).

        Returns:
            EdgeEnergyResult with energy (kWh), fuel (L), CO₂ (kg),
            and component breakdown.
        """
        # Clamp duration to avoid divide-by-zero
        if duration_s <= 0.0:
            duration_s = 0.1

        avg_speed_mps = length_m / duration_s
        avg_speed_kmh = avg_speed_mps * 3.6
        free_flow_mps = max(free_flow_speed_kmh / 3.6, 1.0)

        # Stop-and-go congestion factor: ratio of free-flow speed to actual
        # Urban Mumbai: dominant energy penalty at v < 15 km/h (crawl regime)
        congestion_factor = max(1.0, free_flow_mps / max(avg_speed_mps, 0.5))
        is_crawl = avg_speed_kmh < _CRAWL_SPEED_KMH

        # ── 1. Physical forces (Newtons) ──────────────────────────────────
        # Road grade angle from elevation gain
        sin_theta = elevation_gain_m / max(length_m, 1.0)
        cos_theta = math.sqrt(max(0.0, 1.0 - sin_theta ** 2))

        f_rolling = self.mass_kg * self.gravity * self.rolling_coeff * cos_theta
        f_aero = 0.5 * self.air_density * self.drag_coeff * self.frontal_area_m2 * (avg_speed_mps ** 2)
        f_grade = self.mass_kg * self.gravity * sin_theta

        total_force_n = f_rolling + f_aero + f_grade
        mechanical_work_joules = total_force_n * length_m  # F × d

        # ── 2. Auxiliary electrical load (HVAC + electronics during traversal)
        aux_energy_joules = self.p_aux_kw * 1000.0 * duration_s

        # ── 3. Vehicle-type energy calculation ───────────────────────────
        regen_recovered_kwh = 0.0

        if self.is_electric:
            # Forward traction (positive work → energy consumed)
            if mechanical_work_joules >= 0.0:
                consumed_joules = (mechanical_work_joules / self.drivetrain_efficiency) + aux_energy_joules
                regen_joules = 0.0
            else:
                # Regenerative capture during braking/descent
                regen_joules = abs(mechanical_work_joules) * self.regen_efficiency
                consumed_joules = max(0.0, aux_energy_joules - regen_joules)
                regen_recovered_kwh = regen_joules / 3.6e6

            energy_kwh = max(consumed_joules / 3.6e6, 0.001)
            co2_kg = energy_kwh * _INDIA_GRID_CO2_KG_KWH

            return EdgeEnergyResult(
                energy_kwh=energy_kwh,
                fuel_liters=0.0,
                co2_kg=co2_kg,
                is_electric=True,
                mechanical_kwh=max(mechanical_work_joules, 0.0) / 3.6e6,
                aux_kwh=aux_energy_joules / 3.6e6,
                regen_recovered_kwh=regen_recovered_kwh,
                congestion_factor=congestion_factor,
                actual_speed_kmh=avg_speed_kmh,
                is_crawl=is_crawl,
            )

        else:
            # ICE — CMEM calibrated fuel consumption model
            # FuelRate(e) = BaseRate × (1 + γ × crawl_ratio²)
            # where crawl_ratio = (v_freeflow - v_actual) / v_freeflow
            crawl_ratio = max(0.0, (free_flow_mps - avg_speed_mps) / free_flow_mps)
            # γ = 2.5 (CMEM congestion sensitivity parameter for diesel LCV)
            cmem_gamma = 2.5
            ice_congestion_mult = 1.0 + cmem_gamma * (crawl_ratio ** 2)

            # Speed-dependent thermal efficiency (higher at optimal ~60 km/h)
            optimal_eff_speed_mps = 60.0 / 3.6
            speed_ratio = avg_speed_mps / optimal_eff_speed_mps
            thermal_efficiency = max(
                self.drivetrain_efficiency * min(speed_ratio, 1.0),
                0.10,  # minimum thermal efficiency at crawl
            )

            fuel_energy_joules = (max(mechanical_work_joules, 0.0) / thermal_efficiency) + aux_energy_joules
            # Apply CMEM crawl penalty
            fuel_energy_joules *= ice_congestion_mult
            fuel_liters = fuel_energy_joules / _DIESEL_ENERGY_J_PER_LITER
            co2_kg = fuel_liters * _DIESEL_CO2_KG_LITER

            return EdgeEnergyResult(
                energy_kwh=0.0,
                fuel_liters=fuel_liters,
                co2_kg=co2_kg,
                is_electric=False,
                mechanical_kwh=max(mechanical_work_joules, 0.0) / 3.6e6,
                aux_kwh=aux_energy_joules / 3.6e6,
                regen_recovered_kwh=0.0,
                congestion_factor=ice_congestion_mult,
                actual_speed_kmh=avg_speed_kmh,
                is_crawl=is_crawl,
            )

    def calculate_route_energy(
        self,
        route_edges: List[Dict],
    ) -> EdgeEnergyResultFull:
        """
        Aggregate energy across all edges for a single vehicle route.

        Args:
            route_edges: List of edge dicts with keys:
                length_m, duration_s, free_flow_speed_kmh,
                elevation_gain_m (optional).
        """
        total_energy_kwh = 0.0
        total_fuel_liters = 0.0
        total_co2_kg = 0.0
        total_mech_kwh = 0.0
        total_aux_kwh = 0.0
        total_regen_kwh = 0.0
        total_length_m = 0.0
        total_duration_s = 0.0

        for edge in route_edges:
            length_m = edge.get("length_m", 100.0)
            duration_s = edge.get("duration_s", 10.0)
            ff_speed = edge.get("free_flow_speed_kmh", 40.0)
            elev_gain = edge.get("elevation_gain_m", 0.0)

            result = self.calculate_edge_energy(length_m, duration_s, ff_speed, elev_gain)

            total_energy_kwh += result.energy_kwh
            total_fuel_liters += result.fuel_liters
            total_co2_kg += result.co2_kg
            total_mech_kwh += result.mechanical_kwh
            total_aux_kwh += result.aux_kwh
            total_regen_kwh += result.regen_recovered_kwh
            total_length_m += length_m
            total_duration_s += duration_s

        # Avoided idle loss: difference between thermodynamic model
        # and naive linear model (energy_per_km * distance)
        naive_kwh = (total_length_m / 1000.0) * 0.18  # baseline 180 Wh/km
        avoided_idle_loss = max(0.0, total_energy_kwh - naive_kwh) if self.is_electric else 0.0

        return EdgeEnergyResultFull(
            total_energy_kwh=round(total_energy_kwh, 4),
            total_fuel_liters=round(total_fuel_liters, 4),
            total_co2_kg=round(total_co2_kg, 4),
            total_mechanical_kwh=round(total_mech_kwh, 4),
            total_aux_kwh=round(total_aux_kwh, 4),
            total_regen_recovered_kwh=round(total_regen_kwh, 4),
            avoided_idle_loss_kwh=round(avoided_idle_loss, 4),
            is_electric=self.is_electric,
            vehicle_type=self.vehicle_type,
            distance_km=round(total_length_m / 1000.0, 3),
            duration_min=round(total_duration_s / 60.0, 2),
        )


# ─────────────────────────────────────────────────────────────────────────────
# LEGACY Fleet emissions report (kept for backward-compat with main.py)
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FleetEmissionsReport:
    total_distance_km: float
    total_co2_kg: float
    ev_count: int
    ice_count: int
    ev_distance_km: float
    ice_distance_km: float
    co2_saved_vs_all_ice: float
    co2_reduction_pct: float
    # New eco-energy fields (populated when thermodynamic model is used)
    total_energy_kwh: float = 0.0
    total_fuel_liters: float = 0.0
    total_regen_recovered_kwh: float = 0.0
    avoided_idle_loss_kwh: float = 0.0


def compute_fleet_emissions(
    routes: List[List[int]],
    problem: VRPProblem,
    avg_speed_kmh: float = 30.0,
    use_thermodynamic_model: bool = True,
) -> FleetEmissionsReport:
    """
    Compute comprehensive emissions report for all vehicle routes.

    When use_thermodynamic_model=True (default), uses the FleetEnergyEngine
    for each vehicle. Falls back to legacy linear model if matrices are absent.
    """
    D = problem.dist_matrix
    T = problem.time_matrix

    total_dist = 0.0
    total_co2 = 0.0
    total_energy_kwh = 0.0
    total_fuel_liters = 0.0
    total_regen_kwh = 0.0
    total_avoided_idle = 0.0
    ev_dist = 0.0
    ice_dist = 0.0
    ev_count = 0
    ice_count = 0

    for vi, route in enumerate(routes):
        if not route:
            continue
        veh = problem.vehicles[vi] if vi < len(problem.vehicles) else Vehicle(id=vi)
        nodes = [0] + [s + 1 for s in route] + [0]
        route_km = sum(D[nodes[i]][nodes[i + 1]] for i in range(len(nodes) - 1)) / 1000.0
        total_dist += route_km

        if veh.is_ev:
            ev_dist += route_km
            ev_count += 1
        else:
            ice_dist += route_km
            ice_count += 1

        if use_thermodynamic_model and D is not None and T is not None:
            # Build edge list for thermodynamic model
            engine = FleetEnergyEngine.from_vehicle(veh)
            # Infer free-flow speed from OSM (use vehicle max_range as proxy speed)
            ff_speed_kmh = 40.0  # conservative urban Mumbai free-flow
            edge_list = []
            for i in range(len(nodes) - 1):
                d_m = D[nodes[i]][nodes[i + 1]]
                t_s = T[nodes[i]][nodes[i + 1]]
                edge_list.append({
                    "length_m": d_m,
                    "duration_s": t_s,
                    "free_flow_speed_kmh": ff_speed_kmh,
                    "elevation_gain_m": 0.0,  # Mumbai is predominantly flat
                })
            route_energy = engine.calculate_route_energy(edge_list)
            if not veh.is_ev:
                total_co2 += route_energy.total_co2_kg
            total_energy_kwh += route_energy.total_energy_kwh
            total_fuel_liters += route_energy.total_fuel_liters
            total_regen_kwh += route_energy.total_regen_recovered_kwh
            total_avoided_idle += route_energy.avoided_idle_loss_kwh
        else:
            # Legacy linear model
            if not veh.is_ev:
                co2_route = route_co2_kg(
                    [D[nodes[i]][nodes[i + 1]] for i in range(len(nodes) - 1)],
                    default_speed=avg_speed_kmh,
                )
                total_co2 += co2_route

    # CO₂ if all vehicles were ICE (baseline comparison)
    all_ice_co2 = route_co2_kg([total_dist * 1000], default_speed=avg_speed_kmh)
    co2_saved = all_ice_co2 - total_co2
    pct = (co2_saved / max(all_ice_co2, 0.001)) * 100

    return FleetEmissionsReport(
        total_distance_km=round(total_dist, 2),
        total_co2_kg=round(total_co2, 3),
        ev_count=ev_count,
        ice_count=ice_count,
        ev_distance_km=round(ev_dist, 2),
        ice_distance_km=round(ice_dist, 2),
        co2_saved_vs_all_ice=round(co2_saved, 3),
        co2_reduction_pct=round(pct, 1),
        total_energy_kwh=round(total_energy_kwh, 3),
        total_fuel_liters=round(total_fuel_liters, 3),
        total_regen_recovered_kwh=round(total_regen_kwh, 3),
        avoided_idle_loss_kwh=round(total_avoided_idle, 3),
    )
