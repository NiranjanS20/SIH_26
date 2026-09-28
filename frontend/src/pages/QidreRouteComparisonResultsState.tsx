import React, { useEffect, useRef } from 'react';

export default function QidreRouteComparisonResultsState({ navigate }: { navigate: (path: string) => void }) {
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
<!-- SUB-HEADER TELEMETRY STRIP -->
<div class="w-full bg-surface-container-lowest shadow-sm mb-space-md">
<div class="max-w-7xl mx-auto px-gutter md:px-margin py-3 flex flex-wrap items-center justify-between gap-y-2">
<!-- Breadcrumb Path -->
<div class="flex items-center flex-wrap gap-2 text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
<span>Workspace</span>
<span class="text-outline-variant">/</span>
<span class="text-on-surface font-semibold">Pairwise Verification Matrix</span>
<span class="text-outline-variant">/</span>
<span class="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold">[v2.4 ACTIVE]</span>
<span class="text-outline-variant">/</span>
<span class="text-secondary font-telemetry-data font-semibold">#QP-9821</span>
</div>
<!-- Real-Time Solver Signals -->
<div class="flex items-center gap-space-lg text-telemetry-data font-telemetry-data">
<div class="flex items-center gap-2">
<span class="relative flex h-2.5 w-2.5">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
</span>
<span class="text-on-surface font-semibold font-body-sm text-body-sm">Status:</span>
<span class="text-secondary font-semibold">Quantum Convergence Achieved</span>
</div>
<div class="hidden md:flex items-center gap-1.5 text-on-surface-variant">
<span class="text-outline">Latency:</span>
<span class="font-bold text-on-surface">238ms</span>
</div>
<div class="hidden sm:flex items-center gap-1.5 text-on-surface-variant">
<span class="text-outline">QPSO Particles:</span>
<span class="font-bold text-primary-container">64</span>
</div>
</div>
</div>
</div>
<!-- MAIN DUAL-PANE COCKPIT -->
<div class="max-w-7xl mx-auto px-gutter md:px-margin w-full pb-space-xl">
<div class="flex flex-col lg:flex-row gap-space-lg w-full items-stretch">
<!-- LEFT DISPATCH BENCHMARK PANE (35%) -->
<div class="w-full lg:w-[36%] flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
<div class="flex flex-col gap-space-md">
<!-- Module Tag Header -->
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">MODULE 01 · PAIRWISE COMPARISON</span>
<span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
              SOLVED · READY
            </span>
</div>
<!-- Main Benchmark Title & Spatial Corridors -->
<div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mb-1">Route Benchmark</h1>
<div class="flex flex-col gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
<div class="flex items-start gap-2">
<span class="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
<div>
<span class="font-semibold text-on-surface">BKC Terminal</span>
<span class="font-telemetry-data text-[11px] text-outline ml-1">19.0657° N, 72.8686° E</span>
<span class="mx-1 text-outline">➔</span>
<span class="font-semibold text-on-surface">JNPT Freight Gate</span>
<span class="font-telemetry-data text-[11px] text-outline ml-1">18.9499° N, 72.9515° E</span>
</div>
</div>
<p class="text-body-sm text-outline pl-6">Corridor: Atal Setu (MTHL) Eastern Cross-Harbour Expressway</p>
</div>
</div>
<!-- HIGH-IMPACT HIGHLIGHT CORAL BANNER -->
<div class="bg-error-container/30 rounded-xl p-space-md shadow-sm relative overflow-hidden">
<div class="absolute -right-4 -bottom-4 w-20 h-20 bg-error/10 rounded-full blur-xl pointer-events-none"></div>
<div class="flex items-center justify-between mb-1.5">
<span class="font-headline-md text-headline-md font-bold text-tertiary tracking-tight">4 MIN FASTER</span>
<span class="px-2 py-0.5 rounded-full bg-error-container text-tertiary-container font-label-sm text-label-sm font-bold">27 MIN vs 31 MIN</span>
</div>
<p class="text-body-sm font-body-sm text-tertiary font-medium">
              Δ Time: <span class="font-telemetry-data font-bold">-12.9%</span> · Dynamic avoidance of Sewri junction bottleneck · Fuel saving: <span class="font-telemetry-data font-bold">~1.4L</span>
</p>
</div>
<!-- TWO STACKED COMPARISON MINI-CARDS -->
<div class="flex flex-col gap-space-sm mt-1">
<!-- Card 1: Baseline Dijkstra -->
<div class="bg-surface-container-low rounded-xl p-space-md relative overflow-hidden">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
<div class="pl-2">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="w-3 h-1 bg-primary rounded-full"></span>
<span class="font-headline-sm text-headline-sm font-bold text-on-surface">Baseline (Dijkstra)</span>
</div>
<span class="font-label-sm text-label-sm text-outline font-semibold uppercase">Shortest Path</span>
</div>
<div class="grid grid-cols-4 gap-2 mb-2 bg-surface-container-lowest p-2 rounded-lg">
<div>
<span class="block font-body-sm text-[11px] text-outline">Distance</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">31.2 km</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Transit Time</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">31 min</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Turns</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">14</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Segments</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">86</span>
</div>
</div>
<div class="flex items-center gap-1.5 text-body-sm text-[12px] text-outline">
<span class="material-symbols-outlined text-[14px] text-error">warning</span>
<span>Bottleneck vulnerability: Elevated at Wadala &amp; Sewri North</span>
</div>
</div>
</div>
<!-- Card 2: QPSO Optimal -->
<div class="bg-secondary-container/20 rounded-xl p-space-md relative overflow-hidden">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
<div class="pl-2">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="w-3 h-1 bg-secondary rounded-full"></span>
<span class="font-headline-sm text-headline-sm font-bold text-secondary">Our Route (QPSO)</span>
</div>
<span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold uppercase">Quantum Swarm v2.4</span>
</div>
<div class="grid grid-cols-4 gap-2 mb-2 bg-surface-container-lowest p-2 rounded-lg">
<div>
<span class="block font-body-sm text-[11px] text-outline">Distance</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">29.4 km</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Transit Time</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">27 min</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Turns</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">9</span>
</div>
<div>
<span class="block font-body-sm text-[11px] text-outline">Segments</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">62</span>
</div>
</div>
<div class="flex items-center gap-1.5 text-body-sm text-[12px] text-secondary font-medium">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
<span>Flow efficiency: 94.2% · Seamless highway slip-lane entry</span>
</div>
</div>
</div>
</div>
</div>
<!-- ACTION FOOTER & RE-RUN CONTROLS -->
<div class="mt-space-md pt-space-sm flex flex-col gap-space-sm">
<div class="flex flex-col sm:flex-row gap-2">
<button class="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm">
<span class="material-symbols-outlined text-[18px]">tune</span>
<span>Adjust Inputs &amp; Rerun</span>
</button>
<button class="py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">download</span>
<span>Export Telemetry</span>
</button>
</div>
<div class="flex flex-col gap-1.5">
<div class="flex items-center justify-between text-telemetry-data text-[11px] text-outline">
<span>Compute Time: 0.8s (Iteration 38/64 converged)</span>
<span class="text-secondary font-semibold">Loss: 0.0042</span>
</div>
<div class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low text-outline text-[12px] font-body-sm">
<span class="material-symbols-outlined text-[16px] text-outline">info</span>
<span>Identical route check: Evaluated 12 micro-segments; 1 divergence detected.</span>
</div>
</div>
</div>
</div>
<!-- RIGHT MAP PANE (65%) -->
<div class="w-full lg:w-[64%] bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col relative min-h-[620px]">
<!-- FLOATING TOP CONTROLS -->
<div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
<!-- Corridor Active Indicator -->
<div class="pointer-events-auto bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">MUMBAI HARBOUR &amp; MTHL CORRIDOR</span>
</div>
<!-- View Mode Filter Pills -->
<div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md p-1 rounded-full shadow-md flex items-center gap-1 text-label-sm font-label-sm">
<button class="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors" id="btn-show-baseline" onclick="filterRoutes('baseline')">Baseline</button>
<button class="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors" id="btn-show-ours" onclick="filterRoutes('ours')">QPSO Route</button>
<button class="px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-bold shadow-sm transition-all" id="btn-show-both" onclick="filterRoutes('both')">Show Both</button>
<button class="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors" id="btn-show-diff" onclick="filterRoutes('diff')">Divergence Only</button>
</div>
</div>
<!-- MAP CANVAS (Rich Realistic Vector Cartography) -->
<div class="relative w-full flex-1 bg-surface-container-low overflow-hidden select-none">
<!-- Vector Map SVG Canvas -->
<svg class="w-full h-full min-h-[580px]" preserveaspectratio="xMidYMid slice" viewbox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg">
<defs>
<!-- Land & Water Gradients -->
<lineargradient id="waterGrad" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#dee5f2"></stop>
<stop offset="100%" stop-color="#cad7ec"></stop>
</lineargradient>
<lineargradient id="landGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#ffffff"></stop>
<stop offset="100%" stop-color="#f3f4f8"></stop>
</lineargradient>
<filter height="140%" id="glowTeal" width="140%" x="-20%" y="-20%">
<fegaussianblur result="blur" stddeviation="3"></fegaussianblur>
<fecomposite in="SourceGraphic" in2="blur" operator="over"></fecomposite>
</filter>
</defs>
<!-- Base Water Body (Thane Creek & Mumbai Harbour) -->
<rect fill="url(#waterGrad)" height="680" width="1000"></rect>
<!-- Cartographic Coordinate Grid -->
<g opacity="0.25" stroke="#757686" stroke-dasharray="4,6" stroke-width="0.5">
<line x1="100" x2="100" y1="0" y2="680"></line>
<line x1="300" x2="300" y1="0" y2="680"></line>
<line x1="500" x2="500" y1="0" y2="680"></line>
<line x1="700" x2="700" y1="0" y2="680"></line>
<line x1="900" x2="900" y1="0" y2="680"></line>
<line x1="0" x2="1000" y1="120" y2="120"></line>
<line x1="0" x2="1000" y1="280" y2="280"></line>
<line x1="0" x2="1000" y1="440" y2="440"></line>
<line x1="0" x2="1000" y1="600" y2="600"></line>
</g>
<!-- Island of Mumbai (Western Coast) -->
<path d="M 0,0 L 340,0 C 330,80 360,140 310,210 C 270,260 290,320 280,390 C 260,460 210,520 240,680 L 0,680 Z" fill="url(#landGrad)"></path>
<!-- Mainland Coastline (Navi Mumbai / Nhava Sheva / Uran) -->
<path d="M 680,0 C 720,110 650,210 690,320 C 730,420 710,510 750,680 L 1000,680 L 1000,0 Z" fill="url(#landGrad)"></path>
<!-- Elephanta Island in Harbour Bay -->
<path d="M 520,380 C 550,370 560,400 540,420 C 520,430 500,410 520,380 Z" fill="#e2e6f0"></path>
<text fill="#757686" font-family="Hanken Grotesk" font-size="10" font-weight="600" text-anchor="middle" x="530" y="440">Gharapuri / Elephanta</text>
<!-- Secondary Urban Road Arterials (Muted) -->
<g fill="none" stroke="#d5d7e2" stroke-width="1.5">
<path d="M 120,30 L 160,180 L 150,340 L 190,520"></path>
<path d="M 240,40 L 260,190 L 210,380"></path>
<path d="M 280,120 L 190,260 L 160,410"></path>
<path d="M 750,80 L 780,240 L 740,480"></path>
<path d="M 850,140 L 820,360 L 890,550"></path>
</g>
<!-- MTHL Atal Setu Sea Bridge Physical Structure Geometry -->
<path d="M 285,340 C 380,335 520,375 700,410" fill="none" opacity="0.6" stroke="#b0b5c9" stroke-linecap="round" stroke-width="8"></path>
<path d="M 285,340 C 380,335 520,375 700,410" fill="none" stroke="#f0f2f8" stroke-linecap="round" stroke-width="4"></path>
<text fill="#444655" font-family="Space Grotesk" font-size="11" font-weight="700" letter-spacing="0.08em" x="490" y="350">ATAL SETU (MTHL EXPRESSWAY)</text>
<!-- ROUTE 1: BASELINE DIJKSTRA (Cobalt #0027aa, arterial crawl with detour) -->
<g class="transition-opacity duration-300" id="route-baseline">
<!-- Shadow/Glow -->
<path d="M 220,120 L 250,180 L 245,230 L 230,280 L 260,320 L 285,340 C 380,335 520,375 700,410 L 760,450 L 790,510" fill="none" opacity="0.6" stroke="#bac3ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path>
<!-- Core Path -->
<path d="M 220,120 L 250,180 L 245,230 L 230,280 L 260,320 L 285,340 C 380,335 520,375 700,410 L 760,450 L 790,510" fill="none" stroke="#0027aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
</g>
<!-- ROUTE 2: OUR ROUTE (QPSO Optimal, Teal #006a69, rapid streamlined bypass) -->
<g class="transition-opacity duration-300" id="route-qpso">
<!-- Glow -->
<path d="M 220,120 L 270,160 L 290,240 L 285,340 C 380,335 520,375 700,410 L 775,440 L 790,510" fill="none" filter="url(#glowTeal)" opacity="0.7" stroke="#7cd5d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></path>
<!-- Core Solid -->
<path d="M 220,120 L 270,160 L 290,240 L 285,340 C 380,335 520,375 700,410 L 775,440 L 790,510" fill="none" stroke="#006a69" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.5"></path>
</g>
<!-- CONGESTION INCIDENT BADGE AT SEWRI (Baseline Pain Point) -->
<g class="cursor-pointer" transform="translate(230, 275)">
<circle cx="0" cy="0" fill="#ffdad6" r="14"></circle>
<circle cx="0" cy="0" fill="#ba1a1a" r="10"></circle>
<path d="M 0,-4 L 0,1 M 0,3 L 0,4.5" stroke="#ffffff" stroke-linecap="round" stroke-width="2"></path>
<rect fill="#2e3037" height="24" opacity="0.9" rx="6" width="130" x="18" y="-12"></rect>
<text fill="#ffffff" font-family="Hanken Grotesk" font-size="10" font-weight="600" x="26" y="4">Sewri Bottleneck +5m</text>
</g>
<!-- SWARM OPTIMIZED DIVERGENCE CALLOUT -->
<g transform="translate(295, 230)">
<circle cx="0" cy="0" fill="#006a69" r="6"></circle>
<circle cx="0" cy="0" fill="#98f2f0" opacity="0.5" r="10"></circle>
<path d="M 0,0 L 25,-20 L 85,-20" fill="none" stroke="#006a69" stroke-width="1.5"></path>
<rect fill="#002020" height="24" rx="6" width="125" x="85" y="-32"></rect>
<text fill="#98f2f0" font-family="JetBrains Mono" font-size="9" font-weight="700" x="93" y="-16">QPSO FLUID BYPASS</text>
</g>
<!-- ORIGIN PIN: BKC Terminal (Node A) -->
<g transform="translate(220, 120)">
<circle cx="0" cy="0" fill="#0027aa" opacity="0.2" r="16"></circle>
<circle cx="0" cy="0" fill="#0027aa" r="10"></circle>
<text fill="#ffffff" font-family="Space Grotesk" font-size="11" font-weight="700" text-anchor="middle" x="0" y="4">A</text>
<g transform="translate(18, -10)">
<rect fill="#ffffff" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" height="30" rx="6" width="110"></rect>
<text fill="#191b22" font-family="Space Grotesk" font-size="10" font-weight="700" x="8" y="14">BKC TERMINAL</text>
<text fill="#757686" font-family="JetBrains Mono" font-size="8" x="8" y="24">Origin Hub 19.065°N</text>
</g>
</g>
<!-- DESTINATION PIN: JNPT Marine Gate (Node B) -->
<g transform="translate(790, 510)">
<circle cx="0" cy="0" fill="#006a69" opacity="0.2" r="18"></circle>
<circle cx="0" cy="0" fill="#006a69" r="11"></circle>
<text fill="#ffffff" font-family="Space Grotesk" font-size="11" font-weight="700" text-anchor="middle" x="0" y="4">B</text>
<g transform="translate(-130, -10)">
<rect fill="#ffffff" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" height="30" rx="6" width="122"></rect>
<text fill="#006a69" font-family="Space Grotesk" font-size="10" font-weight="700" x="8" y="14">JNPT MARINE GATE</text>
<text fill="#757686" font-family="JetBrains Mono" font-size="8" x="8" y="24">Destination 72.951°E</text>
</g>
</g>
<!-- Waypoint Markers -->
<circle cx="285" cy="340" fill="#191b22" r="3.5"></circle>
<text fill="#444655" font-family="Hanken Grotesk" font-size="9" font-weight="600" x="295" y="344">Sewri Ramp</text>
<circle cx="700" cy="410" fill="#191b22" r="3.5"></circle>
<text fill="#444655" font-family="Hanken Grotesk" font-size="9" font-weight="600" x="708" y="405">Chirle Interchange</text>
</svg>
<!-- MAP TOOLS OVERLAY (Top-Right) -->
<div class="absolute top-16 right-4 flex flex-col gap-1.5 z-10">
<button class="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
<button class="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">remove</span>
</button>
<button class="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">explore</span>
</button>
<button class="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">layers</span>
</button>
</div>
<!-- FLOATING TELEMETRY LEGEND HUD (Bottom-Left) -->
<div class="absolute bottom-4 left-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-xl shadow-md max-w-sm flex flex-col gap-2">
<div class="flex items-center justify-between text-label-sm font-label-sm uppercase text-outline">
<span>Telemetry HUD</span>
<span class="font-telemetry-data font-bold text-on-surface">GPS SYNC 100%</span>
</div>
<div class="flex items-center gap-2 text-body-sm font-body-sm">
<span class="w-4 h-1 bg-primary rounded-full shrink-0"></span>
<span class="text-on-surface">Baseline (Dijkstra)</span>
<span class="font-telemetry-data text-outline ml-auto">31 min · 31.2 km</span>
</div>
<div class="flex items-center gap-2 text-body-sm font-body-sm">
<span class="w-4 h-1.5 bg-secondary rounded-full shrink-0"></span>
<span class="font-semibold text-secondary">Our Route (QPSO)</span>
<span class="font-telemetry-data font-bold text-secondary ml-auto">27 min · 29.4 km (-4m)</span>
</div>
<div class="pt-1.5 flex items-center gap-2 text-[12px] font-body-sm text-tertiary">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
</span>
<span>1 Critical Congestion Bottleneck Bypassed</span>
</div>
</div>
<!-- BOTTOM-RIGHT SCALE & ATTRIBUTION -->
<div class="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1 pointer-events-none text-right">
<div class="flex items-center gap-1.5 bg-surface-container-lowest/90 px-2 py-0.5 rounded text-label-sm font-telemetry-data text-on-surface shadow-sm">
<span class="w-8 h-1 bg-on-surface inline-block"></span>
<span>5 km</span>
</div>
<span class="text-[10px] text-outline font-label-sm">OpenStreetMap Data · QIDRE Carto-Vector Core v2.4</span>
</div>
</div>
</div>
</div>
<!-- BOTTOM 3 DEEP-DIVE VERIFICATION CARDS -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-lg mt-space-lg w-full">
<!-- CARD 1: Topological Divergence Analysis -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">SPATIAL AUDIT</span>
<span class="material-symbols-outlined text-primary text-[20px]">fork_right</span>
</div>
<h2 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Topological Divergence</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant mb-4">
            Point of deviation identified at junction <span class="font-telemetry-data font-semibold text-primary">JN-24 (Sewri Ramp)</span>. Classical path chose shortest path over dynamic delay cost.
          </p>
<!-- Mini Visual Graph of Divergence -->
<div class="h-20 w-full bg-surface-container-low rounded-lg p-2 relative overflow-hidden flex items-end">
<svg class="w-full h-full" preserveaspectratio="none" viewbox="0 0 200 60">
<!-- Dijkstra branch -->
<path d="M 10,40 Q 60,40 100,20 T 190,10" fill="none" stroke="#0027aa" stroke-dasharray="3,3" stroke-width="2"></path>
<!-- QPSO branch -->
<path d="M 10,40 Q 60,40 100,50 T 190,45" fill="none" stroke="#006a69" stroke-width="3"></path>
<!-- Split point -->
<circle cx="60" cy="40" fill="#ba1a1a" r="4"></circle>
</svg>
<span class="absolute top-2 right-2 text-[10px] font-telemetry-data text-secondary font-bold">Deviation Cost: 0.12 J</span>
</div>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-body-sm font-body-sm">
<span class="text-outline">Divergence Length</span>
<span class="font-telemetry-data font-bold text-on-surface">3.8 km isolated detour</span>
</div>
</div>
<!-- CARD 2: Swarm Convergence Metrics -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">QUANTUM TELEMETRY</span>
<span class="material-symbols-outlined text-secondary text-[20px]">hub</span>
</div>
<h2 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Swarm Convergence</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant mb-4">
            Particle swarm reached Pareto-optimal global minimum at iteration 38. Classical annealing required 140 iterations.
          </p>
<div class="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-lg mb-2">
<div>
<span class="block text-[11px] text-outline font-label-sm">Active Particles</span>
<span class="font-telemetry-data text-headline-sm font-bold text-primary">64 Nodes</span>
</div>
<div>
<span class="block text-[11px] text-outline font-label-sm">Convergence Step</span>
<span class="font-telemetry-data text-headline-sm font-bold text-secondary">38 / 64</span>
</div>
</div>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-body-sm font-body-sm">
<span class="text-outline">Delta Fitness Gain</span>
<span class="font-telemetry-data font-bold text-secondary">+18.4% vs Classical</span>
</div>
</div>
<!-- CARD 3: Emissions & Toll Parity -->
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">GREEN LOGISTICS</span>
<span class="material-symbols-outlined text-secondary text-[20px]">eco</span>
</div>
<h2 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Emissions &amp; Toll Parity</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant mb-4">
            Zero toll tariff differential across MTHL plazas. Substantial fuel conservation due to steady-velocity corridor.
          </p>
<div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg">
<div class="flex items-center justify-between">
<span class="text-body-sm text-on-surface font-medium">CO₂ Reduction:</span>
<span class="font-telemetry-data font-bold text-secondary">-1.8 kg</span>
</div>
<div class="flex items-center justify-between">
<span class="text-body-sm text-on-surface font-medium">MTHL Toll Equivalent:</span>
<span class="font-telemetry-data font-bold text-on-surface">₹250 Parity</span>
</div>
</div>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-body-sm font-body-sm">
<span class="text-outline">Net Operational Margin</span>
<span class="font-telemetry-data font-bold text-secondary">+14.2% Fleet Yield</span>
</div>
</div>
</div>
</div>
</div>
<!-- CLIENT ROUTE TOGGLE MICRO-INTERACTIONS -->
<script>
  function filterRoutes(mode) {
    const routeBaseline = document.getElementById('route-baseline');
    const routeQpso = document.getElementById('route-qpso');

    const btnBaseline = document.getElementById('btn-show-baseline');
    const btnOurs = document.getElementById('btn-show-ours');
    const btnBoth = document.getElementById('btn-show-both');
    const btnDiff = document.getElementById('btn-show-diff');

    const defaultBtnClass = 'px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors';
    const activeBtnClass = 'px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-bold shadow-sm transition-all';

    [btnBaseline, btnOurs, btnBoth, btnDiff].forEach(btn => {
      btn.className = defaultBtnClass;
    });

    if (mode === 'baseline') {
      routeBaseline.style.opacity = '1';
      routeQpso.style.opacity = '0.1';
      btnBaseline.className = activeBtnClass;
    } else if (mode === 'ours') {
      routeBaseline.style.opacity = '0.1';
      routeQpso.style.opacity = '1';
      btnOurs.className = activeBtnClass;
    } else if (mode === 'diff') {
      routeBaseline.style.opacity = '0.5';
      routeQpso.style.opacity = '1';
      btnDiff.className = activeBtnClass;
    } else {
      routeBaseline.style.opacity = '1';
      routeQpso.style.opacity = '1';
      btnBoth.className = activeBtnClass;
    }
  }
</script></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">SIH 2026</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
