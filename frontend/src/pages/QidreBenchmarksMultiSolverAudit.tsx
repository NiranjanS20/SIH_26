import React, { useEffect, useRef } from 'react';

export default function QidreBenchmarksMultiSolverAudit({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-16 w-full px-gutter flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="text-headline-md font-headline-md tracking-wider text-primary" style="font-family: 'Inter', sans-serif; font-weight: 700;">QIDRE</span><div class="h-4 w-px bg-surface-container-highest"></div><nav aria-label="Breadcrumb" class="hidden xl:flex items-center gap-space-xs font-telemetry-data text-telemetry-data text-on-surface-variant"><span>Fleet Optimizer</span><span class="text-outline-variant">/</span><span class="text-on-surface">Google Benchmark (Tier 4)</span></nav></div><div class="hidden sm:flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-secondary-container/40"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span><span class="font-label-sm text-label-sm text-secondary uppercase">Node Active</span></div></div><nav class="hidden lg:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-headline-sm rounded-lg"><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="wizard" href="#">Wizard</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="traffic-prediction" href="#">Traffic Prediction</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="results" href="#">Results</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="comparison" href="#">Comparison</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="benchmarks-research" href="#">Benchmarks / Research</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quantum-lab" href="#">Quantum Lab</a></nav><div class="flex items-center gap-space-md"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-16 bg-surface"><div class="flex flex-col w-full">
<!-- Context Banner & System Breadcrumb Header -->
<div class="w-full bg-surface-container-low px-gutter py-space-sm shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-center flex-wrap gap-space-sm">
<div class="flex items-center gap-space-xs font-telemetry-data text-telemetry-data">
<span class="text-primary font-headline-sm font-semibold tracking-wide">WORKSPACE</span>
<span class="text-outline-variant">/</span>
<span class="text-on-surface font-semibold">BENCHMARKS &amp; REPRODUCIBILITY AUDIT</span>
<span class="text-outline-variant">·</span>
<span class="text-on-surface-variant font-normal">AGGREGATED MONTE CARLO TEST RUNS (N=1,200 DISPATCHES)</span>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-label-sm font-telemetry-data font-semibold flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          AUTOMATED TEST SUITE: COMPLETE
        </span>
<span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-telemetry-data text-label-sm font-semibold">
          DETERMINISTIC REPRODUCIBILITY: 100%
        </span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5" id="btnRunSuite">
<span class="material-symbols-outlined text-[16px] text-primary">play_arrow</span>
<span>Run Automated Suite</span>
</button>
<button class="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5" id="btnExport">
<span class="material-symbols-outlined text-[16px]">file_download</span>
<span>Export Benchmarks (.CSV / LaTeX)</span>
</button>
</div>
</div>
<!-- Main View Container -->
<div class="w-full px-gutter py-space-md flex flex-col gap-space-lg">
<!-- Top Filter Bar -->
<div class="w-full bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-md">
<div class="flex flex-wrap items-center gap-space-sm flex-1">
<!-- Solver Selector -->
<div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
<label class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Solver:</label>
<select class="bg-transparent font-telemetry-data text-telemetry-data text-on-surface focus:outline-none cursor-pointer" id="filterSolver">
<option value="ALL">All Solvers (QPSO, GA, ACO, PSO, ILP, QAOA)</option>
<option value="QPSO">QPSO (Quantum Particle Swarm)</option>
<option value="GA">GA (Genetic Algorithm)</option>
<option value="ACO">ACO (Ant Colony Optimization)</option>
<option value="PSO">Classical PSO</option>
<option value="ILP">Exact ILP (Gurobi 11.2)</option>
<option value="QAOA">QAOA Micro Statevector</option>
</select>
</div>
<!-- Instance Size Selector -->
<div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
<label class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Size (N):</label>
<select class="bg-transparent font-telemetry-data text-telemetry-data text-on-surface focus:outline-none cursor-pointer" id="filterSize">
<option value="ALL">All Scales (N=10 to N=250)</option>
<option value="10">N = 10 Stops (Micro)</option>
<option value="25">N = 25 Stops (District)</option>
<option value="50">N = 50 Stops (Hub-Spoke)</option>
<option value="100">N = 100 Stops (Metropolitan)</option>
<option value="250">N = 250 Stops (Megacity Mega-Cluster)</option>
</select>
</div>
<!-- Seed Set Selector -->
<div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
<label class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Seed Set:</label>
<select class="bg-transparent font-telemetry-data text-telemetry-data text-on-surface focus:outline-none cursor-pointer">
<option>Deterministic Standard (#1001-#1050, 50 trials)</option>
<option>Extended Stress Batch (#2001-#2200, 200 trials)</option>
<option>Adversarial Heavy Congestion Seeds (#9001-#9050)</option>
</select>
</div>
<!-- Topology Distribution -->
<div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
<label class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Topology:</label>
<select class="bg-transparent font-telemetry-data text-telemetry-data text-on-surface focus:outline-none cursor-pointer">
<option>Clustered Urban (Mumbai MMR / Western Express)</option>
<option>Uniform Random Poisson Distribution</option>
<option>Radial Port Gateway (Nhava Sheva corridor)</option>
</select>
</div>
</div>
<!-- Action Controls -->
<div class="flex items-center gap-space-sm">
<button class="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors" id="btnResetFilters">
          Reset
        </button>
<div class="h-4 w-px bg-surface-container-highest"></div>
<label class="flex items-center gap-2 cursor-pointer text-label-md font-label-md text-on-surface">
<input checked="" class="w-4 h-4 accent-primary rounded" id="chkHeadToHead" type="checkbox"/>
<span>Compare Head-to-Head</span>
</label>
</div>
</div>
<!-- Top Summary Metric Strip: 4 High-Density Telemetry Cards -->
<div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
<!-- Card 1 -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant mb-1">
<span class="font-label-sm text-label-sm tracking-wider uppercase">Total Benchmark Instances</span>
<span class="material-symbols-outlined text-[18px] text-primary">dataset</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-on-surface">1,200</span>
<span class="font-telemetry-data text-label-sm text-secondary font-semibold">50 SEEDS/INST</span>
</div>
<div class="mt-2 text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Evaluated across 5 topologies</span>
<span class="font-telemetry-data text-label-sm text-primary font-semibold">100% FEASIBLE</span>
</div>
<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20"></div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant mb-1">
<span class="font-label-sm text-label-sm tracking-wider uppercase">QPSO Gap vs Exact ILP (N≤25)</span>
<span class="material-symbols-outlined text-[18px] text-secondary">verified</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-secondary">+0.41%</span>
<span class="font-telemetry-data text-label-sm text-on-surface-variant">(±0.08%)</span>
</div>
<div class="mt-2 text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Near-exact ground truth equivalence</span>
<span class="font-telemetry-data text-label-sm text-secondary font-semibold">Δ 0.6 km</span>
</div>
<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant mb-1">
<span class="font-label-sm text-label-sm tracking-wider uppercase">Runtime Speedup vs Classical GA (N=100)</span>
<span class="material-symbols-outlined text-[18px] text-primary-container">speed</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-primary-container">3.80×</span>
<span class="font-telemetry-data text-label-sm text-secondary font-semibold">FASTER</span>
</div>
<div class="mt-2 text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Mean 1.42s vs 5.39s (stagnation-free)</span>
<span class="font-telemetry-data text-label-sm text-on-surface">p &lt; 0.0001</span>
</div>
<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></div>
</div>
<!-- Card 4 -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant mb-1">
<span class="font-label-sm text-label-sm tracking-wider uppercase">Variance Stability (σ / μ)</span>
<span class="material-symbols-outlined text-[18px] text-tertiary">analytics</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-on-surface">0.024</span>
<span class="font-telemetry-data text-label-sm text-secondary font-semibold">±0.003 COV</span>
</div>
<div class="mt-2 text-body-sm text-on-surface-variant flex items-center justify-between">
<span>High cross-seed algorithmic determinism</span>
<span class="font-telemetry-data text-label-sm text-primary font-semibold">ROBUST</span>
</div>
<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-fixed-dim"></div>
</div>
</div>
<!-- Main Content Section 1: Rigorous Reference Data Table -->
<div class="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="p-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div>
<h2 class="text-headline-sm font-headline-sm text-on-surface">Empirical Multi-Solver Benchmark Matrix</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Aggregated over 50 randomized seeds per instance topology. Standardized coordinate space [0, 100] with dynamic Manhattan/Euclidean traffic routing.</p>
</div>
<div class="flex items-center gap-space-sm font-telemetry-data text-label-sm text-on-surface-variant">
<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-secondary"></span> QPSO Champion</span>
<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-outline"></span> Ground Truth ILP</span>
</div>
</div>
<div class="w-full overflow-x-auto">
<table class="w-full text-left border-collapse" id="benchmarkTable">
<thead>
<tr class="bg-surface-container-highest/60 text-on-surface-variant font-telemetry-data text-label-sm uppercase tracking-wider">
<th class="py-2.5 px-4 font-semibold cursor-pointer select-none" data-col="solver">Solver / Model <span class="text-outline-variant">↕</span></th>
<th class="py-2.5 px-3 font-semibold text-center cursor-pointer select-none" data-col="size">Size (N) <span class="text-outline-variant">↕</span></th>
<th class="py-2.5 px-3 font-semibold text-center">Seeds</th>
<th class="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" data-col="meanDist">Mean Dist (km) <span class="text-outline-variant">↕</span></th>
<th class="py-2.5 px-3 font-semibold text-right">Best Dist (km)</th>
<th class="py-2.5 px-3 font-semibold text-right">Std Dev (σ)</th>
<th class="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" data-col="gap">Opt. Gap (%) <span class="text-outline-variant">↕</span></th>
<th class="py-2.5 px-3 font-semibold text-right cursor-pointer select-none" data-col="runtime">Mean Runtime <span class="text-outline-variant">↕</span></th>
<th class="py-2.5 px-4 font-semibold text-center">Feasibility</th>
</tr>
</thead>
<tbody class="font-telemetry-data text-telemetry-data text-on-surface divide-y divide-surface-container-high/40">
<!-- N=10 Rows -->
<tr class="hover:bg-surface-container-low transition-colors" data-size="10" data-solver="QPSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-secondary-container/60 text-secondary">QPSO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Quantum-Inspired Swarm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">10</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">142.84</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">142.10</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">0.42</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">0.00%</td>
<td class="py-2.5 px-3 text-right text-secondary font-semibold">0.08 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="10" data-solver="ILP">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-surface-container-highest text-on-surface-variant">Exact ILP</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Gurobi 11.2 (MTZ)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">10</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">142.10</td>
<td class="py-2.5 px-3 text-right font-bold text-on-surface">142.10</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">0.00</td>
<td class="py-2.5 px-3 text-right font-bold text-outline">0.00% (ref)</td>
<td class="py-2.5 px-3 text-right">0.14 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="10" data-solver="QAOA">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-error-container text-tertiary">QAOA Micro</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Qiskit Aer Statevec (p=2)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">10</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">144.92</td>
<td class="py-2.5 px-3 text-right">143.05</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">1.84</td>
<td class="py-2.5 px-3 text-right font-bold text-tertiary">+1.98%</td>
<td class="py-2.5 px-3 text-right">1.82 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<!-- N=25 Rows -->
<tr class="hover:bg-surface-container-low transition-colors bg-secondary-container/10" data-size="25" data-solver="QPSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-secondary-container/60 text-secondary">QPSO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Quantum-Inspired Swarm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">25</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">312.44</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">310.80</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">1.12</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">+0.41%</td>
<td class="py-2.5 px-3 text-right text-secondary font-semibold">0.34 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="25" data-solver="ILP">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-surface-container-highest text-on-surface-variant">Exact ILP</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Gurobi 11.2 (MTZ)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">25</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">311.16</td>
<td class="py-2.5 px-3 text-right font-bold text-on-surface">311.16</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">0.00</td>
<td class="py-2.5 px-3 text-right font-bold text-outline">0.00% (ref)</td>
<td class="py-2.5 px-3 text-right text-tertiary font-semibold">14.80 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="25" data-solver="GA">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-fixed text-primary">GA</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Genetic Algorithm (OX Crossover)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">25</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">324.70</td>
<td class="py-2.5 px-3 text-right">318.20</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">3.41</td>
<td class="py-2.5 px-3 text-right font-bold text-primary">+4.35%</td>
<td class="py-2.5 px-3 text-right">0.96 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="25" data-solver="ACO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-container text-on-primary">ACO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Ant Colony (Elitist Pheromone)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">25</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">319.85</td>
<td class="py-2.5 px-3 text-right">315.40</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">2.80</td>
<td class="py-2.5 px-3 text-right font-bold text-primary">+2.79%</td>
<td class="py-2.5 px-3 text-right">1.25 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<!-- N=50 Rows -->
<tr class="hover:bg-surface-container-low transition-colors" data-size="50" data-solver="QPSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-secondary-container/60 text-secondary">QPSO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Quantum-Inspired Swarm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">50</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">584.20</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">578.90</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">2.15</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">Best (0.00%)</td>
<td class="py-2.5 px-3 text-right text-secondary font-semibold">0.72 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="50" data-solver="ILP">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-surface-container-highest text-on-surface-variant">Exact ILP</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Gurobi 11.2 (MTZ)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">50</td>
<td class="py-2.5 px-3 text-center text-tertiary">22 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold text-outline-variant">TIMEOUT (&gt;300s)</td>
<td class="py-2.5 px-3 text-right text-outline-variant">592.10*</td>
<td class="py-2.5 px-3 text-right text-outline-variant">-</td>
<td class="py-2.5 px-3 text-right text-tertiary font-bold">+1.35% (subopt)</td>
<td class="py-2.5 px-3 text-right text-tertiary font-semibold">&gt; 300.00 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-error-container text-tertiary text-label-sm font-semibold">44% (Time Lim)</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="50" data-solver="ACO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-container text-on-primary">ACO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Ant Colony (Elitist)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">50</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">610.15</td>
<td class="py-2.5 px-3 text-right">602.40</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">4.92</td>
<td class="py-2.5 px-3 text-right font-bold text-on-surface-variant">+4.44%</td>
<td class="py-2.5 px-3 text-right">2.84 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="50" data-solver="GA">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-fixed text-primary">GA</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Genetic Algorithm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">50</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">628.90</td>
<td class="py-2.5 px-3 text-right">616.70</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">7.18</td>
<td class="py-2.5 px-3 text-right font-bold text-on-surface-variant">+7.65%</td>
<td class="py-2.5 px-3 text-right">2.18 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<!-- N=100 Rows -->
<tr class="hover:bg-surface-container-low transition-colors bg-secondary-container/10" data-size="100" data-solver="QPSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-secondary-container/60 text-secondary">QPSO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Quantum-Inspired Swarm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">100</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">1,048.60</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">1,039.20</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">3.88</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">Best Known (0%)</td>
<td class="py-2.5 px-3 text-right text-secondary font-semibold">1.42 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="100" data-solver="ACO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-container text-on-primary">ACO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Ant Colony (Elitist)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">100</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">1,122.40</td>
<td class="py-2.5 px-3 text-right">1,108.30</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">9.45</td>
<td class="py-2.5 px-3 text-right font-bold text-primary">+7.04%</td>
<td class="py-2.5 px-3 text-right">6.80 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="100" data-solver="GA">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-fixed text-primary">GA</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Genetic Algorithm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">100</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">1,164.20</td>
<td class="py-2.5 px-3 text-right">1,142.10</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">12.60</td>
<td class="py-2.5 px-3 text-right font-bold text-tertiary">+11.02%</td>
<td class="py-2.5 px-3 text-right">5.39 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="100" data-solver="PSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-surface-container-high text-on-surface-variant">PSO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Classical Particle Swarm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">100</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">1,215.80</td>
<td class="py-2.5 px-3 text-right">1,189.50</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">16.30</td>
<td class="py-2.5 px-3 text-right font-bold text-tertiary">+15.95%</td>
<td class="py-2.5 px-3 text-right">2.14 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<!-- N=250 Rows -->
<tr class="hover:bg-surface-container-low transition-colors bg-secondary-container/20" data-size="250" data-solver="QPSO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-secondary text-on-secondary">QPSO</span>
<span class="text-on-surface font-semibold text-body-sm font-body-sm">Quantum-Inspired Swarm (Q-Anchor)</span>
</td>
<td class="py-2.5 px-3 text-center font-bold text-primary">250</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">2,318.50</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">2,298.10</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">6.24</td>
<td class="py-2.5 px-3 text-right font-bold text-secondary">Baseline Front (0%)</td>
<td class="py-2.5 px-3 text-right text-secondary font-bold">2.18 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="250" data-solver="ACO">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-container text-on-primary">ACO</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Ant Colony Optimization</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">250</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">2,568.30</td>
<td class="py-2.5 px-3 text-right">2,514.00</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">24.50</td>
<td class="py-2.5 px-3 text-right font-bold text-tertiary">+10.77%</td>
<td class="py-2.5 px-3 text-right">18.40 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors" data-size="250" data-solver="GA">
<td class="py-2.5 px-4 flex items-center gap-2">
<span class="px-2 py-0.5 rounded text-label-sm font-semibold bg-primary-fixed text-primary">GA</span>
<span class="text-on-surface-variant text-body-sm font-body-sm">Genetic Algorithm</span>
</td>
<td class="py-2.5 px-3 text-center font-bold">250</td>
<td class="py-2.5 px-3 text-center text-on-surface-variant">50 / 50</td>
<td class="py-2.5 px-3 text-right font-semibold">2,741.00</td>
<td class="py-2.5 px-3 text-right">2,689.40</td>
<td class="py-2.5 px-3 text-right text-on-surface-variant">32.80</td>
<td class="py-2.5 px-3 text-right font-bold text-tertiary">+18.22%</td>
<td class="py-2.5 px-3 text-right">14.15 s</td>
<td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-semibold">100%</span></td>
</tr>
</tbody>
</table>
</div>
<div class="px-4 py-2.5 bg-surface-container-low flex items-center justify-between font-telemetry-data text-label-sm text-on-surface-variant">
<span>* Exact ILP exceeds 300s walltime timeout at N ≥ 50; reporting best bound at termination.</span>
<span class="text-primary font-semibold">Sample Confidence Interval: 99.4% Student-t Test</span>
</div>
</div>
<!-- Main Content Section 2: Grouped Performance Comparison Charts -->
<div class="w-full grid grid-cols-1 xl:grid-cols-2 gap-space-md">
<!-- Chart A: Grouped Bar Chart -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div>
<h3 class="text-headline-sm font-headline-sm text-on-surface">Mean Objective Distance Across Solvers</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant">Routing penalty &amp; total journey distance in kilometers across problem scale</p>
</div>
<span class="px-2.5 py-1 rounded bg-secondary-container/40 text-secondary font-telemetry-data text-label-sm font-semibold">Pareto Dominant</span>
</div>
<!-- Legend -->
<div class="flex flex-wrap items-center gap-space-sm font-telemetry-data text-label-sm mb-4">
<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-secondary"></span><span>QPSO</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary"></span><span>GA</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary-container"></span><span>ACO</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-on-surface-variant"></span><span>PSO</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-outline"></span><span>Exact ILP</span></div>
</div>
<!-- Interactive SVG Chart -->
<div class="w-full h-72 relative flex items-center justify-center">
<svg class="w-full h-full text-outline-variant" preserveaspectratio="none" viewbox="0 0 540 260">
<!-- Grid Lines -->
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="45" x2="520" y1="20" y2="20"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="35" y="24">3000</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="45" x2="520" y1="75" y2="75"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="35" y="79">2000</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="45" x2="520" y1="130" y2="130"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="35" y="134">1000</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="45" x2="520" y1="185" y2="185"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="35" y="189">500</text>
<line stroke="#757686" stroke-width="1.2" x1="45" x2="520" y1="225" y2="225"></line>
<!-- Group 1: N=10 (Center ~90) -->
<!-- QPSO: 142.8 -> ~10px bar -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=10 | QPSO: 142.8km" fill="#006a69" height="11" width="8" x="65" y="214"></rect>
<!-- GA: 148 -> ~11px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=10 | GA: 148.2km" fill="#0027aa" height="12" width="8" x="75" y="213"></rect>
<!-- ACO: 145 -> ~11px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=10 | ACO: 145.1km" fill="#1d3fd1" height="12" width="8" x="85" y="213"></rect>
<!-- PSO: 152 -> ~12px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=10 | PSO: 152.0km" fill="#444655" height="13" width="8" x="95" y="212"></rect>
<!-- ILP: 142.1 -> ~10px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=10 | Exact ILP: 142.1km" fill="#757686" height="11" width="8" x="105" y="214"></rect>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="89" y="242">N=10</text>
<!-- Group 2: N=25 (Center ~185) -->
<!-- QPSO: 312km -> ~24px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=25 | QPSO: 312.4km" fill="#006a69" height="24" width="8" x="160" y="201"></rect>
<!-- GA: 324km -> ~25px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=25 | GA: 324.7km" fill="#0027aa" height="25" width="8" x="170" y="200"></rect>
<!-- ACO: 319km -> ~24px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=25 | ACO: 319.8km" fill="#1d3fd1" height="25" width="8" x="180" y="200"></rect>
<!-- PSO: 338km -> ~26px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=25 | PSO: 338.0km" fill="#444655" height="26" width="8" x="190" y="199"></rect>
<!-- ILP: 311km -> ~24px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=25 | Exact ILP: 311.1km" fill="#757686" height="24" width="8" x="200" y="201"></rect>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="184" y="242">N=25</text>
<!-- Group 3: N=50 (Center ~280) -->
<!-- QPSO: 584km -> ~44px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=50 | QPSO: 584.2km" fill="#006a69" height="44" width="8" x="255" y="181"></rect>
<!-- GA: 628km -> ~48px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=50 | GA: 628.9km" fill="#0027aa" height="48" width="8" x="265" y="177"></rect>
<!-- ACO: 610km -> ~46px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=50 | ACO: 610.1km" fill="#1d3fd1" height="46" width="8" x="275" y="179"></rect>
<!-- PSO: 660km -> ~50px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=50 | PSO: 660.4km" fill="#444655" height="51" width="8" x="285" y="174"></rect>
<!-- ILP: 592km (Timeout) -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=50 | Exact ILP: 592.1km (TO)" fill="#757686" height="45" stroke="#ffffff" stroke-dasharray="2 2" width="8" x="295" y="180"></rect>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="279" y="242">N=50</text>
<!-- Group 4: N=100 (Center ~375) -->
<!-- QPSO: 1048km -> ~78px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=100 | QPSO: 1,048.6km (Best)" fill="#006a69" height="78" width="8" x="350" y="147"></rect>
<!-- GA: 1164km -> ~87px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=100 | GA: 1,164.2km" fill="#0027aa" height="87" width="8" x="360" y="138"></rect>
<!-- ACO: 1122km -> ~84px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=100 | ACO: 1,122.4km" fill="#1d3fd1" height="84" width="8" x="370" y="141"></rect>
<!-- PSO: 1215km -> ~91px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=100 | PSO: 1,215.8km" fill="#444655" height="91" width="8" x="380" y="134"></rect>
<!-- ILP: omitted (Diverged/Timed out) -->
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="374" y="242">N=100</text>
<!-- Group 5: N=250 (Center ~470) -->
<!-- QPSO: 2318km -> ~174px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=250 | QPSO: 2,318.5km (Optimal)" fill="#006a69" height="174" width="10" x="445" y="51"></rect>
<!-- GA: 2741km -> ~205px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=250 | GA: 2,741.0km (+18.2%)" fill="#0027aa" height="205" width="10" x="458" y="20"></rect>
<!-- ACO: 2568km -> ~192px -->
<rect class="chart-bar transition-all hover:opacity-80" data-label="N=250 | ACO: 2,568.3km (+10.8%)" fill="#1d3fd1" height="192" width="10" x="471" y="33"></rect>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="462" y="242">N=250</text>
</svg>
<div class="absolute pointer-events-none hidden bg-inverse-surface text-inverse-on-surface font-telemetry-data text-label-sm px-2.5 py-1.5 rounded shadow-lg z-20" id="chartTooltip"></div>
</div>
<div class="pt-2 flex items-center justify-between text-on-surface-variant font-telemetry-data text-label-sm">
<span>↑ Kilometers (Lower is better)</span>
<span class="text-secondary font-semibold">QPSO demonstrates 18.2% tighter route compaction at N=250</span>
</div>
</div>
<!-- Chart B: Log-Scale Runtime Scalability Curve -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div>
<h3 class="text-headline-sm font-headline-sm text-on-surface">Log-Scale Runtime Scalability</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant">Time-to-convergence latency O(N) complexity tracking up to 250 stops</p>
</div>
<span class="px-2.5 py-1 rounded bg-primary-fixed text-primary font-telemetry-data text-label-sm font-semibold">O(N log N) Profile</span>
</div>
<!-- Legend -->
<div class="flex flex-wrap items-center gap-space-sm font-telemetry-data text-label-sm mb-4">
<div class="flex items-center gap-1.5"><span class="w-3 h-1 bg-secondary rounded"></span><span>QPSO (Tuned Swarm)</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-1 bg-primary rounded"></span><span>GA</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-1 bg-primary-container rounded"></span><span>ACO</span></div>
<div class="flex items-center gap-1.5"><span class="w-3 h-1 bg-tertiary rounded stroke-dashed"></span><span>Exact ILP (Exponential)</span></div>
</div>
<!-- Interactive SVG Line Chart -->
<div class="w-full h-72 relative flex items-center justify-center">
<svg class="w-full h-full text-outline-variant" preserveaspectratio="none" viewbox="0 0 540 260">
<!-- Log Scale Y Grid Lines: 100s, 10s, 1s, 0.1s, 0.01s -->
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="50" x2="520" y1="25" y2="25"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="40" y="29">100 s</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="50" x2="520" y1="75" y2="75"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="40" y="79">10 s</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="50" x2="520" y1="125" y2="125"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="40" y="129">1.0 s</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="50" x2="520" y1="175" y2="175"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="40" y="179">0.1 s</text>
<line stroke="currentColor" stroke-dasharray="3 3" stroke-width="0.7" x1="50" x2="520" y1="225" y2="225"></line>
<text class="text-[10px] fill-current font-telemetry-data" text-anchor="end" x="40" y="229">10 ms</text>
<!-- X Labels: N=10(70), N=25(160), N=50(260), N=100(380), N=250(500) -->
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="70" y="242">10</text>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="160" y="242">25</text>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="260" y="242">50</text>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="380" y="242">100</text>
<text class="text-[11px] fill-on-surface font-telemetry-data font-semibold" text-anchor="middle" x="500" y="242">250</text>
<!-- Critical Cutoff Box for ILP Explosion -->
<rect fill="#9c231c" fill-opacity="0.07" height="40" rx="4" width="290" x="230" y="15"></rect>
<text class="text-[10px] fill-tertiary font-telemetry-data font-bold" text-anchor="middle" x="375" y="32">NP-HARD EXPONENTIAL TIMEOUT ZONE (&gt;180s)</text>
<!-- Curve 1: Exact ILP (Explodes) -->
<!-- 10: 0.14s (y=168), 25: 14.8s (y=66), 50: >300s (y=18) -->
<path d="M 70 168 Q 130 140, 160 66 T 230 18" fill="none" stroke="#7b0707" stroke-dasharray="4 3" stroke-width="2.5"></path>
<circle cx="70" cy="168" fill="#7b0707" r="4"></circle>
<circle cx="160" cy="66" fill="#7b0707" r="4"></circle>
<circle cx="230" cy="18" fill="#7b0707" r="4"></circle>
<!-- Curve 2: ACO (Medium-High Slope) -->
<!-- 10: 0.28s (y=154), 25: 1.25s (y=120), 50: 2.84s (y=102), 100: 6.8s (y=84), 250: 18.4s (y=62) -->
<path d="M 70 154 L 160 120 L 260 102 L 380 84 L 500 62" fill="none" stroke="#1d3fd1" stroke-width="2.2"></path>
<circle cx="70" cy="154" fill="#1d3fd1" r="3.5"></circle>
<circle cx="160" cy="120" fill="#1d3fd1" r="3.5"></circle>
<circle cx="260" cy="102" fill="#1d3fd1" r="3.5"></circle>
<circle cx="380" cy="84" fill="#1d3fd1" r="3.5"></circle>
<circle cx="500" cy="62" fill="#1d3fd1" r="3.5"></circle>
<!-- Curve 3: GA (Medium Slope) -->
<!-- 10: 0.22s (y=159), 25: 0.96s (y=126), 50: 2.18s (y=108), 100: 5.39s (y=89), 250: 14.15s (y=69) -->
<path d="M 70 159 L 160 126 L 260 108 L 380 89 L 500 69" fill="none" stroke="#0027aa" stroke-width="2.2"></path>
<circle cx="70" cy="159" fill="#0027aa" r="3.5"></circle>
<circle cx="160" cy="126" fill="#0027aa" r="3.5"></circle>
<circle cx="260" cy="108" fill="#0027aa" r="3.5"></circle>
<circle cx="380" cy="89" fill="#0027aa" r="3.5"></circle>
<circle cx="500" cy="69" fill="#0027aa" r="3.5"></circle>
<!-- Curve 4: QPSO (Champion Gentle Sub-linear / Poly Curve) -->
<!-- 10: 0.08s (y=179), 25: 0.34s (y=149), 50: 0.72s (y=133), 100: 1.42s (y=117), 250: 2.18s (y=108) -->
<path d="M 70 179 L 160 149 L 260 133 L 380 117 L 500 108" fill="none" stroke="#006a69" stroke-width="3"></path>
<circle cx="70" cy="179" fill="#006a69" r="5" stroke="#ffffff" stroke-width="1.5"></circle>
<circle cx="160" cy="149" fill="#006a69" r="5" stroke="#ffffff" stroke-width="1.5"></circle>
<circle cx="260" cy="133" fill="#006a69" r="5" stroke="#ffffff" stroke-width="1.5"></circle>
<circle cx="380" cy="117" fill="#006a69" r="5" stroke="#ffffff" stroke-width="1.5"></circle>
<circle cx="500" cy="108" fill="#006a69" r="5" stroke="#ffffff" stroke-width="1.5"></circle>
<!-- QPSO Callout Flag -->
<rect fill="#98f2f0" height="18" rx="4" stroke="#006a69" stroke-width="0.8" width="95" x="420" y="85"></rect>
<text class="text-[9px] font-bold fill-[#00504f] font-telemetry-data" text-anchor="middle" x="467" y="97">QPSO: 2.18s @ N=250</text>
</svg>
</div>
<div class="pt-2 flex items-center justify-between text-on-surface-variant font-telemetry-data text-label-sm">
<span>Stops Dispatched (N)</span>
<span class="text-secondary font-semibold">QPSO avoids exponential branching penalties entirely</span>
</div>
</div>
</div>
<!-- Bottom Scientific Methodology & Reproducibility Note -->
<div class="w-full bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
<div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">science</span>
<h4 class="text-headline-sm font-headline-sm text-on-surface">Benchmarking Protocol &amp; Hardware Specifications</h4>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Rigorous reproducible test harness running in isolated cgroups with strictly pinned CPU affinities.</p>
</div>
<div class="flex flex-wrap items-center gap-space-xs">
<button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5" id="btnDownloadJson">
<span class="material-symbols-outlined text-[16px] text-secondary">code</span>
<span>Download Raw JSON</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5" id="btnCopyBibtex">
<span class="material-symbols-outlined text-[16px] text-primary">bookmark</span>
<span>Copy BibTeX Citation</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5" id="btnViewHyperparams">
<span class="material-symbols-outlined text-[16px]">tune</span>
<span>Inspect Hyperparameters</span>
</button>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-2">
<div class="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1">
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Hardware Environment</span>
<span class="font-body-md text-body-md font-semibold text-on-surface">Dual AMD EPYC 7763</span>
<span class="font-telemetry-data text-label-sm text-outline">64-Core / 128 Threads @ 3.5GHz, 256GB ECC DDR4</span>
</div>
<div class="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1">
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">OS &amp; Instruction Sets</span>
<span class="font-body-md text-body-md font-semibold text-on-surface">Ubuntu 22.04 LTS (Kernel 6.2)</span>
<span class="font-telemetry-data text-label-sm text-secondary font-semibold">AVX-512 VNNI Vectorization Enabled</span>
</div>
<div class="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1">
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Exact Ground Truth</span>
<span class="font-body-md text-body-md font-semibold text-on-surface">Gurobi 11.2 Native C++</span>
<span class="font-telemetry-data text-label-sm text-outline">MTZ formulation, MIPGap=1e-5, Cutoff=300s</span>
</div>
<div class="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1">
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase">Seed Generation</span>
<span class="font-body-md text-body-md font-semibold text-on-surface">PCG64 DXSM Generator</span>
<span class="font-telemetry-data text-label-sm text-primary font-semibold">SHA-256 Manifest Verified</span>
</div>
</div>
</div>
</div>
</div>
<script>
  (function initBenchmarkInteractions() {
    const filterSolver = document.getElementById('filterSolver');
    const filterSize = document.getElementById('filterSize');
    const table = document.getElementById('benchmarkTable');
    const tbody = table ? table.querySelector('tbody') : null;
    const btnReset = document.getElementById('btnResetFilters');
    const tooltip = document.getElementById('chartTooltip');

    // Filtering Table Rows
    function applyFilters() {
      if (!tbody) return;
      const selectedSolver = filterSolver.value;
      const selectedSize = filterSize.value;
      const rows = tbody.querySelectorAll('tr');

      rows.forEach(row => {
        const solver = row.getAttribute('data-solver');
        const size = row.getAttribute('data-size');
        const matchSolver = (selectedSolver === 'ALL' || solver === selectedSolver);
        const matchSize = (selectedSize === 'ALL' || size === selectedSize);

        if (matchSolver && matchSize) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    if (filterSolver) filterSolver.addEventListener('change', applyFilters);
    if (filterSize) filterSize.addEventListener('change', applyFilters);

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (filterSolver) filterSolver.value = 'ALL';
        if (filterSize) filterSize.value = 'ALL';
        applyFilters();
      });
    }

    // Chart Bar Tooltip Micro-interaction
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        const label = bar.getAttribute('data-label');
        tooltip.textContent = label;
        tooltip.classList.remove('hidden');
        const rect = bar.getBoundingClientRect();
        const parentRect = bar.closest('svg').getBoundingClientRect();
        tooltip.style.left = (rect.left - parentRect.left) + 'px';
        tooltip.style.top = (rect.top - parentRect.top - 34) + 'px';
      });
      bar.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.add('hidden');
      });
    });

    // Copy BibTeX Toast Interaction
    const btnBibtex = document.getElementById('btnCopyBibtex');
    if (btnBibtex) {
      btnBibtex.addEventListener('click', () => {
        const bibtex = \`@article{qidre2026,\n  title={Quantum-Inspired Swarm Dispatch under Dynamic Congestion},\n  author={Egreen Quanta Core Team},\n  journal={IEEE Trans. Logistics & Quantum Optimization},\n  year={2026}\n}\`;
        navigator.clipboard.writeText(bibtex).then(() => {
          const originalText = btnBibtex.innerHTML;
          btnBibtex.innerHTML = '<span class="material-symbols-outlined text-[16px] text-secondary">check</span><span>Copied to Clipboard!</span>';
          setTimeout(() => {
            btnBibtex.innerHTML = originalText;
          }, 2400);
        });
      });
    }

    // Download Benchmark JSON Stub
    const btnDownload = document.getElementById('btnDownloadJson');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const dummyData = {
          suite: "QIDRE-BENCH-2.12",
          timestamp: new Date().toISOString(),
          seeds: 50,
          hardware: "Dual AMD EPYC 7763",
          runs: 1200,
          status: "DETERMINISTIC_REPRODUCIBILITY_VERIFIED"
        };
        const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qidre-reproducibility-benchmark.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Hyperparameters Modal / Alert
    const btnParams = document.getElementById('btnViewHyperparams');
    if (btnParams) {
      btnParams.addEventListener('click', () => {
        alert("QPSO Tuned Parameters:\n• Contraction-Expansion Coefficient (α): 0.72\n• Quantum Tunneling Probability (P_t): 0.045\n• Memory Attractor Topology: Multi-Swarm Ring\n• Max Iterations: 1500 (Early termination threshold: 120 stagnant iterations)");
      });
    }
  })();
</script></main><footer class="w-full bg-surface-container-low py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="w-full px-gutter flex flex-col md:flex-row items-center justify-between gap-space-sm font-telemetry-data text-telemetry-data text-on-surface-variant"><div class="flex items-center gap-space-xs"><span>Enterprise Logistics</span><span class="text-outline-variant">·</span><span>Quantum Engine</span><span class="text-outline-variant">·</span><span class="font-label-md text-label-md text-primary">Egreen Quanta</span></div><div class="flex items-center gap-space-md font-label-sm text-label-sm"><span>Q-CORE v2.4.9</span><span>LATENCY: 14ms</span></div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
