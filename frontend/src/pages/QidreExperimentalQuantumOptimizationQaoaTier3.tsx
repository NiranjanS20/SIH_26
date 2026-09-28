import React, { useEffect, useRef } from 'react';

export default function QidreExperimentalQuantumOptimizationQaoaTier3({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center gap-space-lg"><a class="group flex items-center gap-space-xs transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><span class="font-['Orbitron'] text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="text-outline">/</span><a class="hover:text-on-surface transition-colors" data-path="fleet-optimizer-setup-wizard" href="#">Fleet Optimizer</a><span class="text-outline">/</span><span class="text-primary-container font-medium">Quantum Telemetry Engine</span></div></div><div class="flex items-center gap-space-md md:gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-sm md:gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-setup-wizard" href="#">Wizard</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="traffic-prediction" href="#">Traffic Prediction</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-optimization-results-dashboard" href="#">Results</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="route-comparison-results-state" href="#">Comparison</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks-research" href="#">Benchmarks / Research</a><a aria-current="page" class="transition-colors flex items-center text-primary-container font-semibold" data-path="quantum-lab-experimental-qaoa" href="#">Quantum Lab (Tier 3)</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<!-- 1. TOP RESEARCH BANNER (Strictly Non-dismissible Lab Standard) -->
<aside aria-label="Research Notice" class="w-full bg-error-container text-on-error-container px-gutter py-space-sm shadow-sm transition-all duration-300">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-xs text-body-sm font-body-sm">
<span class="material-symbols-outlined text-[18px] text-tertiary-container shrink-0" style="font-variation-settings: 'FILL' 1;">science</span>
<span class="font-medium text-tertiary-container">Experimental research demonstrator (4–8 stops). Benchmarked against classical solvers.</span>
</div>
<div class="inline-flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 text-tertiary font-label-sm text-label-sm shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
<span class="tracking-wider uppercase">Tier 3 Demonstrator · Qiskit Aer Statevector · NISQ Boundary</span>
</div>
</div>
</aside>
<!-- 2. LAB NOTEBOOK HEADER & EXPERIMENT SETUP STRIP -->
<section class="w-full px-gutter md:px-margin py-space-lg max-w-7xl mx-auto">
<div class="flex flex-col gap-space-md">
<!-- Breadcrumb & Classification Meta -->
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="text-secondary font-semibold uppercase tracking-widest">LAB NOTEBOOK</span>
<span class="text-outline">/</span>
<span class="text-on-surface font-telemetry-data font-semibold">RUN #EXP-0842</span>
<span class="text-outline">·</span>
<span class="text-outline">BENCHMARK TSP/VRP MICRO-INSTANCE</span>
</div>
<div class="flex items-center gap-space-xs font-label-sm text-label-sm bg-surface-container px-3 py-1 rounded-full">
<span class="material-symbols-outlined text-[14px] text-secondary">memory</span>
<span class="text-on-surface">Target Architecture: Transmon Grid (IBM Heron / Eagle Class Sim)</span>
</div>
</div>
<!-- Action Panel & Controls Strip -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
<!-- Control Formlets -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm flex-1">
<!-- Instance Select -->
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Instance</label>
<div class="relative">
<select class="w-full h-11 px-3 bg-surface-container-low text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-colors appearance-none pr-8 cursor-pointer">
<option selected="">Bandra-Kurla Micro-Cluster (6 Nodes / 5 Customers)</option>
<option>Nariman Point FinTech Ring (4 Nodes)</option>
<option>Andheri East Cargo Subnet (8 Nodes)</option>
</select>
<span class="material-symbols-outlined pointer-events-none absolute right-2.5 top-3 text-[18px] text-outline">expand_more</span>
</div>
</div>
<!-- Distance Metric -->
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Metric Matrix</label>
<div class="relative">
<select class="w-full h-11 px-3 bg-surface-container-low text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-colors appearance-none pr-8 cursor-pointer">
<option selected="">Haversine Euclidean Metric [Dense NxN]</option>
<option>Manhattan Asymmetric Manhattan Grid</option>
<option>Dynamic Congestion-Weighted Matrix</option>
</select>
<span class="material-symbols-outlined pointer-events-none absolute right-2.5 top-3 text-[18px] text-outline">expand_more</span>
</div>
</div>
<!-- Seed & Config -->
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">RNG Seed / Precision</label>
<div class="h-11 px-3 bg-surface-container-low text-on-surface rounded-lg font-telemetry-data text-telemetry-data flex items-center justify-between">
<span>#42-NISQ</span>
<span class="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">64-bit FP</span>
</div>
</div>
</div>
<!-- Simulator Mode Toggle & Circuit Re-execution Button -->
<div class="flex flex-wrap sm:flex-nowrap items-center gap-space-sm pt-2 xl:pt-0">
<!-- Degradation Switch Button -->
<button class="h-11 px-3.5 bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg flex items-center gap-2 font-label-md text-label-md transition-colors shadow-sm" id="toggleDegradationBtn" title="Toggle between Qiskit Runtime simulation and Fallback degraded view" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary" id="envIcon">bolt</span>
<span class="font-telemetry-data text-body-sm" id="envLabel">Sim: Runtime Active</span>
</button>
<!-- Re-execute Button -->
<button class="h-11 px-5 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-md text-label-md tracking-wider flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.99] whitespace-nowrap" id="recomputeSweepBtn" type="button">
<span class="material-symbols-outlined text-[18px]" id="runIcon">play_circle</span>
<span>Sweep Circuit (1,024 Shots)</span>
</button>
</div>
</div>
</div>
</section>
<!-- GRACEFUL DEGRADATION CARD PREVIEW (Dynamically controlled via JS toggle) -->
<section class="hidden w-full px-gutter md:px-margin max-w-7xl mx-auto mb-space-md" id="degradationNoticeBox">
<div class="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
<div class="flex items-start gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-outline text-[22px]">developer_board_off</span>
</div>
<div>
<h4 class="font-headline-sm text-headline-sm text-on-surface">Qiskit not installed — classical solver comparison active</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Local execution environment lacks <code class="font-telemetry-data text-body-sm bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface">qiskit-terra</code> or valid IBM Quantum Runtime API credentials. Exact ILP (Gurobi) and Production QPSO heuristics remain fully functional with zero degradation.
          </p>
</div>
</div>
<div class="flex items-center gap-space-xs shrink-0 self-end md:self-center">
<span class="font-telemetry-data text-label-sm text-outline">STATUS_CODE: ENV_NISQ_DEGRADED_002</span>
<button class="px-3 py-1.5 text-on-surface hover:bg-surface-variant rounded-lg font-label-sm text-label-sm transition-colors" id="dismissDegradationHint">
          Dismiss Mock
        </button>
</div>
</div>
</section>
<!-- 3. THREE-COLUMN BENCHMARK COMPARISON MATRIX (The Core Feature) -->
<section class="w-full px-gutter md:px-margin max-w-7xl mx-auto py-space-xs">
<div class="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
<!-- Column 1: EXACT ILP (Gurobi / Branch-and-Cut) -->
<article class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
<div>
<!-- Solver Header -->
<div class="flex items-center justify-between mb-space-sm">
<h3 class="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">EXACT ILP</h3>
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold tracking-wide">
<span class="material-symbols-outlined text-[13px]">verified</span>
              Ground Truth
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Gurobi Optimizer 11.2 · Deterministic Branch-and-Cut with Subtour Elimination Constraints (DFJ formulation).
          </p>
<!-- Metrics Block -->
<div class="bg-surface-container-low rounded-xl p-space-md mb-space-md">
<div class="flex items-baseline justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Objective Cost</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">Optimal Reference</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-metric-huge text-metric-huge text-on-surface tracking-tight">42.18</span>
<span class="font-telemetry-data text-body-sm text-on-surface-variant">km</span>
</div>
<div class="flex items-center gap-2 mt-2 pt-2 border-t-0 font-telemetry-data text-body-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-outline">timer</span>
<span>Runtime: <strong class="text-on-surface font-semibold">0.14s (142 ms)</strong></span>
</div>
</div>
<!-- Technical Formulation Breakdown -->
<div class="space-y-2 font-telemetry-data text-body-sm mb-space-md">
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Decision Variables:</span>
<span class="text-on-surface font-medium">36 binary [x_{ij}]</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-low rounded px-2">
<span class="text-on-surface-variant">Constraints Evaluated:</span>
<span class="text-on-surface font-medium">42 (inc. MTZ)</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Optimality Gap:</span>
<span class="text-secondary font-semibold">0.00% (Absolute)</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-low rounded px-2">
<span class="text-on-surface-variant">Peak Heap Memory:</span>
<span class="text-on-surface font-medium">18.4 MB</span>
</div>
</div>
<!-- Route Sequence Pill -->
<div class="mb-space-md">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1.5">Computed Halting Tour</span>
<div class="bg-surface-container-high px-3 py-2 rounded-lg font-telemetry-data text-body-sm text-on-surface flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
<span class="font-semibold text-primary">D0</span>
<span class="text-outline">→</span>
<span>N1</span>
<span class="text-outline">→</span>
<span>N3</span>
<span class="text-outline">→</span>
<span>N5</span>
<span class="text-outline">→</span>
<span>N4</span>
<span class="text-outline">→</span>
<span>N2</span>
<span class="text-outline">→</span>
<span class="font-semibold text-primary">D0</span>
</div>
</div>
</div>
<!-- Footer Card Status -->
<div class="pt-space-sm bg-surface-container-low -mx-space-lg -mb-space-lg px-space-lg pb-space-md rounded-b-xl flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
            Global Optima Verified
          </span>
<span class="font-label-sm text-label-sm text-outline">Gurobi C++ Engine</span>
</div>
</article>
<!-- Column 2: QPSO (Production Classical Quantum-Inspired Heuristic) -->
<article class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
<div>
<!-- Solver Header -->
<div class="flex items-center justify-between mb-space-sm">
<h3 class="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">QPSO</h3>
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold tracking-wide">
<span class="material-symbols-outlined text-[13px]">bolt</span>
              Production Tier 1
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Quantum-Behaved Particle Swarm Optimization. Uses delta potential-well wavefunction tunneling mechanics.
          </p>
<!-- Metrics Block -->
<div class="bg-surface-container-low rounded-xl p-space-md mb-space-md">
<div class="flex items-baseline justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Objective Cost</span>
<span class="font-label-sm text-label-sm text-secondary font-medium font-telemetry-data">+0.38% vs ILP</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-metric-huge text-metric-huge text-on-surface tracking-tight">42.34</span>
<span class="font-telemetry-data text-body-sm text-on-surface-variant">km</span>
</div>
<div class="flex items-center gap-2 mt-2 pt-2 border-t-0 font-telemetry-data text-body-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-secondary">speed</span>
<span>Runtime: <strong class="text-secondary font-semibold">0.08s (84 ms · 1.7x faster)</strong></span>
</div>
</div>
<!-- Technical Formulation Breakdown -->
<div class="space-y-2 font-telemetry-data text-body-sm mb-space-md">
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Active Swarm Population:</span>
<span class="text-on-surface font-medium">20 particles (mBest mean)</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-low rounded px-2">
<span class="text-on-surface-variant">Completed Iterations:</span>
<span class="text-on-surface font-medium">45 / 100 (Early break)</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Quantum Well Tunneling:</span>
<span class="text-on-surface font-medium">3 barrier crossings</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-low rounded px-2">
<span class="text-on-surface-variant">Convergence Gradient:</span>
<span class="text-secondary font-medium">Rapid monotonic descent</span>
</div>
</div>
<!-- Route Sequence Pill -->
<div class="mb-space-md">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1.5">Computed Halting Tour</span>
<div class="bg-surface-container-high px-3 py-2 rounded-lg font-telemetry-data text-body-sm text-on-surface flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
<span class="font-semibold text-secondary">D0</span>
<span class="text-outline">→</span>
<span>N1</span>
<span class="text-outline">→</span>
<span>N3</span>
<span class="text-outline">→</span>
<span>N5</span>
<span class="text-outline">→</span>
<span>N4</span>
<span class="text-outline">→</span>
<span>N2</span>
<span class="text-outline">→</span>
<span class="font-semibold text-secondary">D0</span>
</div>
</div>
</div>
<!-- Footer Card Status -->
<div class="pt-space-sm bg-surface-container-low -mx-space-lg -mb-space-lg px-space-lg pb-space-md rounded-b-xl flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">task_alt</span>
            Near-Optimal (Δ +0.16 km)
          </span>
<span class="font-label-sm text-label-sm text-outline">C++ OpenMP Engine</span>
</div>
</article>
<!-- Column 3: QAOA (QISKIT) (Quantum Approximate Optimization Algorithm) -->
<article class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
<div>
<!-- Solver Header -->
<div class="flex items-center justify-between mb-space-sm">
<h3 class="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">QAOA (QISKIT)</h3>
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold tracking-wide">
<span class="material-symbols-outlined text-[13px]">hub</span>
              NISQ Demonstrator
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Parameterized quantum circuit on statevector simulator. Alternating cost &amp; mixer Hamiltonians.
          </p>
<!-- Metrics Block -->
<div class="bg-surface-container-low rounded-xl p-space-md mb-space-md">
<div class="flex items-baseline justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Expected Energy Cost</span>
<span class="font-label-sm text-label-sm text-tertiary font-medium font-telemetry-data">+2.06% vs ILP</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-metric-huge text-metric-huge text-on-surface tracking-tight">43.05</span>
<span class="font-telemetry-data text-body-sm text-on-surface-variant">km</span>
</div>
<div class="flex items-center gap-2 mt-2 pt-2 border-t-0 font-telemetry-data text-body-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-tertiary">hourglass_bottom</span>
<span>Runtime: <strong class="text-on-surface font-semibold">3.82s (Aer Statevector)</strong></span>
</div>
</div>
<!-- Special Quantum Hardware Boundary Tags -->
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-telemetry-data text-label-sm font-semibold">Qubits: 6</span>
<span class="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-telemetry-data text-label-sm font-semibold">Circuit depth: 4</span>
<span class="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-telemetry-data text-label-sm font-semibold">p-layers: 2</span>
<span class="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-telemetry-data text-label-sm font-semibold">Shots: 1,024</span>
<span class="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-telemetry-data text-label-sm font-semibold">Fidelity: 0.912</span>
</div>
<!-- Optimization Feedback -->
<div class="space-y-2 font-telemetry-data text-body-sm mb-space-md">
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Classical Optimizer:</span>
<span class="text-on-surface font-medium">COBYLA (Iter 34/50)</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-low rounded px-2">
<span class="text-on-surface-variant">Approximation Ratio (α):</span>
<span class="text-primary font-semibold">0.979</span>
</div>
<div class="flex justify-between py-1 bg-surface-container-lowest rounded px-2">
<span class="text-on-surface-variant">Hardware Noise Model:</span>
<span class="text-on-surface font-medium">ThermalRelaxation2Q</span>
</div>
</div>
<!-- Route Sequence Pill -->
<div class="mb-space-md">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1.5">Sampled Ground Tour (High Prob)</span>
<div class="bg-surface-container-high px-3 py-2 rounded-lg font-telemetry-data text-body-sm text-on-surface flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
<span class="font-semibold text-tertiary">D0</span>
<span class="text-outline">→</span>
<span>N1</span>
<span class="text-outline">→</span>
<span>N3</span>
<span class="text-outline">→</span>
<span class="text-tertiary font-semibold">N4</span>
<span class="text-outline">→</span>
<span class="text-tertiary font-semibold">N5</span>
<span class="text-outline">→</span>
<span>N2</span>
<span class="text-outline">→</span>
<span class="font-semibold text-tertiary">D0</span>
</div>
</div>
</div>
<!-- Footer Card Status -->
<div class="pt-space-sm bg-surface-container-low -mx-space-lg -mb-space-lg px-space-lg pb-space-md rounded-b-xl flex items-center justify-between">
<span class="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">biotech</span>
            NISQ Approximated Tour
          </span>
<span class="font-label-sm text-label-sm text-outline">Qiskit Runtime Aer</span>
</div>
</article>
</div>
</section>
<!-- 4. QUANTUM CIRCUIT ARCHITECTURE & HAMILTONIAN LAB SECTION -->
<section class="w-full px-gutter md:px-margin max-w-7xl mx-auto py-space-md">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
<!-- Left: Ising / QUBO Formulation & Parametrized Ansatz (7 cols) -->
<div class="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<!-- Title & Subtitle -->
<div class="flex items-center justify-between mb-space-sm">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">account_tree</span>
<h4 class="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">Parametrized Ansatz &amp; QUBO Formulation</h4>
</div>
<span class="font-label-sm text-label-sm text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded uppercase">2-Param Pair [γ, β]</span>
</div>
<!-- Hamiltonian Formula Block -->
<div class="bg-surface-container-low rounded-lg p-space-sm mb-space-md">
<div class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Cost Hamiltonian (TSP Distance + Degree Penalty)</div>
<div class="font-telemetry-data text-body-sm text-primary tracking-wide overflow-x-auto py-1 whitespace-nowrap">
              H_C = ∑ C_{i,j} · (I - Z_{i,t} Z_{j,t+1})/2 + λ ∑_{t} (∑_{i} Z_{i,t} - 1)²
            </div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Mixing Hamiltonian: H_B = ∑_{i=0}^{5} X_i  ·  Penalty weight: λ = 84.5 (Lagrangian Relax)
            </div>
</div>
<!-- Interactive Schematic of 6-qubit Quantum Circuit -->
<div class="flex flex-col gap-1.5 mb-space-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">6-Qubit Circuit Visualizer (Depth = 4, p = 2)</span>
<span class="font-telemetry-data text-label-sm text-outline">U(C, γ₁) → U(B, β₁) → U(C, γ₂) → U(B, β₂)</span>
</div>
<!-- SVG Circuit Schematic -->
<div class="w-full bg-surface-container-high rounded-xl p-3 overflow-x-auto">
<svg class="w-full h-auto text-on-surface select-none" viewbox="0 0 680 180" xmlns="http://www.w3.org/2000/svg">
<!-- Wires q0 to q5 -->
<g stroke="#C5C5D7" stroke-width="1.5">
<line x1="45" x2="650" y1="20" y2="20"></line>
<line x1="45" x2="650" y1="50" y2="50"></line>
<line x1="45" x2="650" y1="80" y2="80"></line>
<line x1="45" x2="650" y1="110" y2="110"></line>
<line x1="45" x2="650" y1="140" y2="140"></line>
<line x1="45" x2="650" y1="170" y2="170"></line>
</g>
<!-- Labels -->
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="24">q₀</text>
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="54">q₁</text>
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="84">q₂</text>
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="114">q₃</text>
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="144">q₄</text>
<text class="font-telemetry-data text-[11px] fill-current font-bold" x="10" y="174">q₅</text>
<!-- Layer 0: Hadamard Gates on all lines -->
<g class="text-white" fill="#1D3FD1" text-anchor="middle">
<rect height="20" rx="3" width="20" x="55" y="10"></rect>
<rect height="20" rx="3" width="20" x="55" y="40"></rect>
<rect height="20" rx="3" width="20" x="55" y="70"></rect>
<rect height="20" rx="3" width="20" x="55" y="100"></rect>
<rect height="20" rx="3" width="20" x="55" y="130"></rect>
<rect height="20" rx="3" width="20" x="55" y="160"></rect>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="24">H</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="54">H</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="84">H</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="114">H</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="144">H</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="10" font-weight="bold" x="65" y="174">H</text>
</g>
<!-- Cost Unitary U(C, γ₁) Box background -->
<rect fill="#98F2F0" fill-opacity="0.18" height="170" rx="6" stroke="#006A69" stroke-dasharray="3,3" stroke-width="1.2" width="165" x="95" y="6"></rect>
<text fill="#006A69" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="177" y="17">U(C, γ₁ = 0.412)</text>
<!-- ZZ Entanglement pairs in Layer 1 -->
<!-- q0-q1 CNOT ladder -->
<circle cx="115" cy="20" fill="#006A69" r="3.5"></circle>
<line stroke="#006A69" stroke-width="1.5" x1="115" x2="115" y1="20" y2="50"></line>
<circle cx="115" cy="50" fill="none" r="7" stroke="#006A69" stroke-width="1.5"></circle>
<line stroke="#006A69" stroke-width="1.5" x1="108" x2="122" y1="50" y2="50"></line>
<!-- Rz gate on q1 -->
<rect fill="#006A69" height="20" rx="3" width="34" x="135" y="40"></rect>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="9" text-anchor="middle" x="152" y="54">Rz(γ)</text>
<!-- second CNOT back -->
<circle cx="185" cy="20" fill="#006A69" r="3.5"></circle>
<line stroke="#006A69" stroke-width="1.5" x1="185" x2="185" y1="20" y2="50"></line>
<circle cx="185" cy="50" fill="none" r="7" stroke="#006A69" stroke-width="1.5"></circle>
<line stroke="#006A69" stroke-width="1.5" x1="178" x2="192" y1="50" y2="50"></line>
<!-- q2-q3 pair -->
<circle cx="215" cy="80" fill="#006A69" r="3.5"></circle>
<line stroke="#006A69" stroke-width="1.5" x1="215" x2="215" y1="80" y2="110"></line>
<circle cx="215" cy="110" fill="none" r="7" stroke="#006A69" stroke-width="1.5"></circle>
<!-- Mixer Unitary U(B, β₁) Block -->
<rect fill="#1D3FD1" fill-opacity="0.1" height="170" rx="6" stroke="#1D3FD1" stroke-dasharray="3,3" stroke-width="1.2" width="60" x="275" y="6"></rect>
<text fill="#1D3FD1" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="305" y="17">U(B, β₁)</text>
<!-- Rx gates on each qubit for Mixer -->
<g fill="#1D3FD1">
<rect height="18" rx="3" width="38" x="285" y="11"></rect>
<rect height="18" rx="3" width="38" x="285" y="41"></rect>
<rect height="18" rx="3" width="38" x="285" y="71"></rect>
<rect height="18" rx="3" width="38" x="285" y="101"></rect>
<rect height="18" rx="3" width="38" x="285" y="131"></rect>
<rect height="18" rx="3" width="38" x="285" y="161"></rect>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="24">Rx(β₁)</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="54">Rx(β₁)</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="84">Rx(β₁)</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="114">Rx(β₁)</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="144">Rx(β₁)</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="304" y="174">Rx(β₁)</text>
</g>
<!-- Layer 2: p=2 repeat indicator -->
<rect fill="#E2E2EA" fill-opacity="0.4" height="170" rx="6" width="180" x="350" y="6"></rect>
<text fill="#444655" font-family="Space Grotesk" font-size="12" font-weight="bold" text-anchor="middle" x="440" y="24">[ p=2 Iteration: U(C, γ₂) + U(B, β₂) ]</text>
<text fill="#757686" font-family="JetBrains Mono" font-size="10" text-anchor="middle" x="440" y="94">Parameterized Entanglement Block</text>
<path d="M 370 110 Q 440 135 510 110" fill="none" stroke="#757686" stroke-dasharray="4,4" stroke-width="1.5"></path>
<!-- Measurement Block on all 6 lines -->
<g fill="#2E3037">
<rect height="20" rx="3" width="22" x="550" y="10"></rect>
<rect height="20" rx="3" width="22" x="550" y="40"></rect>
<rect height="20" rx="3" width="22" x="550" y="70"></rect>
<rect height="20" rx="3" width="22" x="550" y="100"></rect>
<rect height="20" rx="3" width="22" x="550" y="130"></rect>
<rect height="20" rx="3" width="22" x="550" y="160"></rect>
<!-- Meas Meter icon representation -->
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="24">M</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="54">M</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="84">M</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="114">M</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="144">M</text>
<text fill="#ffffff" font-family="JetBrains Mono" font-size="11" text-anchor="middle" x="561" y="174">M</text>
</g>
<!-- Classical Register Output Wire -->
<line stroke="#2E3037" stroke-width="2.5" x1="580" x2="640" y1="95" y2="95"></line>
<line stroke="#2E3037" stroke-width="1" x1="580" x2="640" y1="98" y2="98"></line>
<text fill="#2E3037" font-family="JetBrains Mono" font-size="10" font-weight="bold" text-anchor="middle" x="610" y="88">c[6]</text>
</svg>
</div>
</div>
</div>
<div class="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span>Qiskit Aer backend: <strong class="text-on-surface font-telemetry-data">aer_simulator_statevector</strong></span>
<span class="font-telemetry-data text-label-sm text-secondary font-medium">Optimal (γ*, β*) = (0.412 rad, 1.285 rad)</span>
</div>
</div>
<!-- Right: Energy Landscape & Eigenstate Probability Distribution (5 cols) -->
<div class="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<!-- Title & Subtitle -->
<div class="flex items-center justify-between mb-space-sm">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-[20px]">bar_chart</span>
<h4 class="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">Measured Eigenstate Distribution</h4>
</div>
<span class="font-label-sm text-label-sm text-outline font-telemetry-data">1024 SHOTS</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Distribution of top observed projective measurement bitstrings. Peak concentration marks the lowest energy configuration.
          </p>
<!-- Distribution Chart Bars -->
<div class="space-y-3 font-telemetry-data text-body-sm">
<!-- 1. Optimal Bitstring (Ground State) -->
<div class="bg-surface-container-low rounded-lg p-2.5">
<div class="flex items-center justify-between mb-1">
<span class="font-bold text-secondary flex items-center gap-1.5">
<span class="material-symbols-outlined text-[15px]">flag</span>
                  |101100⟩ (Tour D0-N1-N3-N4-N5-N2-D0)
                </span>
<span class="font-bold text-secondary">34.2% (350)</span>
</div>
<div class="w-full bg-surface-variant h-3 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 34.2%"></div>
</div>
<div class="flex justify-between text-[11px] text-on-surface-variant mt-1">
<span>E = -43.05 km (Valid TSP Loop)</span>
<span class="text-secondary font-semibold">Peak Eigenstate</span>
</div>
</div>
<!-- 2. Sub-optimal Bitstring 2 -->
<div class="bg-surface-container-low rounded-lg p-2.5">
<div class="flex items-center justify-between mb-1">
<span class="text-on-surface">|101010⟩ (Tour Permutation B)</span>
<span class="text-on-surface font-semibold">18.6% (190)</span>
</div>
<div class="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 18.6%"></div>
</div>
<div class="flex justify-between text-[11px] text-on-surface-variant mt-0.5">
<span>E = -45.12 km (Sub-optimal detour)</span>
<span>Δ +2.07 km</span>
</div>
</div>
<!-- 3. Sub-optimal Bitstring 3 -->
<div class="bg-surface-container-low rounded-lg p-2.5">
<div class="flex items-center justify-between mb-1">
<span class="text-on-surface">|011100⟩ (Tour Permutation C)</span>
<span class="text-on-surface font-semibold">11.4% (117)</span>
</div>
<div class="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
<div class="bg-primary-container/80 h-full rounded-full" style="width: 11.4%"></div>
</div>
<div class="flex justify-between text-[11px] text-on-surface-variant mt-0.5">
<span>E = -47.80 km (Cross-route penalty)</span>
<span>Δ +4.75 km</span>
</div>
</div>
<!-- 4. Infeasible / Subtour Eigenstates (Residual Noise) -->
<div class="bg-surface-container-low rounded-lg p-2.5">
<div class="flex items-center justify-between mb-1">
<span class="text-outline">|000000⟩ .. |111111⟩ (Residual Infeasible States)</span>
<span class="text-outline font-medium">35.8% (367)</span>
</div>
<div class="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
<div class="bg-outline-variant h-full rounded-full" style="width: 35.8%"></div>
</div>
<div class="flex justify-between text-[11px] text-outline mt-0.5">
<span>Penalized by constraint λ-term</span>
<span>Filtered by post-selection</span>
</div>
</div>
</div>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-secondary">filter_alt</span>
            Infeasible Shot Rejection: Active
          </span>
<span class="font-telemetry-data text-label-sm font-semibold text-on-surface">Valid Tour Ratio: 64.2%</span>
</div>
</div>
</div>
</section>
<!-- 5. LAB NOTEBOOK AUDIT & HARDWARE BOUNDARY SUMMARY -->
<section class="w-full px-gutter md:px-margin max-w-7xl mx-auto py-space-sm mb-space-xl">
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-lg">
<!-- Scientific Observation Paragraph -->
<div class="flex-1">
<div class="flex items-center gap-space-xs mb-1.5">
<span class="material-symbols-outlined text-outline text-[18px]">menu_book</span>
<h5 class="font-headline-sm text-headline-sm text-on-surface">Empirical Laboratory Observation &amp; Complexity Boundary</h5>
</div>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          For small instance boundaries (<span class="font-telemetry-data font-semibold text-on-surface">N ≤ 8</span>), Exact ILP dominates runtime and memory efficiency. QAOA demonstrates theoretical polynomial scalability bounds (<span class="font-telemetry-data font-semibold text-on-surface">O(N³)</span> quantum steps) for future fault-tolerant QPUs, but currently experiences decoherence noise and two-qubit CNOT gate error saturation under NISQ hardware constraints.
        </p>
</div>
<!-- Lab Export & Action Controls -->
<div class="flex flex-wrap sm:flex-nowrap items-center gap-space-sm shrink-0">
<!-- Export QASM Button -->
<button class="h-11 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors shadow-sm" id="exportQasmBtn" title="Download compiled OpenQASM 3.0 quantum circuit instructions" type="button">
<span class="material-symbols-outlined text-[18px] text-primary">data_object</span>
<span>Export OpenQASM 3.0</span>
</button>
<!-- Export LaTeX Benchmark Table -->
<button class="h-11 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors shadow-sm" id="exportLatexBtn" title="Generate IEEE/SIH paper formatted LaTeX comparative table" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">table_chart</span>
<span>Export LaTeX Table</span>
</button>
<!-- Send Micro-Instance to Production QPSO -->
<button class="h-11 px-5 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl font-label-md text-label-md flex items-center gap-2 transition-all shadow-md active:scale-[0.99] whitespace-nowrap" id="dispatchQpsoBtn" type="button">
<span class="material-symbols-outlined text-[18px]">rocket_launch</span>
<span>Dispatch to QPSO Production</span>
</button>
</div>
</div>
</section>
<!-- Notification Toast feedback container -->
<div class="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col gap-2" id="toastContainer"></div>
</div>
<script>
  // Simple micro-interactions for the Lab Notebook screen
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleDegradationBtn');
    const degradationBox = document.getElementById('degradationNoticeBox');
    const dismissBtn = document.getElementById('dismissDegradationHint');
    const recomputeBtn = document.getElementById('recomputeSweepBtn');
    const exportQasmBtn = document.getElementById('exportQasmBtn');
    const exportLatexBtn = document.getElementById('exportLatexBtn');
    const dispatchBtn = document.getElementById('dispatchQpsoBtn');
    const envIcon = document.getElementById('envIcon');
    const envLabel = document.getElementById('envLabel');
    const toastContainer = document.getElementById('toastContainer');

    let isDegradedMock = false;

    function showToast(message, icon = 'info') {
      const toast = document.createElement('div');
      toast.className = 'pointer-events-auto bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-body-sm text-body-sm transition-all duration-300 opacity-0 translate-y-2';
      toast.innerHTML = \`
        <span class="material-symbols-outlined text-secondary-fixed text-[20px]">\${icon}</span>
        <span>\${message}</span>
      \`;
      toastContainer.appendChild(toast);
      
      requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
      });

      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    // Toggle degradation mode preview
    if (toggleBtn && degradationBox) {
      toggleBtn.addEventListener('click', () => {
        isDegradedMock = !isDegradedMock;
        if (isDegradedMock) {
          degradationBox.classList.remove('hidden');
          envLabel.textContent = 'Sim: Fallback Degraded';
          envIcon.textContent = 'warning';
          envIcon.classList.remove('text-secondary');
          envIcon.classList.add('text-tertiary');
          showToast('Simulating environment without Qiskit runtime', 'developer_board_off');
        } else {
          degradationBox.classList.add('hidden');
          envLabel.textContent = 'Sim: Runtime Active';
          envIcon.textContent = 'bolt';
          envIcon.classList.remove('text-tertiary');
          envIcon.classList.add('text-secondary');
          showToast('Qiskit Aer Statevector backend reconnected', 'check_circle');
        }
      });
    }

    if (dismissBtn && degradationBox) {
      dismissBtn.addEventListener('click', () => {
        degradationBox.classList.add('hidden');
      });
    }

    // Circuit sweep re-computation feedback
    if (recomputeBtn) {
      recomputeBtn.addEventListener('click', () => {
        const runIcon = document.getElementById('runIcon');
        if (runIcon) runIcon.classList.add('animate-spin');
        recomputeBtn.disabled = true;
        recomputeBtn.classList.add('opacity-80');

        setTimeout(() => {
          if (runIcon) runIcon.classList.remove('animate-spin');
          recomputeBtn.disabled = false;
          recomputeBtn.classList.remove('opacity-80');
          showToast('1,024 Shots collected. Statevector energy: -43.05 km (p=2, COBYLA iter 34)', 'analytics');
        }, 1100);
      });
    }

    // Export buttons
    if (exportQasmBtn) {
      exportQasmBtn.addEventListener('click', () => {
        showToast('Exported 6-Qubit Hamiltonian ansatz to OpenQASM 3.0 specification', 'download');
      });
    }

    if (exportLatexBtn) {
      exportLatexBtn.addEventListener('click', () => {
        showToast('LaTeX table copied to clipboard: ILP vs QPSO vs QAOA benchmarks', 'content_paste');
      });
    }

    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', () => {
        showToast('Micro-cluster dispatched to Production QPSO swarm engine (ID: #DISPATCH-774)', 'rocket_launch');
      });
    }
  });
</script></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">SIH 2026</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
