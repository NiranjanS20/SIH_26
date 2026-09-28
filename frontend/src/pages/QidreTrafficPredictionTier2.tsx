import React, { useEffect, useRef } from 'react';

export default function QidreTrafficPredictionTier2({ navigate }: { navigate: (path: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const links = containerRef.current.querySelectorAll('[data-path]');
    
    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const path = target.getAttribute('data-path');
      if (path) navigate(path);
    };
    
    links.forEach(link => link.addEventListener('click', handleClick));
    return () => links.forEach(link => link.removeEventListener('click', handleClick));
  }, [navigate]);

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center gap-space-lg"><a class="group flex items-center gap-space-xs transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><span class="font-['Orbitron'] text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="text-outline">/</span><a class="hover:text-on-surface transition-colors" data-path="fleet-optimizer-setup-wizard" href="#">Fleet Optimizer</a><span class="text-outline">/</span><span class="text-primary-container font-medium">Quantum Telemetry Engine</span></div></div><div class="flex items-center gap-space-md md:gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-sm md:gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-setup-wizard" href="#">Wizard</a><a aria-current="page" class="transition-colors flex items-center text-primary-container font-semibold" data-path="traffic-prediction" href="#">Traffic Prediction</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-optimization-results-dashboard" href="#">Results</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="route-comparison-results-state" href="#">Comparison</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks-research" href="#">Benchmarks / Research</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full px-gutter md:px-margin max-w-7xl mx-auto py-space-md space-y-space-md">
<!-- TOP BREADCRUMB & UTILITY TELEMETRY BAR -->
<section class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-sm bg-surface-container-lowest p-space-sm md:px-space-md rounded-xl shadow-sm">
<div class="flex flex-wrap items-center gap-x-space-sm gap-y-1">
<div class="flex items-center gap-1.5 font-label-sm text-label-sm text-outline tracking-wider">
<span class="hover:text-on-surface transition-colors cursor-pointer">WORKSPACE</span>
<span class="text-outline-variant">/</span>
<span class="hover:text-on-surface transition-colors cursor-pointer">TRAFFIC TELEMETRY</span>
<span class="text-outline-variant">/</span>
<span class="text-primary-container font-semibold">PREDICTIVE HORIZON (TIER 2)</span>
</div>
<span class="hidden md:inline text-outline-variant">·</span>
<span class="font-telemetry-data text-telemetry-data text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded">BATCH #PRD-8821</span>
<!-- Live Serving Chip -->
<div class="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-0.5 rounded-full text-secondary">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="font-label-sm text-label-sm font-semibold tracking-tight text-on-secondary-fixed-variant">
          MODEL SERVING · LATENCY: <span class="font-telemetry-data text-secondary">3.8ms</span> · CACHE HIT <span class="font-telemetry-data text-secondary">99.4%</span>
</span>
</div>
</div>
<!-- Actions & Selectors -->
<div class="flex items-center flex-wrap gap-2">
<!-- Corridor Switcher -->
<div class="relative inline-flex items-center">
<span class="material-symbols-outlined absolute left-2.5 text-outline text-[18px] pointer-events-none">route</span>
<select class="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm pl-8 pr-8 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer transition-colors">
<option selected="">Bandra-Kurla Complex MMR (Corridor A4)</option>
<option>Western Express Highway (Andheri-Bandra)</option>
<option>Eastern Freeway · Chembur Connector</option>
<option>Ghatkopar-Mankhurd Link Express</option>
</select>
<span class="material-symbols-outlined absolute right-2 text-outline text-[16px] pointer-events-none">expand_more</span>
</div>
<!-- Sweep Button -->
<button class="inline-flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95">
<span class="material-symbols-outlined text-[17px]">sync_saved_locally</span>
<span>Run Inference Sweep</span>
</button>
<!-- CSV Export -->
<button class="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md px-3 py-1.5 rounded-lg transition-colors" title="Export Raw Telemetry Logs">
<span class="material-symbols-outlined text-outline text-[18px]">download</span>
<span class="hidden sm:inline">Export .CSV</span>
</button>
</div>
</section>
<!-- SPLIT STAT CARD: CURRENT VS PREDICTED ETA -->
<section class="relative bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
<div class="grid grid-cols-1 lg:grid-cols-12 relative">
<!-- Left Half: Current ETA (Static Baseline) -->
<div class="lg:col-span-6 p-space-md md:p-space-lg flex flex-col justify-between bg-surface-container-low/40">
<div>
<div class="flex items-center justify-between mb-space-xs">
<span class="font-headline-sm text-headline-sm uppercase tracking-wide text-primary-container flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
              Current ETA (Static Observed)
            </span>
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider bg-surface-container px-2 py-0.5 rounded">
              Classical Baseline
            </span>
