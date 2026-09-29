import React, { useEffect, useRef } from 'react';

export default function QidreVehicleDetailDrawerFleetOptimizer({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center gap-space-lg"><a class="group flex items-center gap-2 transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="font-sans font-bold text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="text-outline">/</span><a class="hover:text-on-surface transition-colors" data-path="fleet-optimizer-setup-wizard" href="#">Fleet Optimizer</a><span class="text-outline">/</span><span class="text-primary-container font-medium">Results Dashboard</span></div></div><div class="flex items-center gap-space-md md:gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-sm md:gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-setup-wizard" href="#">Wizard</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-optimization-results-dashboard" href="#">Results</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="route-comparison-results-state" href="#">Comparison</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks" href="#">Benchmarks</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full relative min-h-[calc(100vh-5rem)] overflow-hidden font-body-md text-on-surface">
<!-- BACKGROUND DASHBOARD LAYER (Simulating 2.6 Results View) -->
<div class="w-full px-gutter md:px-margin max-w-7xl mx-auto py-space-md opacity-45 pointer-events-none select-none filter blur-[1px] transition-all">
<!-- Hub Alert Banner -->
<div class="w-full bg-surface-container-low rounded-xl p-space-md mb-space-lg flex flex-wrap items-center justify-between gap-space-sm shadow-sm">
<div class="flex items-center gap-space-sm">
<span class="p-2 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">hub</span>
</span>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-headline-sm text-on-surface">BKC Central Logistics Hub · Gate 04</span>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm uppercase">Active Optimization</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Cluster Zone: Mumbai MMR Core · 12 Fleet Units Initialized</p>
</div>
</div>
<div class="flex items-center gap-space-lg">
<div class="text-right">
<div class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Waypoints</div>
<div class="font-metric-huge text-headline-md text-on-surface">148 Nodes</div>
</div>
<div class="text-right">
<div class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Fleet Convergence</div>
<div class="font-metric-huge text-headline-md text-secondary">99.84%</div>
</div>
</div>
</div>
<!-- Background Metrics Ribbon -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-lg">
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">TOTAL FLEET DISTANCE</span>
<div class="font-metric-huge text-headline-lg text-primary-container">342.6 <span class="text-headline-sm font-label-md">km</span></div>
<span class="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[14px]">trending_down</span> -18.4% vs Classical
        </span>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">ENERGY EXPENDITURE</span>
<div class="font-metric-huge text-headline-lg text-on-surface">178.4 <span class="text-headline-sm font-label-md">kWh</span></div>
<span class="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[14px]">bolt</span> ₹3,410 Cost Offset
        </span>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">MEAN TRANSIT DURATION</span>
<div class="font-metric-huge text-headline-lg text-on-surface">1h 22m <span class="text-headline-sm font-label-md">/ vehicle</span></div>
<span class="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[14px]">schedule</span> 98.2% On-Time SLA
        </span>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant block mb-1">QIDRE OPTIMIZATION TIME</span>
<div class="font-metric-huge text-headline-lg text-primary">4.18 <span class="text-headline-sm font-label-md">sec</span></div>
<span class="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-[14px]">memory</span> QPSO 1,200 Iterations
        </span>
</div>
</div>
<!-- Background Multi-Fleet Map Mockup -->
<div class="w-full h-80 bg-surface-container rounded-xl overflow-hidden relative shadow-inner mb-space-lg flex items-center justify-center">
<div class="absolute inset-0 opacity-40">
<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="40" id="bg-grid" patternunits="userSpaceOnUse" width="40">
<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#757686" stroke-dasharray="2,2" stroke-width="0.5"></path>
</pattern>
</defs>
<rect fill="url(#bg-grid)" height="100%" width="100%"></rect>
<path d="M 120,80 Q 280,120 450,90 T 780,160 T 980,240" fill="none" stroke="#1D3FD1" stroke-dasharray="4,4" stroke-width="3"></path>
<path d="M 180,260 Q 320,190 520,240 T 840,110" fill="none" stroke="#006A69" stroke-width="3"></path>
<path d="M 90,140 Q 340,300 620,180 T 1100,200" fill="none" stroke="#9C231C" stroke-width="2"></path>
</svg>
</div>
<div class="z-10 bg-surface-container-lowest/90 px-4 py-2 rounded-full shadow text-center">
<span class="font-label-md text-label-md text-on-surface font-semibold">MMR Metropolitan Dispatch Canvas</span>
</div>
</div>
</div>
<!-- SEMI-TRANSPARENT BACKDROP OVERLAY -->
<div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-[3px] z-40 transition-opacity duration-300" id="drawer-backdrop"></div>
<!-- SLIDE-IN RIGHT-SIDE DRAWER (VEHICLE DETAIL) -->
<aside aria-label="Vehicle Detail Drawer" class="fixed top-20 right-0 h-[calc(100vh-5rem)] w-full max-w-[480px] bg-surface-container-lowest shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-out overflow-hidden" id="vehicle-drawer">
<!-- DRAWER HEADER (Pinned) -->
<header class="p-space-lg bg-surface-container-lowest shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
<div class="flex items-start justify-between gap-space-sm mb-space-xs">
<div class="flex items-center gap-space-sm">
<!-- Route-Color Swatch with Quantum Halo Ring -->
<div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary-container shadow-[0_0_0_4px_rgba(29,63,209,0.18)]">
<span class="font-label-sm text-label-sm text-on-primary font-bold">01</span>
<span class="animate-ping absolute inset-0 rounded-full bg-primary-container opacity-40"></span>
</div>
<div>
<h2 class="font-headline-lg text-headline-md text-primary-container tracking-wider font-bold uppercase leading-none">
              Tata Ace EV · EV-01
            </h2>
<div class="flex items-center gap-space-xs mt-1">
<span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide">
                Electric LCV
              </span>
<span class="text-outline-variant font-label-sm text-label-sm">·</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">Bandra West / Khar Zone</span>
</div>
</div>
</div>
<!-- Close Action Pill & Escape hint -->
<div class="flex items-center gap-1.5">
<span class="hidden sm:inline-block px-1.5 py-0.5 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm rounded uppercase tracking-tighter">ESC</span>
<button aria-label="Close modal" class="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface" id="close-drawer-btn">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Quick Dispatch Status Row -->
<div class="w-full mt-space-sm pt-space-xs bg-surface-container-low rounded-lg p-space-xs flex items-center justify-between gap-1 text-on-surface-variant">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">person</span>
<span class="font-body-sm text-body-sm font-semibold text-on-surface">Rajesh Sharma</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-secondary">battery_charging_full</span>
<span class="font-telemetry-data text-telemetry-data text-secondary font-bold">94%</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-outline">timelapse</span>
<span class="font-telemetry-data text-telemetry-data text-on-surface">08:30–14:00</span>
</div>
</div>
</header>
<!-- DRAWER SCROLLABLE BODY -->
<div class="flex-1 overflow-y-auto px-space-lg py-space-sm space-y-space-md">
<!-- Isolated Vehicle Route Map View Card -->
<div class="w-full bg-surface-container-low rounded-xl p-space-xs shadow-sm overflow-hidden relative">
<div class="w-full h-48 rounded-lg relative overflow-hidden bg-surface-container-highest">
<!-- Real map vector synthesis of Bandra/Khar with isolated Cobalt Trajectory -->
<svg class="w-full h-full" fill="none" viewbox="0 0 440 192" xmlns="http://www.w3.org/2000/svg">
<!-- Road Base Texture -->
<rect fill="#F3F3FC" height="100%" width="100%"></rect>
<path d="M-10,50 L460,70" stroke="#E2E2EA" stroke-width="8"></path>
<path d="M-10,140 L460,110" stroke="#E2E2EA" stroke-width="6"></path>
<path d="M80,-10 L110,210" stroke="#E2E2EA" stroke-width="9"></path>
<path d="M220,-10 L240,210" stroke="#E2E2EA" stroke-width="7"></path>
<path d="M340,-10 L370,210" stroke="#E2E2EA" stroke-width="12"></path>
<!-- Waterbody curve for Carter Rd coastal edge -->
<path d="M 0,20 C 60,60 50,140 10,192 L 0,192 Z" fill="#E6F7F5" opacity="0.8"></path>
<text fill="#006A69" font-family="'JetBrains Mono', monospace" font-size="9" transform="rotate(-70 12,100)" x="12" y="100">ARABIAN SEA</text>
<!-- Active Traffic / Flow Overlays (Green = Clear, Coral = Moderate) -->
<path d="M 95,30 L 105,95" stroke="#006A69" stroke-linecap="round" stroke-width="3"></path>
<path d="M 230,60 L 235,115" stroke="#BA1A1A" stroke-dasharray="2,3" stroke-width="3"></path>
<!-- Route 01 Trajectory: BKC Dep -> Pali -> Turner -> Linking -> Carter -> Khar Danda -->
<path d="M 390,145 L 340,110 L 270,118 L 235,82 L 180,90 L 140,55 L 75,70 L 105,130 L 170,140 L 250,150 L 390,145" fill="none" id="quantum-route-path" stroke="#1D3FD1" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
<!-- Flowing Particle along Trajectory -->
<circle cx="235" cy="82" fill="#1D3FD1" r="5">
<animate attributename="opacity" dur="2s" repeatcount="indefinite" values="1;0.4;1"></animate>
</circle>
<!-- Origin Square Pin (BKC Hub) -->
<rect fill="#00105A" height="16" rx="3" width="16" x="382" y="137"></rect>
<path d="M 386,145 L 394,145 M 390,141 L 390,149" stroke="#FFFFFF" stroke-width="1.5"></path>
<!-- Stop Waypoint Pins -->
<!-- Stop 1 -->
<circle cx="340" cy="110" fill="#1D3FD1" r="7"></circle>
<text fill="#FFFFFF" font-family="'JetBrains Mono'" font-size="8" font-weight="bold" text-anchor="middle" x="340" y="113">1</text>
<!-- Stop 2 -->
<circle cx="270" cy="118" fill="#1D3FD1" r="7"></circle>
<text fill="#FFFFFF" font-family="'JetBrains Mono'" font-size="8" font-weight="bold" text-anchor="middle" x="270" y="121">2</text>
<!-- Stop 3 -->
<circle cx="235" cy="82" fill="#1D3FD1" r="7"></circle>
<text fill="#FFFFFF" font-family="'JetBrains Mono'" font-size="8" font-weight="bold" text-anchor="middle" x="235" y="85">3</text>
<!-- Stop 4 -->
<circle cx="75" cy="70" fill="#1D3FD1" r="7"></circle>
<text fill="#FFFFFF" font-family="'JetBrains Mono'" font-size="8" font-weight="bold" text-anchor="middle" x="75" y="73">4</text>
<!-- Stop 5 -->
<circle cx="105" cy="130" fill="#1D3FD1" r="7"></circle>
<text fill="#FFFFFF" font-family="'JetBrains Mono'" font-size="8" font-weight="bold" text-anchor="middle" x="105" y="133">5</text>
</svg>
<!-- Floating Badges over Map -->
<div class="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm">
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold uppercase">Isolated Route View</span>
</div>
<div class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-telemetry-data text-telemetry-data">
            14 Waypoints · 28.4 km
          </div>
<div class="absolute bottom-2 right-2 flex items-center gap-1">
<button class="w-6 h-6 rounded bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest flex items-center justify-center shadow" title="Center Route">
<span class="material-symbols-outlined text-[14px]">my_location</span>
</button>
<button class="w-6 h-6 rounded bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest flex items-center justify-center shadow" title="Expand Fullscreen">
<span class="material-symbols-outlined text-[14px]">fullscreen</span>
</button>
</div>
</div>
</div>
<!-- Route Performance Mini-Grid -->
<div class="grid grid-cols-3 gap-space-xs">
<div class="bg-surface-container-low p-2 rounded-lg text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-tight">Est. Duration</span>
<span class="font-metric-huge text-headline-sm text-on-surface font-bold">1h 14m</span>
</div>
<div class="bg-surface-container-low p-2 rounded-lg text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-tight">Avg Stop Time</span>
<span class="font-metric-huge text-headline-sm text-on-surface font-bold">4.2 min</span>
</div>
<div class="bg-secondary-container/40 p-2 rounded-lg text-center">
<span class="font-label-sm text-label-sm text-on-secondary-container block uppercase tracking-tight">QPSO Saved</span>
<span class="font-metric-huge text-headline-sm text-secondary font-bold">14.8 kWh</span>
</div>
</div>
<!-- ORDERED STOPS SEQUENCE (Vertical Timeline) -->
<div class="pt-space-xs">
<div class="flex items-center justify-between mb-space-sm">
<h3 class="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-primary">route</span>
            Optimized Stop Timeline (14 Stops)
          </h3>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm">
            Live GPS &amp; SLA Sync
          </span>
</div>
<!-- Timeline Container with Continuous Background Line -->
<div class="relative pl-6 space-y-4">
<!-- Continuous Hairline Spine -->
<div class="absolute left-2.5 top-3 bottom-3 w-0.5 bg-primary-container/20"></div>
<!-- NODE 0: Hub Origin -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded bg-primary text-on-primary flex items-center justify-center shadow-sm z-10">
<span class="material-symbols-outlined text-[13px]">warehouse</span>
</div>
<div class="flex-1 bg-surface-container-low/70 p-space-xs rounded-lg">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-headline-sm text-on-surface">BKC Central Depot · Gate 4</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">DEPARTED</span>
</div>
<div class="flex items-center gap-2 mt-0.5 font-telemetry-data text-telemetry-data text-outline">
<span>08:30 AM</span>
<span>·</span>
<span>Payload Initial: 480 kg loaded</span>
</div>
</div>
</div>
<!-- STOP 1 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              1
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">Pali Hill, Nargis Dutt Rd</span>
<span class="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold tracking-tight">EXPRESS SLA</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Mrs. Ananya Mehta · Bungalow 12-B</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-secondary font-bold">ETA: 08:44 AM (SLA 09:00)</span>
<span>Drop: 35 kg · #QK-4012</span>
</div>
</div>
</div>
<!-- STOP 2 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              2
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">Turner Road Junction, Bandra W</span>
<span class="font-telemetry-data text-telemetry-data text-outline">Win: 08:45–09:15</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Kroma Electronics Retail Hub</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-secondary font-bold">ETA: 08:52 AM</span>
<span>Drop: 45 kg · #QK-4018</span>
</div>
</div>
</div>
<!-- STOP 3 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              3
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">Linking Road Commercial Strip</span>
<span class="font-telemetry-data text-telemetry-data text-outline">Win: 09:00–09:30</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Metro Fashion Arcade · Dock B</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-primary-container font-bold">ETA: 09:04 AM</span>
<span>Drop: 60 kg · #QK-4022</span>
</div>
</div>
</div>
<!-- STOP 4 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              4
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">Carter Road Promenade Hub</span>
<span class="font-telemetry-data text-telemetry-data text-outline">Win: 09:00–09:45</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Blue Tokai Cafe Supplies</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-primary-container font-bold">ETA: 09:18 AM</span>
<span>Drop: 25 kg · #QK-4029</span>
</div>
</div>
</div>
<!-- STOP 5 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              5
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">Khar Danda Freight Point</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">HIGH VOL</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Coastal Marine Logistics Store</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-primary-container font-bold">ETA: 09:31 AM</span>
<span>Drop: 80 kg · #QK-4033</span>
</div>
</div>
</div>
<!-- STOP 6 -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-telemetry-data text-[10px] font-bold shadow-sm z-10">
              6
            </div>
<div class="flex-1 bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold text-on-surface">14th Road Khar West</span>
<span class="font-telemetry-data text-telemetry-data text-outline">Win: 09:30–10:00</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Sunrise Wellness Clinic</p>
<div class="flex items-center justify-between mt-1 text-on-surface-variant font-telemetry-data text-telemetry-data">
<span class="text-primary-container font-bold">ETA: 09:44 AM</span>
<span>Drop: 40 kg · #QK-4038</span>
</div>
</div>
</div>
<!-- COLLAPSIBLE REMAINING STOPS (Stops 7 to 14) -->
<div class="relative flex items-center gap-3">
<div class="absolute -left-6 w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-bold z-10">
              ...
            </div>
<details class="w-full group">
<summary class="list-none cursor-pointer w-full bg-surface-container-low p-2 rounded-lg text-center font-label-md text-label-md text-primary-container hover:bg-surface-container transition-colors flex items-center justify-center gap-1 select-none">
<span>View Remaining 8 Stops (Stops 07–14)</span>
<span class="material-symbols-outlined text-[16px] transition-transform group-open:rotate-180">expand_more</span>
</summary>
<div class="pt-2 space-y-2">
<div class="p-2 bg-surface-container-lowest rounded text-body-sm text-on-surface-variant flex justify-between">
<span>Stop 07 · Madhu Park, Khar</span>
<span class="font-telemetry-data text-telemetry-data">09:55 AM · 30 kg</span>
</div>
<div class="p-2 bg-surface-container-lowest rounded text-body-sm text-on-surface-variant flex justify-between">
<span>Stop 08 · S.V. Road Junction</span>
<span class="font-telemetry-data text-telemetry-data">10:08 AM · 45 kg</span>
</div>
<div class="p-2 bg-surface-container-lowest rounded text-body-sm text-on-surface-variant flex justify-between">
<span>Stop 09–13 · Bandra Reclamation Core</span>
<span class="font-telemetry-data text-telemetry-data">10:20–11:05 AM · 110 kg</span>
</div>
<div class="p-2 bg-surface-container-lowest rounded text-body-sm text-on-surface-variant flex justify-between">
<span>Stop 14 · Bandra Terminus Cargo</span>
<span class="font-telemetry-data text-telemetry-data">11:18 AM · 50 kg</span>
</div>
</div>
</details>
</div>
<!-- FINAL RETURN TO HUB -->
<div class="relative flex items-start gap-3">
<div class="absolute -left-6 mt-0.5 w-5 h-5 rounded bg-on-surface text-surface flex items-center justify-center shadow-sm z-10">
<span class="material-symbols-outlined text-[13px]">check_circle</span>
</div>
<div class="flex-1 bg-surface-container-low p-space-xs rounded-lg">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-headline-sm text-on-surface">Return BKC Central Depot</span>
<span class="font-telemetry-data text-telemetry-data text-secondary font-bold">11:44 AM (Final Return)</span>
</div>
<p class="font-body-sm text-body-sm text-outline">Empty Container Inbound · Next Scheduled Shift 14:30</p>
</div>
</div>
</div>
</div>
</div>
<!-- DRAWER STICKY FOOTER (Telemetry Stats & Action Controls) -->
<footer class="p-space-lg bg-surface-container-lowest shadow-[0_-4px_16px_rgba(0,0,0,0.05)] shrink-0 space-y-space-sm">
<!-- Volumetric Capacity Bar -->
<div class="space-y-1">
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant uppercase tracking-wider font-semibold">Load vs. Capacity</span>
<span class="font-telemetry-data text-telemetry-data text-secondary font-bold">480 kg / 500 kg (96.0% Volumetric Load)</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div class="h-full bg-secondary rounded-full transition-all duration-500" style="width: 96%;"></div>
</div>
</div>
<!-- Quick Metrics Summary Bar -->
<div class="grid grid-cols-3 gap-2 py-1 text-center font-telemetry-data text-telemetry-data">
<div class="bg-surface-container-low py-1.5 px-1 rounded">
<span class="text-[10px] text-outline block uppercase">Total Distance</span>
<span class="text-on-surface font-bold">28.4 km</span>
</div>
<div class="bg-surface-container-low py-1.5 px-1 rounded">
<span class="text-[10px] text-outline block uppercase">Total Transit</span>
<span class="text-on-surface font-bold">1h 14m</span>
</div>
<div class="bg-surface-container-low py-1.5 px-1 rounded">
<span class="text-[10px] text-outline block uppercase">CO₂ Offset</span>
<span class="text-secondary font-bold">4.6 kg vs Diesel</span>
</div>
</div>
<!-- Action Button Cluster -->
<div class="space-y-2 pt-1">
<!-- Secondary Actions Row -->
<div class="grid grid-cols-2 gap-2">
<button class="w-full py-2 px-2 rounded-xl bg-surface-container-lowest text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[16px]">send_to_mobile</span>
<span>Send Manifest</span>
</button>
<button class="w-full py-2 px-2 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-1">
<span class="material-symbols-outlined text-[16px]">print</span>
<span>Print Waybills</span>
</button>
</div>
<!-- Primary Dispatch Trigger Action -->
<button class="w-full py-3 px-4 rounded-xl bg-tertiary-container hover:bg-tertiary text-on-tertiary font-headline-lg text-headline-sm uppercase tracking-wider font-bold transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-tertiary-container/20">
<span>Confirm &amp; Lock Route</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</button>
</div>
</footer>
</aside>
<!-- Inline Interaction Behavior -->
<script>
    (function initVehicleDrawer() {
      const drawer = document.getElementById('vehicle-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      const closeBtn = document.getElementById('close-drawer-btn');

      function hideDrawer() {
        if (!drawer || !backdrop) return;
        drawer.style.transform = 'translateX(100%)';
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
      }

      function showDrawer() {
        if (!drawer || !backdrop) return;
        drawer.style.transform = 'translateX(0%)';
        backdrop.style.opacity = '1';
        backdrop.style.pointerEvents = 'auto';
      }

      if (closeBtn) closeBtn.addEventListener('click', hideDrawer);
      if (backdrop) backdrop.addEventListener('click', hideDrawer);

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hideDrawer();
        }
      });
    })();
  </script>
</div></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">QIDRE</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
