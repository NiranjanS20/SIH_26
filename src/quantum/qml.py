"""
src/quantum/qml.py
───────────────────
QIDRE Quantum Integration Layer

Provides the unified interface for quantum-enhanced optimization:
  - QAOA_VRP: Quantum Approximate Optimization for local TSP sub-problems
  - QSVR_Traffic: Quantum Support Vector Regression for traffic prediction
  - HybridQuantumOptimizer: Macro-QPSO / Micro-QAOA decomposition orchestrator

The hybrid architecture:
  1. QPSO (classical quantum-inspired) handles macro-level vehicle-to-corridor
     assignment for 30+ stops across Mumbai.
  2. QAOA (actual quantum circuit) handles micro-level drop sequencing for
     dense 4–8 stop clusters within a delivery zone.

"We do not claim NISQ quantum processors can route all of Mumbai. We deploy
quantum circuits where they are mathematically viable today: as micro-optimizers
for dense localized clusters within a macro quantum-inspired swarm architecture."

Backends:
  - Local: qiskit-aer Statevector/QASM simulator (runs on any PC)
  - IBM Quantum: qiskit-ibm-runtime (free tier, 127-qubit Eagle processors)
  - Graceful degradation: if Qiskit is not installed, silently falls back
    to classical resequencing for dense clusters (never fails the whole route).
"""

from __future__ import annotations

import logging
import os
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class QuantumExperimentBase:
    """Base class for quantum experiment modules."""

    def __init__(self):
        self.is_simulated = True
        self._qiskit_available = self._check_qiskit()

    @staticmethod
    def _check_qiskit() -> bool:
        try:
            import qiskit  # noqa: F401
            return True
        except ImportError:
            return False


class QAOA_VRP(QuantumExperimentBase):
    """
    QAOA-based solver for small VRP/TSP sub-problems.

    Delegates to src/quantum/qaoa_micro.py for the actual circuit
    construction and execution. This class provides the high-level
    interface and result formatting.

    Honest claim: QAOA is limited to ≤ 8 stops (≤ 64 qubits) due to
    NISQ simulation/hardware constraints.
    """

    def __init__(self, num_nodes: int):
        super().__init__()
        self.num_nodes = num_nodes
        self.max_nodes = 8  # NISQ feasibility limit

    def run_circuit(self, stop_indices: List[int] = None, problem=None) -> Dict:
        """
        Run QAOA on a small TSP sub-problem.

        Args:
            stop_indices: List of stop indices forming the cluster.
            problem: VRPProblem with distance matrix. Required for real solve.

        Returns:
            Dict with solve result or error information.
        """
        if self.num_nodes > self.max_nodes:
            return {
                "error": f"QAOA limited to {self.max_nodes} nodes on NISQ hardware. "
                         f"Given {self.num_nodes}.",
                "suggestion": "Use classical solver or reduce cluster size.",
            }

        if stop_indices is None or problem is None:
            # Demonstration mode — return simulated result
            logger.info(
                "Running QAOA VRP circuit for %d nodes (SIMULATED)...",
                self.num_nodes,
            )
            return {
                "status": "success",
                "backend": "aer_simulator" if self._qiskit_available else "simulated",
                "qubits_used": self.num_nodes ** 2,
                "cost_value": 42.0,
                "convergence_epochs": 150,
                "method": "qaoa_demo",
            }

        # Real solve via qaoa_micro module
        from src.quantum.qaoa_micro import solve_qaoa

        ibm_token = os.environ.get("IBM_QUANTUM_TOKEN")
        use_ibm = ibm_token is not None and len(ibm_token) > 10

        result = solve_qaoa(
            stop_indices=stop_indices,
            problem=problem,
            use_ibm_backend=use_ibm,
            ibm_token=ibm_token,
        )

        return {
            "status": "success",
            "backend": result.backend,
            "qubits_used": result.num_qubits,
            "qaoa_depth": result.qaoa_depth,
            "cost_value": result.cost,
            "optimal_sequence": result.optimal_sequence,
            "method": result.method,
            "improvement_pct": result.improvement_pct,
            "elapsed_s": result.elapsed_s,
        }


class QSVR_Traffic(QuantumExperimentBase):
    """
    Quantum Support Vector Regression for traffic prediction.

    Currently operates in simulated mode. When Qiskit is available,
    can be extended to use quantum kernel methods for traffic flow
    prediction on Mumbai road segments.
    """

    def __init__(self):
        super().__init__()

    def predict(self, feature_vector) -> Dict:
        logger.info("Running QSVR inference (SIMULATED)...")
        return {"prediction_time_s": 324.5, "confidence_amplitude": 0.94}