</div>
<div class="flex items-baseline gap-2 my-2">
<span class="font-metric-huge text-metric-huge text-on-surface tracking-tight font-bold">
              38.4
            </span>
<span class="font-headline-md text-headline-md text-outline">min</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-sm">
            Live GPS probe average · Constant-velocity baseline · Unadjusted for downstream shockwave queuing &amp; corridor choke points.
          </p>
</div>
<div class="flex flex-wrap items-center gap-2 pt-space-xs">
<span class="inline-flex items-center gap-1 font-telemetry-data text-label-sm bg-tertiary-fixed text-on-tertiary-fixed font-semibold px-2.5 py-1 rounded-md">
<span class="material-symbols-outlined text-[14px]">warning</span>
            Congestion factor: 1.42x on Western Express
          </span>
<span class="font-telemetry-data text-label-sm text-outline px-2 py-0.5">
            Probe Confidence: 68.2%
          </span>
</div>
</div>
<!-- Center Floating Delta Badge (Desktop & Tablet) -->
<div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center">
<div class="bg-surface-container-lowest px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5">
<span class="material-symbols-outlined text-secondary text-[20px] animate-pulse">speed</span>
<span class="font-telemetry-data text-label-sm font-bold text-secondary">
            Δ -7.2 min (-18.8%)
          </span>
</div>
</div>
<!-- Mobile Inline Delta Strip -->
<div class="lg:hidden flex items-center justify-between bg-surface-container px-space-md py-2 text-on-surface">
<span class="font-label-sm text-label-sm text-outline uppercase">Dynamic Tunneling Delta</span>
<span class="font-telemetry-data text-label-sm font-bold text-secondary">
          -7.2 min (-18.8% transit reduction)
        </span>
</div>
<!-- Right Half: Predicted ETA (QML Enhanced) -->
<div class="lg:col-span-6 p-space-md md:p-space-lg flex flex-col justify-between bg-gradient-to-br from-secondary/5 via-transparent to-transparent">
<div>
<div class="flex items-center justify-between mb-space-xs">
<span class="font-headline-sm text-headline-sm uppercase tracking-wide text-secondary flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
              Predicted ETA (QML Enhanced)
            </span>
<span class="font-label-sm text-label-sm text-on-secondary-fixed-variant bg-secondary-fixed px-2 py-0.5 rounded font-semibold">
              QSVR Horizon +45m
            </span>
</div>
<div class="flex items-baseline gap-2 my-2">
<span class="font-metric-huge text-metric-huge text-secondary tracking-tight font-bold">
              31.2
            </span>
<span class="font-headline-md text-headline-md text-secondary/70">min</span>
<span class="ml-2 font-telemetry-data text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
              High Confidence: 94.7%
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-sm">
            QSVR Quantum Support Vector Regression · Multi-horizon phase correlation · Accounts for signal cycle decay, intersection clustering &amp; wet pavement dynamics.
          </p>
</div>
<div class="flex flex-wrap items-center gap-2 pt-space-xs">
<span class="inline-flex items-center gap-1 font-telemetry-data text-label-sm bg-secondary-container text-on-secondary-container font-semibold px-2.5 py-1 rounded-md">
<span class="material-symbols-outlined text-[14px]">auto_graph</span>
            Convergence: 128 quantum feature map qubits
          </span>
<span class="font-telemetry-data text-label-sm text-outline px-2 py-0.5">
            Validation Loss: 0.041
          </span>
