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
    switch (currentPath) {
      // Home
      case 'landing-portal':
      case 'qidre_home':
        return <QidreHome navigate={navigate} />;
        
      // Benchmarks
      case 'benchmarks':
      case 'benchmarks-research':
      case 'benchmarks-multi-solver-audit':
      case 'qidre_benchmarks_multi_solver_audit':
        return <QidreBenchmarksMultiSolverAudit navigate={navigate} />;
        
      // Google Benchmark
      case 'google-benchmark-tier-4':
      case 'qidre_google_benchmark_tier_4':
        return <QidreGoogleBenchmarkTier4 navigate={navigate} />;

      // Experimental QAOA
      case 'quantum-lab':
      case 'quantum-lab-experimental-qaoa':
      case 'experimental-quantum-optimization-qaoa-tier-3':
      case 'qidre_experimental_quantum_optimization_qaoa_tier_3':
        return <QidreExperimentalQuantumOptimizationQaoaTier3 navigate={navigate} />;

      // Live Pipeline
      case 'fleet-optimizer-live-optimization-pipeline':
      case 'qidre_fleet_optimizer_live_optimization_pipeline':
        return <QidreFleetOptimizerLiveOptimizationPipeline navigate={navigate} />;

      // Results Dashboard
      case 'results':
      case 'fleet-optimizer-optimization-results-dashboard':
      case 'fleet-optimizer-results-dashboard':
      case 'qidre_fleet_optimizer_results_dashboard':
        return <QidreFleetOptimizerResultsDashboard navigate={navigate} />;

      // Wizard Setup
      case 'wizard':
      case 'fleet-optimizer':
      case 'fleet-optimizer-setup-wizard':
      case 'fleet-optimizer-setup-wizard-4-step-flow':
      case 'qidre_fleet_optimizer_setup_wizard_4_step_flow':
        return <QidreFleetOptimizerSetupWizard4StepFlow navigate={navigate} />;

      // QPSO Internals
      case 'research-dashboard-qpso-internals':
      case 'qidre_research_dashboard_qpso_internals':
        return <QidreResearchDashboardQpsoInternals navigate={navigate} />;

      // Route Comparison Input
      case 'comparison':
      case 'compare-routes':
      case 'route-comparison-input-state':
      case 'qidre_route_comparison_input_state':
        return <QidreRouteComparisonInputState navigate={navigate} />;

      // Route Comparison Results
      case 'route-comparison-results-state':
      case 'qidre_route_comparison_results_state':
        return <QidreRouteComparisonResultsState navigate={navigate} />;

      // Traffic Prediction
      case 'traffic-prediction':
      case 'traffic-prediction-tier-2':
      case 'qidre_traffic_prediction_tier_2':
        return <QidreTrafficPredictionTier2 navigate={navigate} />;

      // Vehicle Detail Drawer
      case 'vehicle-detail-drawer-fleet-optimizer':
      case 'qidre_vehicle_detail_drawer_fleet_optimizer':
        return <QidreVehicleDetailDrawerFleetOptimizer navigate={navigate} />;

      default:
        return <QidreHome navigate={navigate} />;
    }
  };

  return (
    <div className="w-full h-full min-h-screen">
      {renderPage()}
    </div>
  );
}
