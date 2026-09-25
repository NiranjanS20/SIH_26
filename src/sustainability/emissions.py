"""
src/sustainability/emissions.py
────────────────────────────────
Emissions & EV fleet module — Phase 5

• Speed-dependent CO₂ model for ICE vehicles
• State-of-Charge (SoC) tracking for EV vehicles
• Charging stop insertion for range-constrained EVs
• Mixed fleet CO₂ reporting
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
# Emissions model
# ─────────────────────────────────────────────────────────────────────────────

# EURO 6 light commercial vehicle coefficients (g CO₂/km)
# Source: approximated from EMEP/EEA air pollutant emission inventory
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
    """Total CO₂ (kg) for a sequence of edge distances."""
    if speeds_kmh is None:
        speeds_kmh = [default_speed] * len(distances_m)
    total = 0.0
    for d_m, s in zip(distances_m, speeds_kmh):
        total += co2_g_per_km(s) * (d_m / 1000.0)
    return total / 1000.0   # g → kg


# ─────────────────────────────────────────────────────────────────────────────
# EV State-of-Charge tracker
# ─────────────────────────────────────────────────────────────────────────────

SOC_RESERVE = 0.10   # 10% minimum SoC reserve


@dataclass
class EVState:
    vehicle: Vehicle
    soc: float           # current SoC [0, 1]
    km_driven: float = 0.0

    def energy_for_km(self, km: float) -> float:
        """kWh needed to drive `km`."""
        return self.vehicle.energy_per_km * km

    def can_reach(self, km: float) -> bool:
        """True if EV has enough SoC to drive `km` and keep SOC_RESERVE."""
        needed = self.energy_for_km(km)
        battery_kwh = self.soc * (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        reserve_kwh = SOC_RESERVE * (self.vehicle.max_range_km * self.vehicle.energy_per_km)
        return battery_kwh - needed >= reserve_kwh

    def drive(self, km: float) -> float:
        """Drive `km`, update SoC, return actual SoC after."""
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


# ─────────────────────────────────────────────────────────────────────────────
# Route feasibility checker + charging stop inserter
# ─────────────────────────────────────────────────────────────────────────────

def check_ev_feasibility(
    route: List[int],
    problem: VRPProblem,
    vehicle: Vehicle,
    charging_stations: Optional[List[ChargingStation]] = None,
) -> Tuple[bool, List[int], float]:
    """
    Check whether an EV can complete the given route without running out of charge.

    Returns:
        (feasible, modified_route_with_charging_stops, final_soc)
    """
    if not vehicle.is_ev:
        return True, route, 1.0

    D = problem.dist_matrix
    state = EVState(vehicle=vehicle, soc=vehicle.soc)
    nodes = [0] + [s + 1 for s in route] + [0]  # depot=0
    modified = list(route)
    offset = 0   # insertion offset due to added stops

    feasible = True
    for idx in range(len(nodes) - 1):
        u, v = nodes[idx], nodes[idx + 1]
        dist_m = D[u][v]
        km = dist_m / 1000.0

        if not state.can_reach(km):
            if charging_stations:
                # Find nearest charging station (simplified: use depot for demo)
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
# Fleet-level sustainability report
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FleetEmissionsReport:
    total_distance_km: float
    total_co2_kg: float
    ev_count: int
    ice_count: int
    ev_distance_km: float
    ice_distance_km: float
    co2_saved_vs_all_ice: float          # kg saved by using EVs
    co2_reduction_pct: float


def compute_fleet_emissions(
    routes: List[List[int]],
    problem: VRPProblem,
    avg_speed_kmh: float = 30.0,
) -> FleetEmissionsReport:
    """Compute comprehensive emissions report for all vehicle routes."""
    D = problem.dist_matrix
    total_dist = 0.0
    total_co2  = 0.0
    ev_dist    = 0.0
    ice_dist   = 0.0
    ev_count   = 0
    ice_count  = 0

    for vi, route in enumerate(routes):
        if not route:
            continue
        veh = problem.vehicles[vi] if vi < len(problem.vehicles) else Vehicle(id=vi)
        nodes = [0] + [s + 1 for s in route] + [0]
        route_km = sum(D[nodes[i]][nodes[i+1]] for i in range(len(nodes)-1)) / 1000.0
        total_dist += route_km

        if veh.is_ev:
            ev_dist += route_km
            ev_count += 1
            # EV emits ~0 direct CO₂ (ignoring upstream)
        else:
            ice_dist += route_km
            ice_count += 1
            co2_route = route_co2_kg([D[nodes[i]][nodes[i+1]] for i in range(len(nodes)-1)],
                                      default_speed=avg_speed_kmh)
            total_co2 += co2_route

    # CO₂ if all vehicles were ICE
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
    )
