import React, { useEffect, useRef } from 'react';

export default function QidreFleetOptimizerLiveOptimizationPipeline({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><a class="group flex items-center gap-space-xs transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><span class="font-['Orbitron'] text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="flex items-center gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks" href="#">Benchmarks →</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<!-- Atmospheric Glow Field -->
<div class="relative w-full max-w-7xl mx-auto px-gutter md:px-margin py-space-md">
<!-- Top System Context Strip -->
<div class="w-full flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-md">
<div class="flex items-center gap-space-xs flex-wrap font-label-sm text-label-sm text-on-surface-variant">
<span class="tracking-widest uppercase text-outline">WORKSPACE</span>
<span class="text-outline-variant">/</span>
<span class="tracking-widest uppercase text-outline">FLEET OPTIMIZER</span>
<span class="text-outline-variant">/</span>
<span class="text-primary font-semibold tracking-wider">LIVE EXECUTION PIPELINE</span>
<span class="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-telemetry-data text-label-sm font-bold">#RUN-8842</span>
</div>
<div class="flex items-center gap-space-sm self-start md:self-auto">
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm tracking-wide">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="font-semibold uppercase tracking-wider">ACTIVE QUANTUM SWARM</span>
</div>
<div class="hidden sm:flex items-center gap-1 font-telemetry-data text-label-sm text-outline">
<span class="material-symbols-outlined text-[15px]">timer</span>
<span class="font-semibold text-on-surface" id="global-timer">00:03.28</span>
</div>
</div>
</div>
<!-- Operational Split Console Grid -->
<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT FLANK: Real-time Convergence Telemetry (3 Cols) -->
<aside class="lg:col-span-3 flex flex-col gap-space-md order-2 lg:order-1">
<!-- Live Particle Convergence Card -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Convergence Vector</span>
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-telemetry-data text-[11px] font-bold">QPSO-2.4</span>
</div>
<div class="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Energy State (J)</div>
<!-- Sparkline / Descent Vector Curve -->
<div class="w-full h-32 relative bg-surface-container-lowest flex items-end pt-3">
<svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 200 90">
<defs>
<lineargradient id="convergenceGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#006a69" stop-opacity="0.25"></stop>
<stop offset="100%" stop-color="#006a69" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
<!-- Grid lines -->
<line stroke="#ededf6" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="200" y1="20" y2="20"></line>
<line stroke="#ededf6" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="200" y1="50" y2="50"></line>
<line stroke="#ededf6" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="200" y1="80" y2="80"></line>
<!-- Gradient fill under curve -->
<polygon fill="url(#convergenceGradient)" points="0,15 20,24 45,38 75,44 110,62 145,68 175,74 200,76 200,90 0,90"></polygon>
<!-- Classical Baseline (comparison curve) -->
<path d="M 0,18 Q 60,32 100,50 T 200,64" fill="none" stroke="#bac3ff" stroke-dasharray="2,2" stroke-width="1.5"></path>
<!-- Quantum Active Descent Path -->
<path d="M 0,15 Q 35,28 75,44 T 145,68 T 200,76" fill="none" id="quantum-curve" stroke="#006a69" stroke-linecap="round" stroke-width="2.5"></path>
<!-- Current Head Beacon -->
<circle class="animate-pulse" cx="200" cy="76" fill="#ff6b5b" r="4"></circle>
<circle class="animate-ping" cx="200" cy="76" fill="#ff6b5b" opacity="0.3" r="8"></circle>
</svg>
</div>
<div class="flex items-center justify-between pt-space-xs font-telemetry-data text-label-sm">
<span class="text-outline">Iter 01: 412.0</span>
<span class="text-secondary font-bold">Iter 42: 128.4</span>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-[11px] font-telemetry-data text-on-surface-variant">
<span class="flex items-center gap-1.5">
<span class="w-2 h-0.5 bg-secondary inline-block"></span> QPSO Active
            </span>
<span class="flex items-center gap-1.5">
<span class="w-2 h-0.5 bg-primary-fixed-dim inline-block"></span> Classical SA
            </span>
</div>
</div>
<!-- Quantum Micro-State Metrics -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Quantum Telemetry</span>
<div class="flex flex-col gap-2 font-telemetry-data">
<div class="flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant">Tunneling Prob (γ)</span>
<span class="font-bold text-on-surface">0.184</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 18.4%"></div>
</div>
<div class="flex items-center justify-between text-body-sm pt-1">
<span class="text-on-surface-variant">Swarm Velocity</span>
<span class="font-bold text-on-surface">14.2 m/s</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 62%"></div>
</div>
<div class="flex items-center justify-between text-body-sm pt-1">
<span class="text-on-surface-variant">Pareto Front Depth</span>
<span class="font-bold text-secondary">98.2%</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-secondary-fixed-dim h-full rounded-full" style="width: 98.2%"></div>
</div>
</div>
</div>
</aside>
<!-- CENTER: Primary Quantum Solver Execution Card (6 Cols) -->
<main class="lg:col-span-6 flex flex-col order-1 lg:order-2">
<div class="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
<!-- Subtle corner accent ambient field -->
<div class="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none"></div>
<div class="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none"></div>
<!-- Solver Radar Graphic & Engine Identity -->
<div class="flex flex-col items-center text-center relative z-10 pt-2 pb-6">
<!-- Concentric Pulse Radar Visualizer -->
<div class="relative w-28 h-28 flex items-center justify-center mb-5">
<!-- Outer Ring -->
<div class="absolute inset-0 rounded-full bg-secondary-fixed/30 animate-ping opacity-30"></div>
<!-- Mid Ring -->
<div class="absolute inset-2 rounded-full bg-primary-fixed/50 animate-pulse"></div>
<!-- Inner Frame Ring -->
<div class="absolute inset-4 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center">
<!-- Rotational Sweep SVG -->
<svg class="w-full h-full animate-spin" style="animation-duration: 9s;" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="38" stroke="#98f2f0" stroke-dasharray="12 8" stroke-width="3"></circle>
<circle cx="50" cy="50" fill="none" opacity="0.6" r="30" stroke="#1d3fd1" stroke-dasharray="6 14" stroke-width="2"></circle>
</svg>
</div>
<!-- Quantum Core Nucleus -->
<div class="relative z-10 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
<span class="w-3 h-3 rounded-full bg-tertiary-fixed shadow-[0_0_12px_#ff6b5b] animate-ping absolute"></span>
<span class="w-3 h-3 rounded-full bg-tertiary-fixed shadow-[0_0_8px_#ff6b5b] relative z-10"></span>
</div>
</div>
<!-- Title & Domain Narrative -->
<h1 class="font-['Russo_One'] text-2xl sm:text-3xl text-primary-container tracking-tight mb-2">
              Optimizing Your Fleet
            </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Evaluating <span class="font-semibold text-on-surface">48 delivery nodes</span> across <span class="font-semibold text-on-surface">4 vehicles</span> with QPSO quantum delta-potential tunneling.
            </p>
</div>
<!-- Vertical Pipeline Lifecycle Rows -->
<div class="flex flex-col gap-3 py-4 relative z-10">
<!-- Stage 1: Done -->
<div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low transition-all">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-sm">
<span class="material-symbols-outlined text-[17px] font-bold">check</span>
</div>
<div class="flex flex-col">
<span class="font-body-md text-on-surface font-medium leading-tight">Loading road graph</span>
<span class="font-label-sm text-[11px] text-outline">OpenStreetMap vector topology loaded</span>
</div>
</div>
<span class="font-telemetry-data text-telemetry-data text-outline font-semibold">0.42s</span>
</div>
<!-- Stage 2: Done -->
<div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low transition-all">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-sm">
<span class="material-symbols-outlined text-[17px] font-bold">check</span>
</div>
<div class="flex flex-col">
<span class="font-body-md text-on-surface font-medium leading-tight">Building distance matrix</span>
<span class="font-label-sm text-[11px] text-outline">Haversine metric tensor computed</span>
</div>
</div>
<span class="font-telemetry-data text-telemetry-data text-outline font-semibold">1.18s · 2,304 pairs</span>
</div>
<!-- Stage 3: ACTIVE RUNNING -->
<div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-md transition-all">
<div class="flex items-center gap-3">
<div class="relative flex items-center justify-center w-7 h-7 shrink-0">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-40"></span>
<span class="relative inline-flex rounded-full h-4 w-4 bg-tertiary-container shadow-[0_0_10px_#9c231c]"></span>
</div>
<div class="flex flex-col">
<span class="font-body-md text-on-surface font-bold text-[15px] leading-tight flex items-center gap-1.5">
                    Running QPSO (Quantum Particle Swarm)
                  </span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Evaluating delta well wave-functions</span>
</div>
</div>
<div class="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[11px] font-bold tracking-wider uppercase animate-pulse">
                IN PROGRESS
              </div>
</div>
<!-- Stage 4: Queued -->
<div class="flex items-center justify-between p-3 rounded-xl opacity-60">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline-variant shrink-0">
<span class="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
</div>
<span class="font-body-md text-outline">Evaluating solutions &amp; CVRP constraints</span>
</div>
<span class="font-telemetry-data text-label-sm text-outline">Queued</span>
</div>
<!-- Stage 5: Queued -->
<div class="flex items-center justify-between p-3 rounded-xl opacity-60">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline-variant shrink-0">
<span class="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
</div>
<span class="font-body-md text-outline">Selecting best Pareto route &amp; dispatch plan</span>
</div>
<span class="font-telemetry-data text-label-sm text-outline">Queued</span>
</div>
</div>
<!-- Authentic Quantum Lab Telemetry Readout Strip -->
<div class="w-full bg-primary-fixed/30 rounded-xl p-4 my-5 relative overflow-hidden">
<div class="flex flex-wrap items-center justify-between gap-y-2 font-telemetry-data text-label-md text-on-primary-fixed">
<div class="flex items-center gap-2">
<span class="font-bold text-primary-container">Iter <span id="iter-counter">42</span> / 100</span>
<span class="text-outline">·</span>
<span>Particles: 50</span>
</div>
<div class="flex items-center gap-2">
<span class="text-outline">Best objective:</span>
<span class="font-bold text-secondary text-base">128.4</span>
<span class="text-outline">·</span>
<span>Elapsed: <span id="elapsed-sec">3.2s</span></span>
</div>
</div>
<div class="mt-2.5 pt-2.5 flex flex-wrap items-center justify-between gap-2 font-telemetry-data text-body-sm text-on-surface-variant">
<span>Tunneling Prob: <strong class="text-on-surface">0.184</strong></span>
<span class="text-outline-variant">|</span>
<span>Swarm Velocity: <strong class="text-on-surface">14.2 m/s</strong></span>
<span class="text-outline-variant">|</span>
<span>Memory: <strong class="text-on-surface">48.6 MB</strong></span>
</div>
</div>
<!-- Dynamic Progress Bar -->
<div class="w-full flex flex-col gap-1.5 pt-1">
<div class="w-full h-2.5 bg-surface-container rounded-full overflow-hidden relative">
<div class="h-full bg-secondary rounded-full transition-all duration-300 relative" id="solver-progress" style="width: 42%;">
<!-- Glowing Lead Edge Pulse Dot -->
<span class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-tertiary-fixed rounded-full shadow-[0_0_8px_#ff6b5b]"></span>
</div>
</div>
<div class="flex items-center justify-between font-telemetry-data text-label-sm text-outline px-0.5">
<span class="font-bold text-on-surface"><span id="pct-label">42%</span> Completed</span>
<span>Est. remaining: <span class="text-on-surface font-medium">~4.1s</span></span>
</div>
</div>
<!-- Abort Action & Safe-State Controller -->
<div class="w-full flex items-center justify-between pt-6 mt-4">
<button class="group inline-flex items-center gap-2 font-label-md text-label-md text-outline hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error-container/20" type="button">
<span class="material-symbols-outlined text-[17px] group-hover:rotate-90 transition-transform">close</span>
<span>Cancel Execution</span>
</button>
<div class="flex items-center gap-2 font-label-sm text-[11px] text-outline">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Deterministic Seed: #0x9F4C2</span>
</div>
</div>
</div>
</main>
<!-- RIGHT FLANK: Execution Environment & Mission Target (3 Cols) -->
<aside class="lg:col-span-3 flex flex-col gap-space-md order-3">
<!-- Target Mission Depot Card -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Dispatch Target</span>
<span class="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
</div>
<div class="font-headline-sm text-headline-sm text-on-surface leading-snug">BKC Central Hub</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Depot-01 · Bandra Kurla Complex</div>
<!-- Geographic mini route reference -->
<div class="w-full h-24 rounded-lg bg-surface-container-low p-2.5 relative overflow-hidden flex flex-col justify-between">
<div class="flex items-center justify-between font-telemetry-data text-[11px] text-outline z-10">
<span class="font-bold text-on-surface">MMR Sector 4</span>
<span>18.98°N, 72.82°E</span>
</div>
<!-- Abstract route nodes diagram -->
<svg class="w-full h-12" viewbox="0 0 160 50">
<!-- Route traces -->
<path d="M 15,35 L 45,15 L 85,25 L 120,10 L 150,30" fill="none" stroke="#bac3ff" stroke-dasharray="3,3" stroke-width="1.5"></path>
<path d="M 15,35 L 55,42 L 105,38 L 150,30" fill="none" stroke="#006a69" stroke-width="2"></path>
<!-- Depot node -->
<circle cx="15" cy="35" fill="#1d3fd1" r="4.5"></circle>
<!-- Sub nodes -->
<circle cx="45" cy="15" fill="#006a69" r="2.5"></circle>
<circle cx="85" cy="25" fill="#ff6b5b" r="3"></circle>
<circle cx="120" cy="10" fill="#006a69" r="2.5"></circle>
<circle cx="55" cy="42" fill="#006a69" r="2.5"></circle>
<circle cx="105" cy="38" fill="#006a69" r="2.5"></circle>
<circle cx="150" cy="30" fill="#1d3fd1" r="4"></circle>
</svg>
<span class="font-telemetry-data text-[11px] text-on-surface font-semibold z-10">48 Suburban Waypoints Clustered</span>
</div>
<div class="mt-space-sm grid grid-cols-2 gap-2 text-center font-telemetry-data">
<div class="p-2 rounded bg-surface-container-low">
<div class="text-[10px] text-outline uppercase">Active Fleet</div>
<div class="text-headline-sm font-bold text-primary">4 Vans</div>
</div>
<div class="p-2 rounded bg-surface-container-low">
<div class="text-[10px] text-outline uppercase">Total Payload</div>
<div class="text-headline-sm font-bold text-secondary">3,420 kg</div>
</div>
</div>
</div>
<!-- Computational Substrate Specs -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Allocated Resources</span>
<div class="flex flex-col gap-space-xs font-telemetry-data text-body-sm">
<div class="flex items-center justify-between pb-1">
<span class="text-on-surface-variant">Core Engine</span>
<span class="font-semibold text-on-surface">Hybrid QPSO v2.4</span>
</div>
<div class="flex items-center justify-between pb-1">
<span class="text-on-surface-variant">Active Threads</span>
<span class="font-semibold text-on-surface">8 Physical Cores</span>
</div>
<div class="flex items-center justify-between pb-1">
<span class="text-on-surface-variant">Quantum Simulator</span>
<span class="font-semibold text-secondary">64-Qubit Vector</span>
</div>
<div class="flex items-center justify-between pb-1">
<span class="text-on-surface-variant">Constraint Engine</span>
<span class="font-semibold text-on-surface">Time Window + Cap</span>
</div>
<div class="flex items-center justify-between">
<span class="text-on-surface-variant">Convergence Tolerance</span>
<span class="font-semibold text-on-surface">1e-5 RMS</span>
</div>
</div>
<div class="mt-space-xs p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[16px]">verified</span>
<span class="font-label-sm text-[11px] text-on-surface-variant">SIH 2026 High-Scale Standard Certified</span>
</div>
</div>
</aside>
</div>
<!-- Live Telemetry Log Footer Bar -->
<div class="w-full mt-space-lg p-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm text-on-surface-variant font-telemetry-data text-label-sm">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="flex items-center gap-1.5 text-secondary font-bold">
<span class="w-2 h-2 rounded-full bg-secondary"></span> LOG STREAM
        </span>
<span class="text-outline-variant">|</span>
<span class="text-on-surface truncate">[14:32:04.819] Swarm particle P-29 discovered local potential minimum: 128.411</span>
</div>
<div class="flex items-center gap-space-md shrink-0">
<span class="text-outline">Latency: <span class="text-on-surface font-semibold">14ms</span></span>
<span class="text-outline">Sub-Swarm Clusters: <span class="text-on-surface font-semibold">5 Active</span></span>
</div>
</div>
</div>
<!-- Inline Simulation Dynamics Script -->
<script>
    (function initPipelineTelemetry() {
      let currentIteration = 42;
      let elapsedSeconds = 3.2;
      let currentObjective = 128.4;
      
      const iterElem = document.getElementById('iter-counter');
      const elapsedElem = document.getElementById('elapsed-sec');
      const progressElem = document.getElementById('solver-progress');
      const pctLabelElem = document.getElementById('pct-label');
      const globalTimerElem = document.getElementById('global-timer');

      const interval = setInterval(() => {
        if (currentIteration >= 98) {
          clearInterval(interval);
          return;
        }

        currentIteration += 1;
        elapsedSeconds += 0.08;
        
        // Slightly fluctuate objective towards optimal
        if (Math.random() > 0.6) {
          currentObjective = Math.max(114.2, (currentObjective - 0.28)).toFixed(1);
        }

        if (iterElem) iterElem.textContent = currentIteration;
        if (elapsedElem) elapsedElem.textContent = elapsedSeconds.toFixed(1) + 's';
        
        const pct = Math.min(99, Math.round((currentIteration / 100) * 100));
        if (progressElem) progressElem.style.width = pct + '%';
        if (pctLabelElem) pctLabelElem.textContent = pct + '%';

        const totalSecs = Math.floor(elapsedSeconds);
        const hundredths = Math.floor((elapsedSeconds % 1) * 100);
        const mm = String(Math.floor(totalSecs / 60)).padStart(2, '0');
        const ss = String(totalSecs % 60).padStart(2, '0');
        const hh = String(hundredths).padStart(2, '0');
        if (globalTimerElem) globalTimerElem.textContent = \`\${mm}:\${ss}.\${hh}\`;
      }, 160);
    })();
  </script>
</div></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">SIH 2026</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