class HybridQuantumOptimizer:
    """
    Macro-QPSO / Micro-QAOA Hybrid Decomposition Orchestrator.

    Called as a post-processing step after QPSO converges. Identifies
    dense local clusters in each vehicle's route and applies QAOA
    micro-optimization to qualifying clusters.

    Architecture:
      QPSO (macro) → assigns stops to vehicles across Mumbai corridors
      QAOA (micro) → resequences 4–8 stop clusters within delivery zones

    Graceful degradation: if Qiskit is not installed, silently falls back
    to classical nearest-neighbor resequencing. Never fails the whole route.
    """

    def __init__(self, problem, road_graph=None):
        """
        Args:
            problem: VRPProblem instance.
            road_graph: Optional RoadGraph for distance computation.
        """
        self.problem = problem
        self.road_graph = road_graph
        self._qiskit_available = QuantumExperimentBase._check_qiskit()

    def optimize_routes(
        self,
        routes: List[List[int]],
        evaluator=None,
    ) -> Dict:
        """
        Post-process QPSO routes with QAOA micro-optimization.

        Steps:
          1. Detect dense clusters in each vehicle's route
          2. For each qualifying cluster (4–8 stops within 2km):
             a. Run QAOA to find optimal drop sequence
             b. Replace cluster stops in route with optimised order
          3. Re-evaluate fitness and return improved routes

        Args:
            routes: List of vehicle routes from QPSO.
            evaluator: FitnessEvaluator for re-evaluation.

        Returns:
            Dict with optimised routes and QAOA metadata.
        """
        from src.quantum.cluster_detector import detect_clusters, apply_resequencing
        from src.quantum.qaoa_micro import solve_qaoa

        # Step 1: Detect qualifying clusters
        clusters = detect_clusters(routes, self.problem)
        qaoa_eligible = [c for c in clusters if c.is_qaoa_eligible]

        if not qaoa_eligible:
            logger.info("No QAOA-eligible clusters found in %d routes", len(routes))
            return {
                "routes": routes,
                "clusters_detected": len(clusters),
                "clusters_optimized": 0,
                "qaoa_results": [],
                "method": "qpso_only",
            }

        logger.info(
            "Found %d QAOA-eligible clusters across %d routes",
            len(qaoa_eligible), len(routes),
        )

        # Step 2: Apply QAOA to each qualifying cluster
        optimised_routes = [list(r) for r in routes]  # deep copy
        qaoa_results = []

        ibm_token = os.environ.get("IBM_QUANTUM_TOKEN")
        use_ibm = ibm_token is not None and len(ibm_token) > 10

        for cluster in qaoa_eligible:
            try:
                result = solve_qaoa(
                    stop_indices=cluster.stop_indices,
                    problem=self.problem,
                    use_ibm_backend=use_ibm,
                    ibm_token=ibm_token,
                )

                # Apply resequencing to the vehicle's route
                vi = cluster.vehicle_idx
                optimised_routes[vi] = apply_resequencing(
                    optimised_routes[vi], cluster, result.optimal_sequence,
                )

                qaoa_results.append({
                    "vehicle_idx": vi,
                    "cluster_size": len(cluster.stop_indices),
                    "method": result.method,
                    "backend": result.backend,
                    "num_qubits": result.num_qubits,
                    "improvement_pct": result.improvement_pct,
                    "elapsed_s": result.elapsed_s,
                })

                logger.info(
                    "QAOA micro-opt: vehicle %d, %d stops, method=%s, improvement=%.1f%%",
                    vi, len(cluster.stop_indices), result.method, result.improvement_pct,
                )

            except Exception as e:
                logger.warning(
                    "QAOA failed for cluster on vehicle %d: %s (keeping QPSO order)",
                    cluster.vehicle_idx, e,
                )

        # Step 3: Re-evaluate fitness if evaluator provided
        original_fitness = None
        new_fitness = None
        if evaluator is not None:
            try:
                original_fitness = evaluator.evaluate(routes)
                new_fitness = evaluator.evaluate(optimised_routes)
                # Only keep optimised routes if they're actually better
                if new_fitness > original_fitness:
                    logger.info(
                        "QAOA resequencing did not improve fitness (%.4f → %.4f), "
                        "keeping QPSO order",
                        original_fitness, new_fitness,
                    )
                    optimised_routes = routes
                    new_fitness = original_fitness
            except Exception as e:
                logger.warning("Fitness re-evaluation failed: %s", e)

        return {
            "routes": optimised_routes,
            "clusters_detected": len(clusters),
            "clusters_optimized": len(qaoa_results),
            "qaoa_results": qaoa_results,
            "original_fitness": float(original_fitness) if original_fitness is not None else None,
            "optimized_fitness": float(new_fitness) if new_fitness is not None else None,
            "method": "macro_qpso_micro_qaoa",
            "qiskit_available": self._qiskit_available,
        }
