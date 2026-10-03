"""
src/optimizer/turn_analyzer.py
──────────────────────────────
Phase 3 — OSMnx Geometric Turn-Angle Detector

Replaces the Phase 2 empirical 15% right-turn estimate with exact
geometry-based detection derived from the loaded OSM road graph.

Algorithm:
  For each consecutive node-triple (u → v → w) in a route:
    1. Compute bearing of edge u→v  (inbound heading)
    2. Compute bearing of edge v→w  (outbound heading)
    3. Turn angle = (outbound - inbound + 360) mod 360
       • 0°–30° or 330°–360° → straight ahead
       • 31°–150°             → left turn (free slip in India)
       • 151°–209°            → U-turn (high cognitive cost)
       • 210°–329°            → right turn (crosses oncoming traffic in India)

In India (left-hand drive), RIGHT turns cross oncoming multilane
traffic without dedicated signal protection → highest cognitive cost.

Spec: next_feature_quantum.pdf §3.2, T_junction formula:
  T_junction(e) =
    3.5 × (1 + CongestionFactor(e))   if right turn at non-signal
    1.5                                if left turn (free slip / merge)
    0.2                                if straight crossing

Cognitive factor λ_Gini is enforced when G_fleet > 0.15 (§4).

Dependencies: The loaded RoadGraph from src.graph.loader (osmnx MultiDiGraph).
Falls back gracefully if the graph is unavailable.
"""

from __future__ import annotations

import math
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Turn classification thresholds (degrees, clockwise from North)
# ─────────────────────────────────────────────────────────────────────────────

_TURN_STRAIGHT_MAX   = 30.0     # 0–30° and 330–360° = straight
_TURN_LEFT_MAX       = 150.0    # 31–150° = left turn
_TURN_UTURN_MAX      = 209.0    # 151–209° = U-turn
# 210–329° = right turn (crosses oncoming lanes in LHD India)
_TURN_RIGHT_MIN      = 210.0
_TURN_RIGHT_MAX      = 329.0


class TurnType:
    STRAIGHT = "straight"
    LEFT = "left"
    RIGHT = "right"
    UTURN = "uturn"


@dataclass
class TurnEvent:
    """A single turn detected on a route."""
    node_id: int              # The pivot node (v in triple u→v→w)
    turn_type: str            # TurnType constant
    angle_deg: float          # Actual turn angle (0–360°)
    congestion_factor: float  # Congestion ratio on approach segment
    cognitive_cost: float     # Computed T_junction score for this turn
    is_signalized: bool = False