</div>
</div>
</div>
</section>
<!-- MODEL SELECTOR & EXPERIMENT CONFIGURATION STRIP -->
<section class="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div class="flex flex-wrap items-center gap-2">
<!-- Active Algorithm Switcher -->
<div class="flex items-center bg-surface-container-low rounded-lg p-1">
<span class="material-symbols-outlined text-secondary text-[18px] ml-2 mr-1">hub</span>
<span class="font-label-sm text-label-sm text-outline uppercase mr-2 hidden sm:inline">Active Model:</span>
<select class="bg-surface-container-lowest text-on-surface font-label-md text-label-md py-1 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer font-medium">
<option selected="">QML — QSVR (Quantum Kernel SVR)</option>
<option>Classical ML — Random Forest Regressor</option>
<option>Gradient Boosting (XGBoost Tier 2)</option>
<option>Historical Moving Average Baseline</option>
</select>
</div>
<!-- Kernel Hyperparameters Pill -->
<div class="hidden xl:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg font-telemetry-data text-label-sm text-on-surface-variant">
<span>Map: <strong class="text-on-surface">ZZFeatureMap</strong> (reps=2, entanglement=linear)</span>
<span class="text-outline-variant">|</span>
<span>Array: <strong>2,400 Sensors</strong></span>
</div>
</div>
<!-- Diagnostics and Auto-Retrain state -->
<div class="flex items-center flex-wrap gap-2 md:justify-end">
<div class="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-md">
<span class="material-symbols-outlined text-secondary text-[16px]">verified</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">
          Data Drift: <strong class="text-on-surface">Minimal</strong> (KS-test <span class="font-telemetry-data">p=0.48</span>)
        </span>
</div>
<div class="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-md cursor-pointer hover:bg-surface-container transition-colors" id="driftToggle">
<span class="font-label-sm text-label-sm text-on-surface">Auto-Retrain Daemon</span>
<span class="relative inline-flex h-4 w-7 items-center rounded-full bg-secondary-container transition-colors">
<span class="inline-block h-3 w-3 transform translate-x-3.5 rounded-full bg-secondary transition-transform"></span>
</span>
</div>
</div>
</section>
<!-- THREE CORE CLINICAL METRIC TILES -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-space-sm md:gap-space-md">
<!-- TILE 1: MAE -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Mean Absolute Error (MAE)</span>
<span class="material-symbols-outlined text-primary-container text-[20px]">straighten</span>
</div>
<div class="my-1">
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-on-surface font-bold">1.24</span>
<span class="font-headline-sm text-headline-sm text-outline">min</span>
</div>
</div>
<div class="space-y-1.5 pt-2">
<div class="inline-flex items-center gap-1 font-telemetry-data text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">arrow_downward</span>
<span>0.38 min vs Classical RF (Improving)</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Mean deviation across 48 validation corridor checkpoints.
        </p>
</div>
</div>
<!-- TILE 2: RMSE -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Root Mean Squared Error (RMSE)</span>
<span class="material-symbols-outlined text-secondary text-[20px]">functions</span>
</div>
<div class="my-1">
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-on-surface font-bold">1.68</span>
<span class="font-headline-sm text-headline-sm text-outline">min</span>
</div>
</div>
<div class="space-y-1.5 pt-2">
<div class="inline-flex items-center gap-1 font-telemetry-data text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">arrow_downward</span>
<span>0.52 min (Tight tail distribution)</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Outlier penalty indicator; extreme bottleneck resistance.
        </p>
</div>
</div>
<!-- TILE 3: R2 SCORE -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">R² Goodness of Fit</span>
<span class="material-symbols-outlined text-primary-container text-[20px]">target</span>
</div>
<div class="my-1">
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-secondary font-bold">0.941</span>
<span class="font-headline-sm text-headline-sm text-outline">score</span>
</div>
</div>
<div class="space-y-1.5 pt-2">
<div class="inline-flex items-center gap-1 font-telemetry-data text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">arrow_upward</span>
<span>+0.083 vs RF Baseline</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Explains 94.1% of corridor variance under peak conditions.
        </p>
