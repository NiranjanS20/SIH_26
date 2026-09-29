import React, { useEffect, useRef } from 'react';

export default function QidreRouteComparisonInputState({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><a class="group flex items-center gap-2 transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="font-sans font-bold text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="flex items-center gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks" href="#">Benchmarks →</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<div class="w-full max-w-7xl mx-auto px-gutter md:px-margin py-space-md">
<!-- Top System Telemetry Bar -->
<div class="w-full flex flex-wrap items-center justify-between gap-space-sm mb-space-md pb-space-xs border-b border-surface-variant">
<div class="flex items-center gap-space-sm">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Workspace</span>
<span class="text-outline-variant font-label-sm">/</span>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Pairwise Verification Matrix</span>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-variant font-label-sm text-[10px] uppercase font-bold tracking-widest">v2.4 Active</span>
</div>
<div class="flex items-center gap-space-md">
<div class="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Core: Swarm Entanglement Engine (64P)</span>
</div>
<div class="hidden md:flex items-center gap-1 font-label-sm text-label-sm text-outline">
<span class="material-symbols-outlined text-[15px]">schedule</span>
<span>Latency: 4.2ms</span>
</div>
</div>
</div>
<!-- Main 35% / 65% Workspace Split -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT PANEL (~35% width -> 4 cols out of 12 on large desktops, 5 on medium lg) -->
<section class="lg:col-span-5 xl:col-span-4 bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_-2px_rgba(16,32,79,0.06),0_1px_3px_0_rgba(16,32,79,0.04)] border border-surface-variant p-6 xl:p-8 flex flex-col justify-between">
<div>
<!-- Header breadcrumb/module ID -->
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-widest font-semibold">Module 01 · Pairwise Comparison</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-primary font-label-sm text-[11px] font-semibold tracking-wider">INPUT STATE</span>
</div>
<!-- Section Headings -->
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mb-1">
            Plan Your Route
          </h1>
<p class="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
            Benchmark quantum-inspired QPSO against classical shortest-path Dijkstra baseline in real-time.
          </p>
<!-- Input Block with Architectural Connector -->
<div class="relative space-y-4 mb-5">
<!-- Connecting dashed line between From and To -->
<div class="absolute left-5 top-11 bottom-11 w-0.5 border-l-2 border-dashed border-outline-variant -z-0"></div>
<!-- Origin Input (BKC) -->
<div class="relative z-10">
<label class="block font-body-sm text-body-sm font-semibold uppercase tracking-wider text-on-surface mb-1.5 flex items-center justify-between">
<span>Origin (Start Point)</span>
<span class="text-[11px] font-label-sm font-normal text-secondary uppercase tracking-normal">Verified Node A</span>
</label>
<div class="relative flex items-center">
<div class="absolute left-3.5 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
<span class="material-symbols-outlined text-[17px]">trip_origin</span>
</div>
<input class="w-full h-11 pl-12 pr-10 bg-surface-container-lowest border border-surface-variant rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" placeholder="Enter starting point (e.g. Bandra Kurla Complex)" type="text" value="Bandra Kurla Complex (BKC), Mumbai"/>
<button class="absolute right-3 text-outline hover:text-on-surface transition-colors" title="Locate current position" type="button">
<span class="material-symbols-outlined text-[18px]">my_location</span>
</button>
</div>
<div class="mt-1 flex items-center gap-2">
<span class="inline-flex items-center gap-1 font-label-sm text-[11px] text-outline font-medium">
<span class="material-symbols-outlined text-[12px] text-primary">place</span> 19.0657° N, 72.8686° E · Hub Alpha
                </span>
</div>
</div>
<!-- Destination Input (JNPT) -->
<div class="relative z-10 pt-1">
<label class="block font-body-sm text-body-sm font-semibold uppercase tracking-wider text-on-surface mb-1.5 flex items-center justify-between">
<span>Destination (End Point)</span>
<span class="text-[11px] font-label-sm font-normal text-secondary uppercase tracking-normal">Target Node B</span>
</label>
<div class="relative flex items-center">
<div class="absolute left-3.5 flex items-center justify-center w-6 h-6 rounded-full bg-secondary/15 text-secondary">
<span class="material-symbols-outlined text-[17px]">flag</span>
</div>
<input class="w-full h-11 pl-12 pr-10 bg-surface-container-lowest border border-surface-variant rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all" placeholder="Enter destination terminal (e.g. JNPT)" type="text" value="JNPT Freight Terminal, Navi Mumbai"/>
<button class="absolute right-3 text-outline hover:text-on-surface transition-colors" title="Recent destinations" type="button">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
<div class="mt-1 flex items-center gap-2">
<span class="inline-flex items-center gap-1 font-label-sm text-[11px] text-outline font-medium">
<span class="material-symbols-outlined text-[12px] text-secondary">anchor</span> 18.9499° N, 72.9515° E · Maritime Gate 4
                </span>
</div>
</div>
</div>
<!-- Add Stop Ghost Button -->
<div class="mb-5">
<button class="w-full py-2.5 px-4 rounded-xl border border-dashed border-primary/30 hover:border-secondary text-primary hover:text-secondary bg-surface hover:bg-surface-container-low font-body-md text-body-sm font-medium transition-all flex items-center justify-center gap-2 group" type="button">
<span class="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">add_circle</span>
<span>Add waypoint stop (up to 4 optional nodes)</span>
</button>
</div>
<!-- Direct Map Interaction Switch -->
<div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-surface-variant mb-6">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-secondary text-[20px]">ads_click</span>
<div>
<p class="font-body-sm text-body-sm font-semibold text-on-surface leading-none">Map Waypoint Mode</p>
<p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Click directly on map canvas to append points</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
</label>
</div>
<!-- Algorithm Benchmark Configuration Pill Box -->
<div class="rounded-xl bg-surface p-3.5 border border-surface-variant mb-6">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-[11px] font-bold text-outline uppercase tracking-wider">Engine Configuration</span>
<span class="flex items-center gap-1 font-label-sm text-[11px] text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Ready to Solute
              </span>
</div>
<div class="space-y-2">
<div class="flex items-center justify-between text-body-sm font-body-sm py-1 border-b border-surface-variant/60">
<span class="text-on-surface-variant flex items-center gap-1.5">
<span class="w-2 h-2 rounded-sm bg-primary"></span> Baseline Classical:
                </span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Dijkstra Shortest Path</span>
</div>
<div class="flex items-center justify-between text-body-sm font-body-sm py-1">
<span class="text-on-surface-variant flex items-center gap-1.5">
<span class="w-2 h-2 rounded-sm bg-secondary"></span> Quantum Engine:
                </span>
<span class="font-label-sm text-label-sm font-semibold text-secondary">QPSO Hybrid v2.4 (64 Swarms)</span>
</div>
</div>
</div>
</div>
<!-- Primary Action Trigger -->
<div class="pt-2">
<button class="w-full py-4 px-6 rounded-2xl bg-tertiary-container hover:bg-tertiary text-on-tertiary font-headline-md text-headline-md tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(156,35,28,0.35)] active:translate-y-0 flex items-center justify-center gap-3 group" type="button">
<span>Compare Routes</span>
<span class="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
</button>
<div class="mt-2.5 text-center">
<span class="font-label-sm text-[11px] text-outline">Expected execution window: ~240ms across 48 graph permutations</span>
</div>
</div>
</section>
<!-- RIGHT PANEL (~65% width -> 7 cols on lg, 8 cols on xl) -->
<section class="lg:col-span-7 xl:col-span-8 relative h-[680px] xl:h-[720px] rounded-2xl border border-surface-variant overflow-hidden shadow-[0_4px_24px_-2px_rgba(16,32,79,0.04)] bg-surface flex flex-col justify-between">
<!-- Cartographic Visual Canvas (Interactive Mock Vector Grid + Waterways) -->
<div class="absolute inset-0 w-full h-full bg-[#f6f5ee] overflow-hidden select-none">
<!-- Stylized Geo Vector Waterways (Mumbai Harbor & Thane Creek Silhouette) -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" preserveaspectratio="none" viewbox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
<defs>
<lineargradient id="waterGrad" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#d8f3f1" stop-opacity="0.9"></stop>
<stop offset="100%" stop-color="#c1ebe8" stop-opacity="0.8"></stop>
</lineargradient>
<pattern height="40" id="gridPattern" patternunits="userSpaceOnUse" width="40">
<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e3e1d8" stroke-dasharray="2,4" stroke-width="0.75"></path>
</pattern>
</defs>
<!-- Coordinate Grid -->
<rect fill="url(#gridPattern)" height="100%" width="100%"></rect>
<!-- Arabian Sea & Thane Creek Geometry -->
<path d="M 0,220 C 120,240 180,310 240,360 C 310,420 340,490 320,600 L 0,600 Z" fill="url(#waterGrad)"></path>
<path d="M 380,0 C 390,90 410,180 470,250 C 530,320 590,380 620,600 L 800,600 L 800,0 Z" fill="url(#waterGrad)" opacity="0.65"></path>
<path d="M 330,220 C 350,280 390,340 430,370 C 470,400 480,480 460,540 C 450,570 410,600 410,600" fill="none" opacity="0.4" stroke="#7cd5d3" stroke-linecap="round" stroke-width="38"></path>
<!-- Arterial Road Infrastructure Traces -->
<!-- Western Express & Eastern Freeway -->
<path d="M 190,0 Q 230,120 220,180 T 210,320" fill="none" stroke="#dedcd2" stroke-width="5"></path>
<path d="M 220,180 Q 290,190 340,240 T 450,340" fill="none" stroke="#e0ded6" stroke-dasharray="8,4" stroke-width="4"></path>
<path d="M 280,60 L 330,180 L 390,260 L 410,430 L 460,510" fill="none" stroke="#d5d3c8" stroke-width="3"></path>
<!-- Mumbai Trans Harbour Link (MTHL / Atal Setu) Corridor trace -->
<path d="M 250,330 C 320,340 410,360 480,390" fill="none" opacity="0.8" stroke="#bac3ff" stroke-dasharray="4,6" stroke-width="2.5"></path>
<!-- Pending Route Computation Curve (Arc between BKC and JNPT) -->
<path class="opacity-70 animate-[pulse_3s_ease-in-out_infinite]" d="M 245,185 C 330,190 410,240 495,395" fill="none" id="pendingTrajectory" stroke="#006a69" stroke-dasharray="6,8" stroke-width="2"></path>
<!-- Potential Classical Route Line (Dijkstra baseline contour faint preview) -->
<path d="M 245,185 C 290,140 380,120 440,160 C 480,200 490,310 495,395" fill="none" opacity="0.35" stroke="#1d3fd1" stroke-dasharray="3,5" stroke-width="1.5"></path>
</svg>
<!-- Marker A: Origin BKC (Bandra Kurla Complex) -->
<div class="absolute left-[245px] top-[185px] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
<!-- Pulsing Rings -->
<span class="absolute -inset-3 rounded-full bg-primary/20 animate-ping"></span>
<span class="absolute -inset-1.5 rounded-full bg-primary/30"></span>
<!-- Pin Center -->
<div class="relative w-8 h-8 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center font-label-sm font-bold text-xs ring-4 ring-white">
              A
            </div>
<!-- Floating Label & Coordinates Tag -->
<div class="absolute left-10 -top-4 w-60 bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant rounded-xl p-2.5 shadow-md pointer-events-none transition-transform group-hover:scale-105">
<div class="flex items-center justify-between mb-0.5">
<span class="font-headline-sm text-xs font-bold text-primary">Node A · BKC Hub</span>
<span class="px-1.5 py-0.2 rounded bg-primary/10 text-primary font-label-sm text-[9px] uppercase font-bold">Start</span>
</div>
<p class="font-body-sm text-[11px] text-on-surface-variant truncate">Bandra Kurla Complex, Mumbai</p>
<p class="font-label-sm text-[10px] text-outline mt-1 font-semibold">19.0657° N, 72.8686° E</p>
</div>
</div>
<!-- Marker B: Destination JNPT (Jawaharlal Nehru Port Trust) -->
<div class="absolute left-[495px] top-[395px] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
<!-- Beacon Rings -->
<span class="absolute -inset-4 rounded-full bg-secondary/20 animate-pulse"></span>
<span class="absolute -inset-2 rounded-full bg-secondary/30"></span>
<!-- Pin Center -->
<div class="relative w-8 h-8 rounded-full bg-secondary text-on-secondary shadow-lg flex items-center justify-center font-label-sm font-bold text-xs ring-4 ring-white">
              B
            </div>
<!-- Floating Label & Coordinates Tag -->
<div class="absolute right-10 -top-4 w-64 bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant rounded-xl p-2.5 shadow-md pointer-events-none transition-transform group-hover:scale-105">
<div class="flex items-center justify-between mb-0.5">
<span class="font-headline-sm text-xs font-bold text-secondary">Node B · JNPT Marine Gate</span>
<span class="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[9px] uppercase font-bold">Target</span>
</div>
<p class="font-body-sm text-[11px] text-on-surface-variant truncate">JNPT Freight Container Logistics, Nhava Sheva</p>
<p class="font-label-sm text-[10px] text-outline mt-1 font-semibold">18.9499° N, 72.9515° E</p>
</div>
</div>
<!-- Mid-vector Annotation for Trajectory -->
<div class="absolute left-[380px] top-[260px] -translate-x-1/2 -translate-y-1/2 z-10">
<div class="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm border border-surface-variant shadow-sm flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
<span class="font-label-sm text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Pending Computation</span>
<span class="font-label-sm text-[10px] text-outline">~26.4 km</span>
</div>
</div>
<!-- Dynamic Congestion Incident Mock Pin -->
<div class="absolute left-[310px] top-[140px] -translate-x-1/2 -translate-y-1/2 z-15 group cursor-pointer">
<div class="w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary shadow flex items-center justify-center ring-2 ring-white">
<span class="material-symbols-outlined text-[13px]">warning</span>
</div>
<div class="hidden group-hover:block absolute left-6 -top-2 w-44 bg-surface-container-lowest border border-surface-variant rounded-lg p-2 shadow-lg z-30">
<span class="font-label-sm text-[10px] font-bold text-error uppercase block">Sion Choke Point</span>
<span class="font-body-sm text-[11px] text-on-surface-variant block">Heavy Freight Slowdown (+18m)</span>
</div>
</div>
</div>
<!-- Top Floating Controls Layer -->
<div class="relative z-30 p-space-md flex items-start justify-between pointer-events-none">
<!-- Top Left Status Badge -->
<div class="pointer-events-auto">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant shadow-sm">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="font-label-sm text-[11px] font-bold tracking-wider text-on-surface uppercase">
                Map Interaction: Ready · Click to Set Waypoints
              </span>
</div>
</div>
<!-- Top Right Map Tool Palette -->
<div class="pointer-events-auto flex flex-col gap-2">
<!-- Zoom & Pan Controls -->
<div class="flex flex-col bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant rounded-xl shadow-sm overflow-hidden">
<button class="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Zoom In" type="button">
<span class="material-symbols-outlined text-[19px]">add</span>
</button>
<div class="w-full h-px bg-surface-variant"></div>
<button class="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Zoom Out" type="button">
<span class="material-symbols-outlined text-[19px]">remove</span>
</button>
</div>
<!-- Recenter -->
<button class="w-9 h-9 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Recenter View" type="button">
<span class="material-symbols-outlined text-[18px]">center_focus_strong</span>
</button>
<!-- Layer Toggles -->
<div class="flex flex-col bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant rounded-xl shadow-sm overflow-hidden">
<button class="w-9 h-9 flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors" title="Traffic Layer (Active)" type="button">
<span class="material-symbols-outlined text-[18px]">traffic</span>
</button>
<div class="w-full h-px bg-surface-variant"></div>
<button class="w-9 h-9 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Switch to Satellite" type="button">
<span class="material-symbols-outlined text-[18px]">layers</span>
</button>
</div>
</div>
</div>
<!-- Bottom Floating Layer: Route Legend & Scale Attribution -->
<div class="relative z-30 p-space-md flex flex-col sm:flex-row items-end sm:items-end justify-between gap-space-sm pointer-events-none">
<!-- Route Comparison Status Legend Card -->
<div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md border border-surface-variant rounded-2xl p-4 shadow-sm max-w-xs w-full">
<div class="flex items-center justify-between mb-2.5 pb-1.5 border-b border-surface-variant">
<span class="font-body-sm text-xs font-bold text-on-surface uppercase tracking-wider">Route Comparison Legend</span>
<span class="font-label-sm text-[10px] text-outline uppercase font-semibold">2 Algorithmic Paths</span>
</div>
<div class="space-y-2.5">
<!-- Item 1: Dijkstra Classical Baseline -->
<div class="flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-4 h-1 rounded bg-primary"></span>
<span class="font-body-sm text-xs font-medium text-on-surface">Baseline (Dijkstra)</span>
</div>
<span class="font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline">Awaiting solve</span>
</div>
<!-- Item 2: QPSO Quantum Swarm Solution -->
<div class="flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-4 h-1 rounded bg-secondary shadow-[0_0_6px_rgba(20,184,166,0.6)]"></span>
<span class="font-body-sm text-xs font-semibold text-secondary">Our Route (QPSO)</span>
</div>
<span class="font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline">Awaiting solve</span>
</div>
<!-- Item 3: Congestion Node -->
<div class="flex items-center justify-between text-body-sm pt-0.5">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
<span class="font-body-sm text-xs text-on-surface-variant">Live Congestion Node</span>
</div>
<span class="font-label-sm text-[10px] text-tertiary font-semibold">1 Detected</span>
</div>
</div>
</div>
<!-- Bottom Right Scale & Attribution -->
<div class="pointer-events-auto flex flex-col items-end gap-1 text-right">
<div class="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant">
<div class="w-16 h-1 bg-on-surface/40 flex items-center justify-between">
<div class="w-0.5 h-2 bg-on-surface"></div>
<div class="w-0.5 h-2 bg-on-surface"></div>
</div>
<span class="font-label-sm text-[10px] text-on-surface font-semibold">5 km</span>
</div>
<div class="font-label-sm text-[10px] text-outline tracking-wider">
              OpenStreetMap Data · QIDRE Carto-Vector Core v2
            </div>
</div>
</div>
</section>
</div>
<!-- Supplementary Informational Sub-strip (Human warmth meets quantum precision) -->
<div class="mt-space-lg grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div class="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant flex items-start gap-3">
<div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[18px]">hub</span>
</div>
<div>
<h4 class="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">Topological Graph Mapping</h4>
<p class="font-body-sm text-xs text-on-surface-variant mt-0.5">Origin and destination are snapped to high-throughput freight corridors with historical transit velocities.</p>
</div>
</div>
<div class="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant flex items-start gap-3">
<div class="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div>
<h4 class="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">Swarm Particle Dispersion</h4>
<p class="font-body-sm text-xs text-on-surface-variant mt-0.5">Quantum delta potential wells avoid local minima entrapment during severe corridor bottlenecks.</p>
</div>
</div>
<div class="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant flex items-start gap-3">
<div class="w-8 h-8 rounded-lg bg-tertiary-container/15 text-tertiary-container flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[18px]">speed</span>
</div>
<div>
<h4 class="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">Immediate Divergence Log</h4>
<p class="font-body-sm text-xs text-on-surface-variant mt-0.5">Upon trigger, see time, emissions, fuel consumption, and toll gate parity matrices update instantaneously.</p>
</div>
</div>
</div>
</div>
</div></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">QIDRE</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