def _bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Compute the initial bearing in degrees [0, 360) from point 1 to point 2.
    Uses the spherical-earth great-circle formula.
    """
    lat1_r = math.radians(lat1)
    lat2_r = math.radians(lat2)
    d_lon  = math.radians(lon2 - lon1)

    x = math.sin(d_lon) * math.cos(lat2_r)
    y = (math.cos(lat1_r) * math.sin(lat2_r)
         - math.sin(lat1_r) * math.cos(lat2_r) * math.cos(d_lon))

    bearing = math.degrees(math.atan2(x, y))
    return (bearing + 360.0) % 360.0


def _classify_turn(turn_angle: float) -> str:
    """Classify a turn angle (relative heading change, 0–360°) into a TurnType."""
    if turn_angle <= _TURN_STRAIGHT_MAX or turn_angle >= (360.0 - _TURN_STRAIGHT_MAX):
        return TurnType.STRAIGHT
    elif turn_angle <= _TURN_LEFT_MAX:
        return TurnType.LEFT
    elif turn_angle <= _TURN_UTURN_MAX:
        return TurnType.UTURN
    else:
        return TurnType.RIGHT


def _junction_cognitive_cost(
    turn_type: str, congestion_factor: float, is_signalized: bool = False
) -> float:
    """
    Spec: next_feature_quantum.pdf §3.2 & MoRTH / SaveLIFE Foundation Safety Model.

    T_junction(e) formula:
      - Unprotected right turn at non-signalized junction (India LHD: crosses oncoming lanes):
        3.5 × (1 + CongestionFactor)
      - Right turn at signalized junction (protected phase):
        1.5
      - Left turn (free slip / merging lane):
        1.5
      - Straight crossing:
        0.2
      - U-turn (high spatial demand and reverse-heading conflict):
        4.5
    """
    if turn_type == TurnType.RIGHT:
        if is_signalized:
            return 1.5
        return 3.5 * (1.0 + congestion_factor)
    elif turn_type == TurnType.LEFT:
        return 1.5
    elif turn_type == TurnType.UTURN:
        return 4.5
    else:  # STRAIGHT
        return 0.2



class TurnAnalyzer:
    """
    Analyzes turn complexity for a route using the loaded OSM road graph.

    Usage:
        analyzer = TurnAnalyzer(road_graph)
        turns = analyzer.analyze_route(node_id_sequence, congestion_ratios)
        total_junction_cost = analyzer.total_junction_cost(turns)
    """

    def __init__(self, road_graph=None):
        """
        Args:
            road_graph: RoadGraph instance from src.graph.loader.
                        If None, turn analysis falls back to estimation.
        """
        self.road_graph = road_graph
        self._coord_cache: Dict[int, Tuple[float, float]] = {}
        if road_graph is not None:
            self._coord_cache = dict(road_graph.node_coords)

    def _get_coords(self, node_id: int) -> Optional[Tuple[float, float]]:
        """Return (lat, lon) for a node, or None if not in graph."""
        return self._coord_cache.get(node_id, None)

    def analyze_route(
        self,
        node_sequence: List[int],
        congestion_ratios: Optional[List[float]] = None,
    ) -> List[TurnEvent]:
        """
        Detect and classify all turns along a node sequence.

        Args:
            node_sequence: Ordered list of OSM node IDs representing the route
                           (including depot at start and end).
            congestion_ratios: Per-edge congestion ratio (v_actual/v_freeflow)
                               for each consecutive pair in node_sequence.
                               Length = len(node_sequence) - 1.
                               If None, defaults to 1.0 (free-flow) for all.

        Returns:
            List of TurnEvent for every detected non-straight maneuver.
        """
        turns: List[TurnEvent] = []
        n = len(node_sequence)
        if n < 3:
            return turns

        if congestion_ratios is None:
            congestion_ratios = [1.0] * (n - 1)

        for i in range(1, n - 1):
            u = node_sequence[i - 1]
            v = node_sequence[i]
            w = node_sequence[i + 1]

            coords_u = self._get_coords(u)
            coords_v = self._get_coords(v)
            coords_w = self._get_coords(w)

            if coords_u is None or coords_v is None or coords_w is None:
                continue  # Skip if graph node not available

            bearing_in  = _bearing_deg(coords_u[0], coords_u[1], coords_v[0], coords_v[1])
            bearing_out = _bearing_deg(coords_v[0], coords_v[1], coords_w[0], coords_w[1])

            # Relative heading change (0–360°)
            turn_angle = (bearing_out - bearing_in + 360.0) % 360.0
            turn_type  = _classify_turn(turn_angle)

            # Congestion factor for the inbound edge (index i-1)
            cong = congestion_ratios[i - 1] if i - 1 < len(congestion_ratios) else 1.0
            # Convert speed ratio → congestion factor: higher crawl = higher factor
            congestion_factor = max(0.0, 1.0 - cong)  # 0 = free-flow, 1 = gridlock

            # Check signalization in road graph node attributes if available
            is_signalized = False
            if self.road_graph is not None and hasattr(self.road_graph, "nx_graph"):
                node_data = self.road_graph.nx_graph.nodes.get(v, {})
                if node_data.get("highway") == "traffic_signals" or node_data.get("signalized", False):
                    is_signalized = True

            cost = _junction_cognitive_cost(turn_type, congestion_factor, is_signalized=is_signalized)

            turns.append(TurnEvent(
                node_id=v,
                turn_type=turn_type,
                angle_deg=round(turn_angle, 1),
                congestion_factor=round(congestion_factor, 3),
                cognitive_cost=round(cost, 3),
                is_signalized=is_signalized,
            ))

        return turns

    def total_junction_cost(self, turns: List[TurnEvent]) -> float:
        """Sum all T_junction cognitive costs for a route."""
        return sum(t.cognitive_cost for t in turns)

    def count_by_type(self, turns: List[TurnEvent]) -> Dict[str, int]:
        """Count turns by type."""
        counts: Dict[str, int] = {
            TurnType.STRAIGHT: 0,
            TurnType.LEFT: 0,
            TurnType.RIGHT: 0,
            TurnType.UTURN: 0,
        }
        for t in turns:
            counts[t.turn_type] = counts.get(t.turn_type, 0) + 1
        return counts

    def right_turn_count(self, turns: List[TurnEvent]) -> int:
        """Count high-risk unprotected right turns."""
        return sum(1 for t in turns if t.turn_type == TurnType.RIGHT)


def estimate_turns_from_stops(stop_count: int) -> Dict[str, float]:
    """
    Fallback turn estimator when full node sequence is not available.
    Uses empirical Mumbai urban delivery route averages:
      - Right turns: ~15% of total turns
      - Total turns: ~2.5 turns per stop (Mumbai dense road network)

    Spec: TRL India 2023 urban delivery study (cited in next_feature_quantum §3.1)
    """
    total_turns_estimate = stop_count * 2.5
    right_turns = total_turns_estimate * 0.15
    left_turns  = total_turns_estimate * 0.55
    straight    = total_turns_estimate * 0.30

    return {
        "total_turns":  total_turns_estimate,
        "right_turns":  right_turns,
        "left_turns":   left_turns,
        "straight":     straight,
        "right_turn_cognitive_cost": right_turns * 3.5,  # avg no congestion
        "total_junction_cost": (right_turns * 3.5 + left_turns * 1.5 + straight * 0.2),
        "method": "empirical_estimate",
    }