</div>
</div>
</section>
<!-- MAIN TELEMETRY & RESEARCH SECTION (2 COLUMNS: 65% / 35%) -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
<!-- LEFT COLUMN: TIME SERIES ACCURACY TREND (~65%) -->
<div class="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between space-y-space-md">
<!-- Chart Header & Legend -->
<div>
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
<div>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">
              Prediction Accuracy &amp; Residual Trend
            </h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">
              Observed Transit Time vs. QSVR Predicted Interval (Past 60 Batches)
            </p>
</div>
<!-- Chart Controls -->
<div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
<button class="px-2.5 py-1 text-label-sm font-label-sm rounded bg-surface-container-lowest text-on-surface shadow-xs font-semibold">Live Realtime</button>
<button class="px-2.5 py-1 text-label-sm font-label-sm rounded text-outline hover:text-on-surface transition-colors">1h Rolling</button>
<button class="px-2.5 py-1 text-label-sm font-label-sm rounded text-outline hover:text-on-surface transition-colors">Peak Horizon</button>
</div>
</div>
<!-- Legend Pills -->
<div class="flex flex-wrap items-center gap-4 pt-1 font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-1.5">
<span class="w-3.5 h-1 bg-secondary rounded-full"></span>
<span>QSVR Predicted Interval</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-3.5 h-1 bg-primary-container rounded-full border-t border-dashed"></span>
<span>Ground Truth Actual (GPS probe)</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
<span>Residual Spike Restrained</span>
</div>
</div>
</div>
<!-- INLINE SVG CONVERGENCE & ACCURACY GRAPH (Crisp Laboratory Vector) -->
<div class="relative w-full h-72 bg-surface-container-low/30 rounded-lg p-2 overflow-hidden flex items-center justify-center">
<svg class="w-full h-full" fill="none" viewbox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
<!-- Background Gridlines (Cobalt tinted subtle lines) -->
<line stroke="#757686" stroke-dasharray="3 3" stroke-opacity="0.15" x1="40" x2="660" y1="20" y2="20"></line>
<line stroke="#757686" stroke-dasharray="3 3" stroke-opacity="0.15" x1="40" x2="660" y1="70" y2="70"></line>
<line stroke="#757686" stroke-dasharray="3 3" stroke-opacity="0.15" x1="40" x2="660" y1="120" y2="120"></line>
<line stroke="#757686" stroke-dasharray="3 3" stroke-opacity="0.15" x1="40" x2="660" y1="170" y2="170"></line>
<line stroke="#757686" stroke-opacity="0.3" x1="40" x2="660" y1="210" y2="210"></line>
<!-- Y-Axis Labels -->
<text class="font-telemetry-data text-[10px]" fill="#757686" text-anchor="end" x="32" y="24">50m</text>
<text class="font-telemetry-data text-[10px]" fill="#757686" text-anchor="end" x="32" y="74">42m</text>
<text class="font-telemetry-data text-[10px]" fill="#757686" text-anchor="end" x="32" y="124">35m</text>
<text class="font-telemetry-data text-[10px]" fill="#757686" text-anchor="end" x="32" y="174">28m</text>
<text class="font-telemetry-data text-[10px]" fill="#757686" text-anchor="end" x="32" y="214">20m</text>
<!-- Confidence Band (Shaded light Teal area for ±1 sigma) -->
<polygon fill="#006a69" fill-opacity="0.08" points="50,140 100,132 150,118 200,126 250,96 300,102 350,86 400,92 450,110 500,128 550,116 600,132 650,126 650,154 600,160 550,146 500,154 450,138 400,118 350,112 300,126 250,124 200,148 150,142 100,156 50,164"></polygon>
<!-- Ground Truth Dashed Curve (Cobalt) -->
<path d="M 50 152 Q 95 146, 145 130 T 240 108 T 340 98 T 440 124 T 540 134 T 650 140" fill="none" stroke="#1d3fd1" stroke-dasharray="4 4" stroke-width="2"></path>
<!-- Actual Sudden Spike Outliers (Ground Shockwaves) -->
<circle cx="242" cy="74" fill="#9c231c" r="4" stroke="#ffffff" stroke-width="1.5"></circle>
<text class="font-telemetry-data text-[9px] font-bold" fill="#9c231c" x="250" y="70">+6.4m Surge</text>
<circle cx="442" cy="88" fill="#9c231c" r="4" stroke="#ffffff" stroke-width="1.5"></circle>
<text class="font-telemetry-data text-[9px] font-bold" fill="#9c231c" x="450" y="84">Choke Dampened</text>
<!-- Smooth QSVR Predicted Curve (Rich Teal) -->
<path d="M 50 150 C 100 144, 130 128, 180 125 C 230 122, 270 108, 320 102 C 370 96, 420 114, 470 124 C 520 134, 580 136, 650 135" fill="none" stroke="#006a69" stroke-linecap="round" stroke-width="3"></path>
<!-- Real-time Horizon Target Dot -->
<circle cx="650" cy="135" fill="#006a69" r="5" stroke="#ffffff" stroke-width="2"></circle>
<circle class="animate-ping" cx="650" cy="135" r="10" stroke="#006a69" stroke-opacity="0.4" stroke-width="1.5" style="transform-origin: 650px 135px;"></circle>
<!-- X-Axis Timestamps -->
<text class="font-telemetry-data text-[9px]" fill="#757686" text-anchor="middle" x="50" y="228">T - 60m</text>
<text class="font-telemetry-data text-[9px]" fill="#757686" text-anchor="middle" x="170" y="228">T - 45m</text>
<text class="font-telemetry-data text-[9px]" fill="#757686" text-anchor="middle" x="290" y="228">T - 30m</text>
<text class="font-telemetry-data text-[9px]" fill="#757686" text-anchor="middle" x="410" y="228">T - 15m</text>
<text class="font-telemetry-data text-[9px]" fill="#757686" text-anchor="middle" x="530" y="228">T - 5m</text>
<text class="font-telemetry-data text-[9px] font-bold" fill="#006a69" text-anchor="middle" x="650" y="228">HORIZON (NOW)</text>
</svg>
</div>
<!-- Live Residual Strip Summary -->
<div class="bg-surface-container-low p-space-sm rounded-lg flex flex-wrap items-center justify-between gap-space-xs font-telemetry-data text-telemetry-data text-on-surface-variant">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Mean Residual: <strong class="text-on-surface">+0.12 min</strong></span>
</div>
<div>
<span>Std Dev (<strong class="text-on-surface">σ</strong>): <strong>0.84 min</strong></span>
</div>
<div>
<span>95% Confidence Interval: <strong class="text-secondary">[29.8m, 32.6m]</strong></span>
</div>
<div class="text-outline">
<span>Batch Iteration #8,821</span>
</div>
</div>
</div>
<!-- RIGHT COLUMN: FEATURE WEIGHTS & AUDIT CALLOUT (~35%) -->
<div class="lg:col-span-4 flex flex-col gap-space-md">
<!-- Feature Weights Card -->
<div class="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between flex-1">
<div>
<div class="flex items-center justify-between mb-1">
<h3 class="font-headline-md text-headline-md font-bold text-on-surface">
              Quantum Kernel Weights
            </h3>
