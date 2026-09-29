import React, { useEffect, useRef } from 'react';

export default function QidreResearchDashboardQpsoInternals({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center gap-space-lg"><a class="group flex items-center gap-2 transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="font-sans font-bold text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="text-outline">/</span><a class="hover:text-on-surface transition-colors" data-path="fleet-optimizer-setup-wizard" href="#">Fleet Optimizer</a><span class="text-outline">/</span><span class="text-primary-container font-medium">Quantum Telemetry Engine</span></div></div><div class="flex items-center gap-space-md md:gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-sm md:gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-setup-wizard" href="#">Wizard</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-optimization-results-dashboard" href="#">Results</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="route-comparison-results-state" href="#">Comparison</a><a aria-current="page" class="transition-colors flex items-center text-primary-container font-semibold" data-path="benchmarks-research" href="#">Benchmarks / Research</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<div class="w-full max-w-7xl mx-auto px-gutter md:px-margin py-space-md flex flex-col gap-space-lg">
<!-- SUB-HEADER / CONTEXT BAR -->
<div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div class="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm sm:gap-space-md">
<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="tracking-wider text-outline">WORKSPACE</span>
<span class="text-outline">/</span>
<span class="tracking-wider text-outline">FLEET OPTIMIZER</span>
<span class="text-outline">/</span>
<span class="font-bold text-primary-container tracking-wider">ALGORITHM TELEMETRY · RUN #QPSO-92841</span>
</div>
<div class="inline-flex items-center gap-space-xs px-space-xs py-0.5 rounded-full bg-secondary-container/30 text-secondary font-telemetry-data text-label-sm">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="font-medium tracking-tight uppercase">QUANTUM KERNEL ACTIVE · DELTA-POTENTIAL TUNNELING</span>
<span class="text-outline text-[10px]">|</span>
<span class="text-[11px] font-telemetry-data text-on-surface">SEED 0x9F4C2</span>
<span class="text-outline text-[10px]">|</span>
<span class="text-[11px] font-telemetry-data text-secondary font-semibold">120 Hz</span>
</div>
</div>
<div class="flex items-center gap-space-xs self-end xl:self-auto">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md flex items-center gap-1 shadow-sm transition-all duration-150" id="streamToggleBtn" onclick="toggleTelemetryStream()">
<span class="material-symbols-outlined text-[16px] text-primary-container" id="streamToggleIcon">pause</span>
<span id="streamToggleText">Pause Stream</span>
</button>
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md flex items-center gap-1 shadow-sm transition-all duration-150" onclick="exportTelemetryJson()">
<span class="material-symbols-outlined text-[16px] text-secondary">data_object</span>
<span>Download Telemetry (.JSON)</span>
</button>
<button class="px-space-sm py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-md font-label-md flex items-center gap-1 shadow-md transition-all duration-150">
<span class="material-symbols-outlined text-[16px]">compare_arrows</span>
<span>Benchmark vs Classical SA/GA</span>
</button>
</div>
</div>
<!-- TOP STRIP (5 STAT CARDS) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
<!-- Stat 1 -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div class="absolute top-0 left-0 right-0 h-[3px] bg-secondary"></div>
<div class="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span class="font-headline-sm text-body-sm text-outline uppercase tracking-wider">Swarm Size (N)</span>
<span class="material-symbols-outlined text-secondary text-[18px]">hub</span>
</div>
<div class="font-metric-huge text-metric-huge text-on-surface my-1" id="metric-swarm">50</div>
<div class="flex items-center justify-between mt-space-xs">
<span class="text-[11px] font-telemetry-data text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded-full font-semibold">Static Cluster</span>
<span class="text-[11px] font-telemetry-data text-outline">Q-Particles</span>
</div>
</div>
<!-- Stat 2 -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div class="absolute top-0 left-0 right-0 h-[3px] bg-secondary"></div>
<div class="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span class="font-headline-sm text-body-sm text-outline uppercase tracking-wider">Max Iterations</span>
<span class="material-symbols-outlined text-secondary text-[18px]">flag</span>
</div>
<div class="font-metric-huge text-metric-huge text-on-surface my-1" id="metric-max-iter">100</div>
<div class="flex items-center justify-between mt-space-xs">
<span class="text-[11px] font-telemetry-data text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-full font-semibold">Stop Criterion</span>
<span class="text-[11px] font-telemetry-data text-outline">Fixed Epoch</span>
</div>
</div>
<!-- Stat 3 -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div class="absolute top-0 left-0 right-0 h-[3px] bg-secondary"></div>
<div class="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span class="font-headline-sm text-body-sm text-outline uppercase tracking-wider">Current Iteration</span>
<span class="material-symbols-outlined text-primary-container text-[18px]">sync</span>
</div>
<div class="font-metric-huge text-metric-huge text-primary-container my-1" id="metric-current-iter">73</div>
<div class="flex items-center justify-between mt-space-xs">
<span class="text-[11px] font-telemetry-data text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded-full font-semibold">73.0% Converged</span>
<span class="text-[11px] font-telemetry-data text-outline">k = 73 / 100</span>
</div>
</div>
<!-- Stat 4 -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div class="absolute top-0 left-0 right-0 h-[3px] bg-secondary"></div>
<div class="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span class="font-headline-sm text-body-sm text-outline uppercase tracking-wider">Best Objective (J)</span>
<span class="material-symbols-outlined text-secondary text-[18px]">insights</span>
</div>
<div class="font-metric-huge text-metric-huge text-on-surface my-1" id="metric-best-j">128.4</div>
<div class="flex items-center justify-between mt-space-xs">
<span class="text-[11px] font-telemetry-data text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded-full font-semibold">↓ -32.8% vs Init</span>
<span class="text-[11px] font-telemetry-data text-outline">Cost Metric</span>
</div>
</div>
<!-- Stat 5 -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div class="absolute top-0 left-0 right-0 h-[3px] bg-secondary"></div>
<div class="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span class="font-headline-sm text-body-sm text-outline uppercase tracking-wider">Elapsed Time</span>
<span class="material-symbols-outlined text-secondary text-[18px]">timer</span>
</div>
<div class="font-metric-huge text-metric-huge text-on-surface my-1" id="metric-elapsed">4.1s</div>
<div class="flex items-center justify-between mt-space-xs">
<span class="text-[11px] font-telemetry-data text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-full font-semibold">56.1 ms/iter</span>
<span class="text-[11px] font-telemetry-data text-outline">Wall Clock</span>
</div>
</div>
</div>
<!-- MAIN CHARTS AREA (TWO SCIENTIFIC CHARTS SIDE BY SIDE) -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
<!-- LEFT CHART: Convergence Trajectory -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
<div>
<h2 class="font-headline-md text-headline-md text-primary-container flex items-center gap-space-xs">
<span>Convergence Trajectory</span>
<span class="text-body-sm font-telemetry-data px-2 py-0.5 bg-surface-container rounded text-on-surface-variant">Objective J</span>
</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Descent of global best (gBest) energy across iterations</p>
</div>
<div class="flex items-center gap-space-xs text-[11px] font-telemetry-data">
<span class="flex items-center gap-1 text-secondary font-semibold">
<span class="w-3 h-0.5 bg-secondary inline-block"></span> QPSO
            </span>
<span class="flex items-center gap-1 text-outline">
<span class="w-3 h-0.5 border-b border-dashed border-outline inline-block"></span> Classical SA
            </span>
</div>
</div>
<!-- SVG Plot -->
<div class="w-full relative h-[280px] bg-surface-container-low/40 rounded-lg p-space-sm flex items-center justify-center">
<svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 540 240">
<defs>
<lineargradient id="qpsoGlow" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" stop-color="#006a69" stop-opacity="0.8"></stop>
<stop offset="100%" stop-color="#006a69" stop-opacity="1"></stop>
</lineargradient>
</defs>
<!-- Coordinate Grid (dashed subtle) -->
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="20" y2="20"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="60" y2="60"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="100" y2="100"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="140" y2="140"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="180" y2="180"></line>
<line opacity="0.8" stroke="#c5c5d7" stroke-width="1.2" x1="45" x2="520" y1="210" y2="210"></line>
<!-- X Grid lines -->
<line opacity="0.8" stroke="#c5c5d7" stroke-width="1.2" x1="45" x2="45" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="140" x2="140" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="235" x2="235" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="330" x2="330" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="425" x2="425" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="520" x2="520" y1="20" y2="210"></line>
<!-- Y Axis Numeric Labels -->
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="24">350</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="64">300</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="104">250</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="144">200</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="184">150</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="213">100</text>
<!-- X Axis Numeric Labels -->
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="45" y="226">0</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="140" y="226">20</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="235" y="226">40</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="330" y="226">60</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="425" y="226">80</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="520" y="226">100</text>
<!-- Classical Baseline Curve (Simulated Annealing - Dashed Trajectory) -->
<path d="M 45,26 C 90,65 140,110 200,132 C 260,154 320,165 380,172 C 430,177 480,180 520,181" fill="none" opacity="0.6" stroke="#757686" stroke-dasharray="4,4" stroke-width="1.8"></path>
<!-- QPSO Trajectory (with Quantum Tunneling drops) -->
<path d="M 45,25 
                     L 75,58 
                     L 110,88 
                     L 135,115 
                     L 142,138 
                     L 180,145 
                     L 220,152 
                     L 250,155 
                     L 255,172 
                     L 310,175 
                     L 350,178 
                     L 380,182 
                     L 392,192 
                     L 392,192" fill="none" id="qpsoLine" stroke="url(#qpsoGlow)" stroke-linecap="round" stroke-width="2.5"></path>
<!-- Quantum Step Drop Annotation Marker -->
<circle cx="255" cy="172" fill="#006a69" r="3.5"></circle>
<text class="font-telemetry-data text-[9px] fill-current text-secondary font-bold" x="260" y="166">Tunnel Jump ΔJ=-17</text>
<!-- Current Active Point (Iter 73, value 128.4 => approx x:392, y:192) -->
<circle class="animate-ping" cx="392" cy="192" fill="#006a69" opacity="0.2" r="9"></circle>
<circle cx="392" cy="192" fill="#006a69" r="5"></circle>
<circle cx="392" cy="192" fill="#ffffff" r="2"></circle>
<!-- Projected continuation path (dotted faint) -->
<path d="M 392,192 C 430,195 475,197 520,198" fill="none" opacity="0.4" stroke="#006a69" stroke-dasharray="3,3" stroke-width="1.5"></path>
</svg>
</div>
<!-- Readout & Legend Box -->
<div class="mt-space-md p-space-sm bg-surface-container-low rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs text-on-surface">
<div class="flex items-center gap-space-xs font-telemetry-data text-body-sm">
<span class="text-secondary font-bold">Current gBest:</span>
<span class="font-metric-huge text-headline-sm text-on-surface">128.411 J</span>
<span class="text-outline">|</span>
<span class="text-body-sm text-on-surface-variant">Stagnation Window: <strong class="text-secondary font-medium">0</strong> (Active descent)</span>
</div>
<span class="text-[11px] font-telemetry-data bg-secondary-container/40 text-secondary px-2 py-0.5 rounded font-semibold">
            ε = 2.41e-4
          </span>
</div>
</div>
<!-- RIGHT CHART: Population Diversity Metric -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
<div>
<h2 class="font-headline-md text-headline-md text-tertiary-container flex items-center gap-space-xs">
<span>Population Diversity Metric</span>
<span class="text-body-sm font-telemetry-data px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed rounded font-semibold">Swarm Entropy</span>
</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Avoidance of premature local-minima entrapment via delta-well tunneling</p>
</div>
<div class="flex items-center gap-space-xs text-[11px] font-telemetry-data">
<span class="flex items-center gap-1 text-tertiary-container font-semibold">
<span class="w-3 h-0.5 bg-tertiary-container inline-block"></span> Swarm Entropy S(t)
            </span>
</div>
</div>
<!-- SVG Plot -->
<div class="w-full relative h-[280px] bg-surface-container-low/40 rounded-lg p-space-sm flex items-center justify-center">
<svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 540 240">
<defs>
<lineargradient id="coralAreaGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#9c231c" stop-opacity="0.28"></stop>
<stop offset="60%" stop-color="#9c231c" stop-opacity="0.10"></stop>
<stop offset="100%" stop-color="#9c231c" stop-opacity="0.01"></stop>
</lineargradient>
</defs>
<!-- Coordinate Grid lines -->
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="20" y2="20"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="67" y2="67"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="115" y2="115"></line>
<line opacity="0.6" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="45" x2="520" y1="162" y2="162"></line>
<line opacity="0.8" stroke="#c5c5d7" stroke-width="1.2" x1="45" x2="520" y1="210" y2="210"></line>
<!-- X Grid lines -->
<line opacity="0.8" stroke="#c5c5d7" stroke-width="1.2" x1="45" x2="45" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="140" x2="140" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="235" x2="235" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="330" x2="330" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="425" x2="425" y1="20" y2="210"></line>
<line opacity="0.4" stroke="#c5c5d7" stroke-dasharray="3,3" stroke-width="0.8" x1="520" x2="520" y1="20" y2="210"></line>
<!-- Y Axis Numeric Labels -->
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="24">1.0</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="71">0.75</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="119">0.50</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="166">0.25</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="end" x="36" y="213">0.0</text>
<!-- X Axis Numeric Labels -->
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="45" y="226">0</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="140" y="226">20</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="235" y="226">40</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="330" y="226">60</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="425" y="226">80</text>
<text class="font-telemetry-data text-[10px] fill-current text-outline" text-anchor="middle" x="520" y="226">100</text>
<!-- Classical Collapse Ghost Reference -->
<path d="M 45,30 C 95,90 140,170 200,195 L 520,208" fill="none" opacity="0.35" stroke="#ba1a1a" stroke-dasharray="3,3" stroke-width="1.2"></path>
<text class="font-telemetry-data text-[8.5px] fill-current text-tertiary opacity-70" x="180" y="202">Classical Premature Collapse</text>
<!-- Coral Gradient Area Path Under Curve -->
<path d="M 45,30 
                     C 80,48 100,68 130,85 
                     C 155,98 175,108 200,120
                     L 225,95 
                     C 240,118 260,134 290,140
                     C 310,144 325,148 345,130
                     C 365,145 378,149 392,152
                     L 392,210 L 45,210 Z" fill="url(#coralAreaGrad)"></path>
<!-- Rich Coral Diversity Line with Tunneling Re-excitation Spikes -->
<path d="M 45,30 
                     C 80,48 100,68 130,85 
                     C 155,98 175,108 200,120
                     L 225,95 
                     C 240,118 260,134 290,140
                     C 310,144 325,148 345,130
                     C 365,145 378,149 392,152" fill="none" stroke="#9c231c" stroke-linecap="round" stroke-width="2.5"></path>
<!-- Re-excitation Spikes Points -->
<circle cx="225" cy="95" fill="#9c231c" r="3.5"></circle>
<text class="font-telemetry-data text-[9px] fill-current text-tertiary-container font-bold" x="215" y="86">Quantum Re-excitation</text>
<circle cx="345" cy="130" fill="#9c231c" r="3"></circle>
<!-- Current Head Dot at iter 73 -->
<circle class="animate-ping" cx="392" cy="152" fill="#9c231c" opacity="0.25" r="8"></circle>
<circle cx="392" cy="152" fill="#9c231c" r="4.5"></circle>
<circle cx="392" cy="152" fill="#ffffff" r="1.5"></circle>
<!-- Ghost continuation projection -->
<path d="M 392,152 C 430,158 480,165 520,168" fill="none" opacity="0.4" stroke="#9c231c" stroke-dasharray="3,3" stroke-width="1.5"></path>
</svg>
</div>
<!-- Readout & Proof Callout Badge -->
<div class="mt-space-md p-space-sm bg-error-container/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs text-on-surface">
<div class="flex items-center gap-space-xs font-telemetry-data text-body-sm">
<span class="material-symbols-outlined text-tertiary-container text-[18px]">verified</span>
<span class="text-tertiary-container font-bold">Premature Convergence Avoided:</span>
<span class="font-metric-huge text-body-sm text-on-surface">Entropy S = 0.384</span>
</div>
<span class="text-[11px] font-telemetry-data bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-semibold">
            Tunneling Rate γ = 0.184
          </span>
</div>
</div>
</div>
<!-- PARAMETER SENSITIVITY & HYPERPARAMETER TUNING MATRIX -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Parameter Sensitivity &amp; Hyperparameter Tuning Matrix</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Real-time reactive control loop with dynamic wave-packet expansion tuning</p>
</div>
<div class="flex items-center gap-space-xs text-label-sm font-telemetry-data text-outline">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Online Autotuner: Continuous Gradient Sync</span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<!-- CARD 1: Swarm Size -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md text-on-surface font-semibold">Swarm Size (Particles N)</span>
<span class="font-telemetry-data text-label-md font-bold text-primary-container px-2 py-0.5 bg-surface-container-lowest rounded shadow-sm" id="sliderSwarmValue">N = 50</span>
</div>
<!-- Slider Range -->
<div class="flex flex-col gap-1">
<input class="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" id="swarmSlider" max="150" min="10" oninput="updateParam('swarm', this.value)" type="range" value="50"/>
<div class="flex justify-between text-[10px] font-telemetry-data text-outline">
<span>N=10</span>
<span class="text-secondary font-bold">Optimal N=50</span>
<span>N=150</span>
</div>
</div>
<!-- Mini Sensitivity Sparkline SVG -->
<div class="w-full h-14 bg-surface-container-lowest rounded-lg p-1.5 flex items-center justify-between">
<div class="flex flex-col justify-center">
<span class="text-[10px] font-telemetry-data text-outline">Response Curve</span>
<span class="text-[11px] font-telemetry-data text-on-surface font-semibold">Cost vs Scale</span>
</div>
<svg class="h-10 w-36 overflow-visible" viewbox="0 0 120 40">
<path d="M 5,35 Q 25,28 45,15 T 75,10 L 115,9" fill="none" stroke="#0027aa" stroke-width="2"></path>
<!-- Marker at N=50 -->
<circle cx="55" cy="12" fill="#006a69" r="3.5"></circle>
<line stroke="#006a69" stroke-dasharray="2,2" stroke-width="1" x1="55" x2="55" y1="0" y2="40"></line>
</svg>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Optimal frontier balancing CPU latency (4.1s) and exploration coverage. Diminishing returns beyond N=65.
          </p>
</div>
<!-- CARD 2: Beta Schedule -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md text-on-surface font-semibold">Contraction-Expansion (β Schedule)</span>
<span class="font-telemetry-data text-label-md font-bold text-primary-container px-2 py-0.5 bg-surface-container-lowest rounded shadow-sm" id="sliderBetaValue">β = 0.72</span>
</div>
<!-- Slider Range -->
<div class="flex flex-col gap-1">
<input class="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" id="betaSlider" max="120" min="30" oninput="updateParam('beta', this.value/100)" type="range" value="72"/>
<div class="flex justify-between text-[10px] font-telemetry-data text-outline">
<span>β=0.30</span>
<span class="text-secondary font-bold">β=0.72 (Decay)</span>
<span>β=1.20</span>
</div>
</div>
<!-- Mini Sensitivity Sparkline SVG -->
<div class="w-full h-14 bg-surface-container-lowest rounded-lg p-1.5 flex items-center justify-between">
<div class="flex flex-col justify-center">
<span class="text-[10px] font-telemetry-data text-outline">Dynamic Decay</span>
<span class="text-[11px] font-telemetry-data text-on-surface font-semibold">1.0 → 0.5 α</span>
</div>
<svg class="h-10 w-36 overflow-visible" viewbox="0 0 120 40">
<path d="M 5,8 L 35,16 L 70,26 L 115,34" fill="none" stroke="#1d3fd1" stroke-width="2"></path>
<!-- Marker at current Beta -->
<circle cx="60" cy="23" fill="#006a69" r="3.5"></circle>
<line stroke="#006a69" stroke-dasharray="2,2" stroke-width="1" x1="60" x2="60" y1="0" y2="40"></line>
</svg>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Regulates particle velocity envelope around local attractor p_i. Prevents spatial orbital explosion.
          </p>
</div>
<!-- CARD 3: Max Iterations & Epsilon -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md text-on-surface font-semibold">Iterations &amp; Convergence ε</span>
<span class="font-telemetry-data text-label-md font-bold text-primary-container px-2 py-0.5 bg-surface-container-lowest rounded shadow-sm" id="sliderIterValue">K=100 | ε=1e-5</span>
</div>
<!-- Slider Range -->
<div class="flex flex-col gap-1">
<input class="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" id="iterSlider" max="250" min="50" oninput="updateParam('iter', this.value)" type="range" value="100"/>
<div class="flex justify-between text-[10px] font-telemetry-data text-outline">
<span>K=50</span>
<span class="text-secondary font-bold">K=100</span>
<span>K=250</span>
</div>
</div>
<!-- Mini Sensitivity Sparkline SVG -->
<div class="w-full h-14 bg-surface-container-lowest rounded-lg p-1.5 flex items-center justify-between">
<div class="flex flex-col justify-center">
<span class="text-[10px] font-telemetry-data text-outline">Tolerance Cutoff</span>
<span class="text-[11px] font-telemetry-data text-on-surface font-semibold">σ² &lt; 0.001</span>
</div>
<svg class="h-10 w-36 overflow-visible" viewbox="0 0 120 40">
<path d="M 5,5 Q 40,25 70,33 T 115,35" fill="none" stroke="#0027aa" stroke-width="2"></path>
<!-- Marker at iteration threshold -->
<circle cx="50" cy="27" fill="#006a69" r="3.5"></circle>
<line stroke="#006a69" stroke-dasharray="2,2" stroke-width="1" x1="50" x2="50" y1="0" y2="40"></line>
</svg>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Stops execution early if variance σ² &lt; 0.001 over 15 iterations. Prevents thermal compute exhaustion.
          </p>
</div>
</div>
</div>
<!-- BOTTOM SCIENTIFIC PROOF STRIP / LOG STREAM -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
<div class="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary-container text-[20px]">science</span>
<span class="font-telemetry-data text-body-sm text-on-surface font-medium">
            Hamiltonian formulation: <span class="text-primary-container font-semibold">H_p = - (ℏ²/2m)∇² + V(x)</span> · Delta-potential well simulation
          </span>
</div>
<div class="hidden sm:inline-block w-px h-5 bg-outline-variant"></div>
<div class="flex items-center gap-2 text-outline font-telemetry-data text-[12px]">
<span class="text-on-surface-variant font-medium">SHA256: 8a4f91b72e04d603e874</span>
<span>·</span>
<span class="text-secondary font-semibold">Seed #92841</span>
</div>
</div>
<div class="flex items-center gap-space-xs self-end lg:self-auto">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md flex items-center gap-1 shadow-sm transition-all duration-150" onclick="rerunQuantumSweep()">
<span class="material-symbols-outlined text-[16px] text-primary-container">restart_alt</span>
<span>Re-run Sweep</span>
</button>
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md flex items-center gap-1 shadow-sm transition-all duration-150" onclick="exportLatexReport()">
<span class="material-symbols-outlined text-[16px] text-tertiary-container">description</span>
<span>Export LaTeX Report</span>
</button>
</div>
</div>
</div>
</div>
<script>
  let isStreaming = true;
  let currentIteration = 73;
  let bestJ = 128.411;

  function toggleTelemetryStream() {
    isStreaming = !isStreaming;
    const btnText = document.getElementById('streamToggleText');
    const btnIcon = document.getElementById('streamToggleIcon');
    if (isStreaming) {
      btnText.innerText = 'Pause Stream';
      btnIcon.innerText = 'pause';
    } else {
      btnText.innerText = 'Resume Stream';
      btnIcon.innerText = 'play_arrow';
    }
  }

  function updateParam(type, value) {
    if (type === 'swarm') {
      document.getElementById('sliderSwarmValue').innerText = 'N = ' + value;
      document.getElementById('metric-swarm').innerText = value;
    } else if (type === 'beta') {
      document.getElementById('sliderBetaValue').innerText = 'β = ' + Number(value).toFixed(2);
    } else if (type === 'iter') {
      document.getElementById('sliderIterValue').innerText = 'K = ' + value + ' | ε=1e-5';
      document.getElementById('metric-max-iter').innerText = value;
    }
  }

  function rerunQuantumSweep() {
    const iterEl = document.getElementById('metric-current-iter');
    const jEl = document.getElementById('metric-best-j');
    iterEl.innerText = '1';
    jEl.innerText = '342.1';
    setTimeout(() => {
      iterEl.innerText = '73';
      jEl.innerText = '128.4';
    }, 450);
  }

  function exportTelemetryJson() {
    const data = {
      run_id: "QPSO-92841",
      seed: "0x9F4C2",
      particles: 50,
      iterations: 73,
      max_iterations: 100,
      best_objective_J: 128.411,
      tunneling_rate_gamma: 0.184,
      beta_schedule: 0.72,
      stagnation_counter: 0,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qpso_telemetry_92841.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportLatexReport() {
    const latexSnippet = \`\\section{Quantum-Behaved Particle Swarm Optimization (QPSO) Convergence}
\\textbf{Run ID:} QPSO-92841 \\quad \\textbf{Seed:} 0x9F4C2 \\\\
\\textbf{Hamiltonian Formulation:} $\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(x)$ with delta-potential well center $p_i$. \\\\
\\textbf{Observed Metric:} Final $J = 128.411$, Diversity $S(t) = 0.384$, $\\gamma = 0.184$.\`;
    const blob = new Blob([latexSnippet], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qpso_report_92841.tex";
    a.click();
    URL.revokeObjectURL(url);
  }
</script></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">QIDRE</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
