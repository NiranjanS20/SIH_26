import React, { useState } from 'react';
import QidreBenchmarksMultiSolverAudit from './pages/QidreBenchmarksMultiSolverAudit';
import QidreExperimentalQuantumOptimizationQaoaTier3 from './pages/QidreExperimentalQuantumOptimizationQaoaTier3';
import QidreFleetOptimizerLiveOptimizationPipeline from './pages/QidreFleetOptimizerLiveOptimizationPipeline';
import QidreFleetOptimizerResultsDashboard from './pages/QidreFleetOptimizerResultsDashboard';
import QidreFleetOptimizerSetupWizard4StepFlow from './pages/QidreFleetOptimizerSetupWizard4StepFlow';
import QidreGoogleBenchmarkTier4 from './pages/QidreGoogleBenchmarkTier4';
import QidreHome from './pages/QidreHome';
import QidreResearchDashboardQpsoInternals from './pages/QidreResearchDashboardQpsoInternals';
import QidreRouteComparisonInputState from './pages/QidreRouteComparisonInputState';
import QidreRouteComparisonResultsState from './pages/QidreRouteComparisonResultsState';
import QidreTrafficPredictionTier2 from './pages/QidreTrafficPredictionTier2';
import QidreVehicleDetailDrawerFleetOptimizer from './pages/QidreVehicleDetailDrawerFleetOptimizer';

export default function App() {
  const [currentPath, setCurrentPath] = useState('landing-portal');

  const navigate = (path: string) => {
    console.log('Navigating to:', path);
    setCurrentPath(path);
  };

  const renderPage = () => {
    if (currentPath === 'benchmarks-multi-solver-audit' || currentPath === 'qidre_benchmarks_multi_solver_audit') return <QidreBenchmarksMultiSolverAudit navigate={navigate} />;
    if (currentPath === 'experimental-quantum-optimization-qaoa-tier-3' || currentPath === 'qidre_experimental_quantum_optimization_qaoa_tier_3') return <QidreExperimentalQuantumOptimizationQaoaTier3 navigate={navigate} />;
    if (currentPath === 'fleet-optimizer-live-optimization-pipeline' || currentPath === 'qidre_fleet_optimizer_live_optimization_pipeline') return <QidreFleetOptimizerLiveOptimizationPipeline navigate={navigate} />;
    if (currentPath === 'fleet-optimizer-results-dashboard' || currentPath === 'qidre_fleet_optimizer_results_dashboard') return <QidreFleetOptimizerResultsDashboard navigate={navigate} />;
    if (currentPath === 'fleet-optimizer-setup-wizard-4-step-flow' || currentPath === 'qidre_fleet_optimizer_setup_wizard_4_step_flow') return <QidreFleetOptimizerSetupWizard4StepFlow navigate={navigate} />;
    if (currentPath === 'google-benchmark-tier-4' || currentPath === 'qidre_google_benchmark_tier_4') return <QidreGoogleBenchmarkTier4 navigate={navigate} />;
    if (currentPath === 'landing-portal' || currentPath === 'qidre_home') return <QidreHome navigate={navigate} />;
    if (currentPath === 'research-dashboard-qpso-internals' || currentPath === 'qidre_research_dashboard_qpso_internals') return <QidreResearchDashboardQpsoInternals navigate={navigate} />;
    if (currentPath === 'route-comparison-input-state' || currentPath === 'qidre_route_comparison_input_state') return <QidreRouteComparisonInputState navigate={navigate} />;
    if (currentPath === 'route-comparison-results-state' || currentPath === 'qidre_route_comparison_results_state') return <QidreRouteComparisonResultsState navigate={navigate} />;
    if (currentPath === 'traffic-prediction-tier-2' || currentPath === 'qidre_traffic_prediction_tier_2') return <QidreTrafficPredictionTier2 navigate={navigate} />;
    if (currentPath === 'vehicle-detail-drawer-fleet-optimizer' || currentPath === 'qidre_vehicle_detail_drawer_fleet_optimizer') return <QidreVehicleDetailDrawerFleetOptimizer navigate={navigate} />;
    
    // Fallbacks
    if (currentPath === 'compare-routes') return <QidreRouteComparisonInputState navigate={navigate} />;
    if (currentPath === 'fleet-optimizer') return <QidreFleetOptimizerSetupWizard4StepFlow navigate={navigate} />;
    
    return <QidreHome navigate={navigate} />;
  };

  return (
    <div className="w-full h-full min-h-screen">
      {renderPage()}
    </div>
  );
}