<span class="font-label-sm text-label-sm text-secondary bg-secondary-container px-2 py-0.5 rounded font-semibold">Q-PCA Active</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Contribution to Hilbert space separation &amp; latency regression.
          </p>
<!-- Feature Importance Bars -->
<div class="space-y-space-sm">
<!-- Feature 1 -->
<div>
<div class="flex justify-between text-label-sm font-label-sm mb-1">
<span class="text-on-surface font-semibold">Quantum Spatial Entanglement Kernel</span>
<span class="font-telemetry-data text-secondary font-bold">38.4%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full transition-all duration-700" style="width: 38.4%"></div>
</div>
</div>
<!-- Feature 2 -->
<div>
<div class="flex justify-between text-label-sm font-label-sm mb-1">
<span class="text-on-surface">Upstream Signal Phase State</span>
<span class="font-telemetry-data text-primary-container font-semibold">26.1%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full transition-all duration-700" style="width: 26.1%"></div>
</div>
</div>
<!-- Feature 3 -->
<div>
<div class="flex justify-between text-label-sm font-label-sm mb-1">
<span class="text-on-surface">Rainfall &amp; Road Inundation Index</span>
<span class="font-telemetry-data text-primary-container font-semibold">18.7%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full transition-all duration-700" style="width: 18.7%"></div>
</div>
</div>
<!-- Feature 4 -->
<div>
<div class="flex justify-between text-label-sm font-label-sm mb-1">
<span class="text-on-surface">Historical Velocity Profile</span>
<span class="font-telemetry-data text-secondary font-semibold">11.2%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full transition-all duration-700" style="width: 11.2%"></div>
</div>
</div>
<!-- Feature 5 -->
<div>
<div class="flex justify-between text-label-sm font-label-sm mb-1">
<span class="text-outline">Fleet Payload Distribution</span>
<span class="font-telemetry-data text-outline font-medium">5.6%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-outline h-full rounded-full transition-all duration-700" style="width: 5.6%"></div>
</div>
</div>
</div>
</div>
<div class="pt-space-md border-t border-surface-container">
<div class="flex items-center justify-between text-label-sm font-label-sm text-outline">
<span>Kernel Hilbert Space Dim: <strong class="text-on-surface">2¹²⁸</strong></span>
<span class="text-secondary font-semibold cursor-pointer hover:underline">Inspect Matrix</span>
</div>
</div>
</div>
<!-- Clinical Reliability & Audit Callout -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-xs">
<div class="flex items-center gap-2 text-primary-container">
<span class="material-symbols-outlined text-[20px]">verified_user</span>
<span class="font-headline-sm text-headline-sm font-bold text-on-surface">
            Calibrated Honesty Audit
          </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Error bounded within <strong class="text-on-surface font-semibold">±2.1 min</strong> across 98.4% of urban freight test runs. No synthetic over-smoothing detected in peak stop-and-go shockwaves.
        </p>
<div class="flex items-center justify-between pt-2">
<div class="flex items-center gap-1 font-telemetry-data text-label-sm bg-surface-container px-2 py-0.5 rounded text-outline">
<span class="material-symbols-outlined text-[14px]">tag</span>
<span>SEED: #92841-QIDRE</span>
</div>
<span class="font-telemetry-data text-label-sm text-secondary font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">lock</span>
            Cryptographically Verified
          </span>
</div>
</div>
</div>
</section>
<!-- BOTTOM OPERATIONAL PIPELINE & SYNC BAR -->
<section class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
<div class="flex items-center gap-space-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary-container text-[24px]">alt_route</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-headline-sm font-bold text-on-surface">Operational Dispatch Synchronization</span>
<span class="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.2 rounded font-semibold uppercase">Hot Pipeline</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Pushed downstream to vehicle edge dispatchers for dynamic rerouting windows.
        </p>
</div>
</div>
<!-- Quick Transition Actions -->
<div class="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
<a class="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg transition-colors" data-path="fleet-optimizer-optimization-results-dashboard" href="#">
<span class="material-symbols-outlined text-[18px]">query_stats</span>
<span>Push to Fleet Optimizer</span>
</a>
<a class="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95" data-path="route-comparison-results-state" href="#">
<span class="material-symbols-outlined text-[18px]">compare_arrows</span>
<span>Open Route Comparison</span>
</a>
</div>
</section>
</div>
<script>
  // Simple interactive toggle for Retrain Daemon demonstration
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('driftToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const knob = toggle.querySelector('span > span');
        const pill = toggle.querySelector('span.relative');
        if (knob && pill) {
          const isActive = knob.classList.contains('translate-x-3.5');
          if (isActive) {
            knob.classList.remove('translate-x-3.5');
            knob.classList.add('translate-x-0.5');
            pill.classList.remove('bg-secondary-container');
            pill.classList.add('bg-surface-container-highest');
          } else {
            knob.classList.remove('translate-x-0.5');
            knob.classList.add('translate-x-3.5');
            pill.classList.remove('bg-surface-container-highest');
            pill.classList.add('bg-secondary-container');
          }
        }
      });
    }
  });
</script></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">SIH 2026</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
