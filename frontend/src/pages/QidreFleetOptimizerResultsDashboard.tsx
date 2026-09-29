import React, { useEffect, useRef } from 'react';

export default function QidreFleetOptimizerResultsDashboard({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center gap-space-lg"><a class="group flex items-center gap-2 transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="font-sans font-bold text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span class="text-outline">/</span><a class="hover:text-on-surface transition-colors" data-path="fleet-optimizer-setup-wizard" href="#">Fleet Optimizer</a><span class="text-outline">/</span><span class="text-primary-container font-medium">Results Dashboard</span></div></div><div class="flex items-center gap-space-md md:gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-sm md:gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-setup-wizard" href="#">Wizard</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="fleet-optimizer-optimization-results-dashboard" href="#">Results</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="route-comparison-results-state" href="#">Comparison</a><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks" href="#">Benchmarks</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<!-- Top Context Sub-Bar (Dense Aerospace Telemetry Bar) -->
<section class="w-full bg-surface-container-lowest shadow-sm mb-space-md">
<div class="max-w-7xl mx-auto px-gutter md:px-margin py-3 flex flex-wrap items-center justify-between gap-y-2">
<div class="flex items-center gap-space-sm flex-wrap">
<div class="flex items-center gap-1.5 font-label-sm text-label-sm text-outline uppercase tracking-wider">
<span>WORKSPACE</span>
<span>/</span>
<span>FLEET OPTIMIZER</span>
<span>/</span>
<span class="text-on-surface font-semibold">RUN-8842</span>
<span>/</span>
<span class="text-secondary font-semibold">RESULTS CONVERGED</span>
</div>
<span class="hidden sm:inline text-outline-variant">•</span>
<div class="flex items-center gap-1.5 text-on-surface font-headline-sm text-label-md">
<span class="material-symbols-outlined text-[18px] text-primary-container">hub</span>
<span class="font-medium">BKC Central Hub</span>
<span class="text-outline">→</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">48 Deliveries Assigned (4 Vehicles)</span>
</div>
</div>
<div class="flex items-center gap-3">
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/40">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="font-label-sm text-label-sm text-on-secondary-fixed-variant uppercase tracking-wider font-semibold">
            OPTIMIZATION COMPLETE · 0 VIOLATIONS
          </span>
</div>
<div class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low font-telemetry-data text-label-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[15px] text-outline">timer</span>
<span>Solve Time: <strong class="text-on-surface">4.8s</strong> (Iter 100/100)</span>
</div>
</div>
</div>
</section>
<!-- Main 2-Column Operational Workspace -->
<div class="w-full max-w-7xl mx-auto px-gutter md:px-margin pb-space-xl">
<div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
<!-- ================= LEFT WORKSPACE: MAP & FLEET ROSTER (~62% -> 7 cols on XL) ================= -->
<div class="xl:col-span-7 flex flex-col gap-space-md min-w-0">
<!-- Cartography Canvas Card -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-3 relative flex flex-col overflow-hidden">
<!-- Floating Map Control: Route Visibility Filter Tabs -->
<div class="flex items-center justify-between pb-2.5 z-10 flex-wrap gap-2">
<div class="flex items-center gap-1 p-1 bg-surface-container-low rounded-lg">
<button class="route-filter-btn px-2.5 py-1 text-label-sm font-label-sm rounded bg-surface-container-lowest text-primary-container shadow-sm font-semibold transition-all" id="toggle-all" onclick="filterRoute('all')">
                All (48)
              </button>
<button class="route-filter-btn px-2 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-all" id="toggle-r1" onclick="filterRoute('r1')">
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
<span>Tata Ace EV</span>
</button>
<button class="route-filter-btn px-2 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-all" id="toggle-r2" onclick="filterRoute('r2')">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Bolero Maxi</span>
</button>
<button class="route-filter-btn px-2 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-all" id="toggle-r3" onclick="filterRoute('r3')">
<span class="w-2 h-2 rounded-full bg-[#FF6B5B]"></span>
<span>E-Cargo</span>
</button>
<button class="route-filter-btn px-2 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-all" id="toggle-r4" onclick="filterRoute('r4')">
<span class="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
<span>Bada Dost</span>
</button>
</div>
<!-- Map View Tools -->
<div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
<button class="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant transition-colors" title="Center BKC Depot">
<span class="material-symbols-outlined text-[18px]">my_location</span>
</button>
<button class="p-1 rounded hover:bg-surface-container-lowest text-secondary transition-colors" title="Congestion Layer">
<span class="material-symbols-outlined text-[18px]">layers</span>
</button>
<button class="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant transition-colors" title="Zoom in">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
<button class="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant transition-colors" title="Zoom out">
<span class="material-symbols-outlined text-[18px]">remove</span>
</button>
</div>
</div>
<!-- SVG Cartography Vector Field: Mumbai Central Hub Context -->
<div class="relative w-full h-[450px] bg-[#FAF9F6] rounded-lg overflow-hidden select-none">
<svg class="w-full h-full object-cover" id="vector-map" viewbox="0 0 780 480">
<defs>
<!-- Water Gradient -->
<lineargradient id="creekWater" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#E2F1F1"></stop>
<stop offset="100%" stop-color="#CDECEB"></stop>
</lineargradient>
<!-- Glow Filters for Routes -->
<filter height="140%" id="glow-cobalt" width="140%" x="-20%" y="-20%">
<fedropshadow dx="0" dy="1" flood-color="#1D3FD1" flood-opacity="0.35" stddeviation="2"></fedropshadow>
</filter>
<filter height="140%" id="glow-teal" width="140%" x="-20%" y="-20%">
<fedropshadow dx="0" dy="1" flood-color="#0E7C7B" flood-opacity="0.35" stddeviation="2"></fedropshadow>
</filter>
<filter height="140%" id="glow-coral" width="140%" x="-20%" y="-20%">
<fedropshadow dx="0" dy="1" flood-color="#FF6B5B" flood-opacity="0.45" stddeviation="2"></fedropshadow>
</filter>
<filter height="140%" id="glow-violet" width="140%" x="-20%" y="-20%">
<fedropshadow dx="0" dy="1" flood-color="#7C3AED" flood-opacity="0.35" stddeviation="2"></fedropshadow>
</filter>
</defs>
<!-- Coastline & Mithi River / Mahim Bay contours -->
<path d="M0,0 L180,0 C170,120 120,210 90,260 C60,310 40,360 40,480 L0,480 Z" fill="url(#creekWater)"></path>
<path d="M90,260 Q160,250 240,280 T390,300 T520,270 T610,210 L630,225 Q530,290 400,318 T230,300 Q150,270 90,260 Z" fill="url(#creekWater)" opacity="0.85"></path>
<!-- Arterial Road Grid (Mumbai Arteries: WEH, EEH, SCLR, BKC Connector) -->
<g fill="none" stroke="#E7E5DF" stroke-linecap="round" stroke-width="1.5">
<line stroke="#DCD9D0" stroke-width="3" x1="280" x2="295" y1="20" y2="470"></line> <!-- Western Express Hwy -->
<line stroke="#DCD9D0" stroke-width="3" x1="560" x2="540" y1="30" y2="470"></line> <!-- Eastern Express Hwy -->
<path d="M120,230 L740,230" stroke="#E2DFD6" stroke-width="2"></path> <!-- Santacruz-Chembur Link -->
<path d="M220,130 C340,140 480,120 680,110"></path>
<path d="M180,350 C300,340 450,380 720,360"></path>
<path d="M300,290 L520,220" stroke-dasharray="3 3"></path>
<!-- Secondary street web -->
<circle cx="410" cy="235" r="95" stroke="#EAE8E1" stroke-dasharray="4 4"></circle>
<circle cx="410" cy="235" r="160" stroke="#F1EFEA"></circle>
</g>
<!-- Congestion Bypass Sector (Dotted indicator) -->
<rect fill="#FFDAD6" fill-opacity="0.35" height="55" rx="8" stroke="#BA1A1A" stroke-dasharray="2 2" stroke-width="1" width="85" x="445" y="165"></rect>
<text fill="#93000A" font-family="'JetBrains Mono'" font-size="9" font-weight="600" x="450" y="180">Kurla Bottleneck</text>
<text fill="#BA1A1A" font-family="'JetBrains Mono'" font-size="8" x="450" y="193">QPSO Bypassed (+14m saved)</text>
<!-- ================= ROUTE 1: Cobalt (#1D3FD1) - Tata Ace EV (North-West Sector, Bandra-Khar) ================= -->
<g class="transition-opacity duration-300" id="route-layer-r1">
<path d="M410,235 L360,200 L320,165 L270,140 L240,95 L260,60 L310,75 L340,115 L380,140 L410,235" fill="none" filter="url(#glow-cobalt)" stroke="#1D3FD1" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
<!-- Stops Pins 1 to 14 sampled -->
<circle cx="360" cy="200" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="360" y="203">1</text>
<circle cx="320" cy="165" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="320" y="168">4</text>
<circle cx="270" cy="140" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="270" y="143">7</text>
<circle cx="240" cy="95" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="240" y="98">9</text>
<circle cx="260" cy="60" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="260" y="63">11</text>
<circle cx="310" cy="75" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="310" y="78">13</text>
<circle cx="380" cy="140" fill="#1D3FD1" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="380" y="143">14</text>
</g>
<!-- ================= ROUTE 2: Rich Teal (#0E7C7B) - Bolero Maxi (East Sector, Ghatkopar-Chembur) ================= -->
<g class="transition-opacity duration-300" id="route-layer-r2">
<path d="M410,235 L480,240 L530,225 L585,185 L640,150 L680,185 L650,245 L590,285 L525,295 L410,235" fill="none" filter="url(#glow-teal)" stroke="#0E7C7B" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
<!-- Stops Pins 15 to 28 sampled -->
<circle cx="480" cy="240" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="480" y="243">15</text>
<circle cx="530" cy="225" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="530" y="228">18</text>
<circle cx="585" cy="185" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="585" y="188">21</text>
<circle cx="680" cy="185" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="680" y="188">24</text>
<circle cx="650" cy="245" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="650" y="248">26</text>
<circle cx="525" cy="295" fill="#0E7C7B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="525" y="298">28</text>
</g>
<!-- ================= ROUTE 3: Kinetic Coral (#FF6B5B) - E-Cargo Express (South-Central, Sion-Dharavi) ================= -->
<g class="transition-opacity duration-300" id="route-layer-r3">
<path d="M410,235 L385,270 L345,310 L310,355 L350,395 L405,370 L430,320 L410,235" fill="none" filter="url(#glow-coral)" stroke="#FF6B5B" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
<!-- Stops Pins 29 to 39 sampled -->
<circle cx="385" cy="270" fill="#FF6B5B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="385" y="273">29</text>
<circle cx="345" cy="310" fill="#FF6B5B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="345" y="313">32</text>
<circle cx="310" cy="355" fill="#FF6B5B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="310" y="358">35</text>
<circle cx="350" cy="395" fill="#FF6B5B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="350" y="398">37</text>
<circle cx="430" cy="320" fill="#FF6B5B" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="430" y="323">39</text>
</g>
<!-- ================= ROUTE 4: Purple (#7C3AED) - Ashok Bada Dost (North-East, Vikhroli-Kanjur) ================= -->
<g class="transition-opacity duration-300" id="route-layer-r4">
<path d="M410,235 L450,180 L490,135 L525,80 L575,65 L600,105 L555,150 L410,235" fill="none" filter="url(#glow-violet)" stroke="#7C3AED" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"></path>
<!-- Stops Pins 40 to 48 sampled -->
<circle cx="450" cy="180" fill="#7C3AED" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="450" y="183">40</text>
<circle cx="490" cy="135" fill="#7C3AED" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="490" y="138">43</text>
<circle cx="525" cy="80" fill="#7C3AED" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="525" y="83">45</text>
<circle cx="575" cy="65" fill="#7C3AED" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="575" y="68">46</text>
<circle cx="600" cy="105" fill="#7C3AED" r="8"></circle><text dominant-baseline="middle" fill="#FFF" font-family="'JetBrains Mono'" font-size="8" font-weight="700" text-anchor="middle" x="600" y="108">48</text>
</g>
<!-- Central Depot Pin BKC Hub -->
<g transform="translate(410, 235)">
<circle class="animate-ping" cx="0" cy="0" fill="#1D3FD1" opacity="0.2" r="16"></circle>
<rect fill="#1D3FD1" height="28" rx="6" shadow="shadow-md" stroke="#FFFFFF" stroke-width="2.5" width="28" x="-14" y="-14"></rect>
<path d="M-6,2 L0,-6 L6,2 Z M-4,2 L-4,6 L4,6 L4,2 Z" fill="#FFFFFF"></path>
<!-- Hub Badge -->
<g transform="translate(18, -10)">
<rect fill="#191B22" fill-opacity="0.9" height="22" rx="4" width="138" x="0" y="0"></rect>
<text fill="#FFFFFF" font-family="'Inter'" font-size="10" font-weight="700" letter-spacing="0.5" x="8" y="15">DEPOT-01 (BKC Hub)</text>
</g>
</g>
</svg>
<!-- Bottom Left HUD Elements -->
<div class="absolute bottom-3 left-3 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
<div class="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
<span class="w-8 h-1 bg-on-surface inline-block"></span>
<span>5 km</span>
</div>
<span class="text-outline-variant">|</span>
<span class="font-label-sm text-[11px] text-outline">OpenStreetMap · MMR Metropolitan Grid</span>
<span class="text-outline-variant">|</span>
<span class="flex items-center gap-1 font-label-sm text-[11px] text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Live Congestion Bypassed
              </span>
</div>
</div>
</div>
<!-- Vehicle Dispatch Fleet List (Zero awkward empty gap) -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
<div class="flex items-center justify-between pb-3">
<div>
<h2 class="font-headline-md text-headline-sm uppercase tracking-wide text-on-surface font-bold">
                Assigned Vehicle Roster (4 Units)
              </h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                100% Demand Fulfilled · 3,420 kg Total Load Allocated
              </p>
</div>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface font-telemetry-data text-label-sm">
              Capacity Utilization: 92.4%
            </span>
</div>
<!-- Roster Cards -->
<div class="flex flex-col gap-2.5">
<!-- Row 1: Tata Ace EV -->
<div class="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
<div class="flex items-center gap-3 min-w-[200px]">
<span class="w-4 h-4 rounded-full bg-primary-container ring-4 ring-primary-fixed shrink-0"></span>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-label-md font-bold text-on-surface">Tata Ace EV</span>
<span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary-container font-medium">EV-01</span>
</div>
<span class="font-label-sm text-body-sm text-on-surface-variant">14 Stops (Zone: Bandra West / Khar)</span>
</div>
</div>
<!-- Load Bar -->
<div class="flex-1 max-w-xs">
<div class="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Load: 480 kg / 500 kg</span>
<span class="text-secondary font-semibold font-telemetry-data">96%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 96%"></div>
</div>
</div>
<div class="flex items-center justify-between md:justify-end gap-4 shrink-0 font-telemetry-data text-telemetry-data">
<div class="text-right">
<div class="text-on-surface font-semibold">28.4 km</div>
<div class="text-outline text-label-sm">Est: 1h 14m</div>
</div>
<button class="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors text-on-surface-variant shadow-sm" title="Vehicle Detail (2.7)">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<!-- Row 2: Bolero Maxi -->
<div class="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
<div class="flex items-center gap-3 min-w-[200px]">
<span class="w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary-fixed shrink-0"></span>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-label-md font-bold text-on-surface">Bolero Maxi</span>
<span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-secondary font-medium">TRK-02</span>
</div>
<span class="font-label-sm text-body-sm text-on-surface-variant">14 Stops (Zone: Ghatkopar / Chembur)</span>
</div>
</div>
<!-- Load Bar -->
<div class="flex-1 max-w-xs">
<div class="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Load: 1,120 kg / 1,200 kg</span>
<span class="text-secondary font-semibold font-telemetry-data">93.3%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 93.3%"></div>
</div>
</div>
<div class="flex items-center justify-between md:justify-end gap-4 shrink-0 font-telemetry-data text-telemetry-data">
<div class="text-right">
<div class="text-on-surface font-semibold">36.2 km</div>
<div class="text-outline text-label-sm">Est: 1h 38m</div>
</div>
<button class="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors text-on-surface-variant shadow-sm" title="Vehicle Detail (2.7)">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<!-- Row 3: E-Cargo Express -->
<div class="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
<div class="flex items-center gap-3 min-w-[200px]">
<span class="w-4 h-4 rounded-full bg-[#FF6B5B] ring-4 ring-[#FFDAD6] shrink-0"></span>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-label-md font-bold text-on-surface">E-Cargo Express</span>
<span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-[#FF6B5B] font-medium">EV-03</span>
</div>
<span class="font-label-sm text-body-sm text-on-surface-variant">11 Stops (Zone: Sion / Dharavi)</span>
</div>
</div>
<!-- Load Bar -->
<div class="flex-1 max-w-xs">
<div class="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Load: 740 kg / 800 kg</span>
<span class="text-secondary font-semibold font-telemetry-data">92.5%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 92.5%"></div>
</div>
</div>
<div class="flex items-center justify-between md:justify-end gap-4 shrink-0 font-telemetry-data text-telemetry-data">
<div class="text-right">
<div class="text-on-surface font-semibold">22.8 km</div>
<div class="text-outline text-label-sm">Est: 58m</div>
</div>
<button class="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors text-on-surface-variant shadow-sm" title="Vehicle Detail (2.7)">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<!-- Row 4: Ashok Bada Dost -->
<div class="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
<div class="flex items-center gap-3 min-w-[200px]">
<span class="w-4 h-4 rounded-full bg-[#7C3AED] ring-4 ring-[#E9D5FF] shrink-0"></span>
<div>
<div class="flex items-center gap-2">
<span class="font-headline-sm text-label-md font-bold text-on-surface">Ashok Bada Dost</span>
<span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-[#7C3AED] font-medium">TRK-04</span>
</div>
<span class="font-label-sm text-body-sm text-on-surface-variant">9 Stops (Zone: Vikhroli / Kanjurmarg)</span>
</div>
</div>
<!-- Load Bar -->
<div class="flex-1 max-w-xs">
<div class="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Load: 1,080 kg / 1,200 kg</span>
<span class="text-secondary font-semibold font-telemetry-data">90.0%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 90%"></div>
</div>
</div>
<div class="flex items-center justify-between md:justify-end gap-4 shrink-0 font-telemetry-data text-telemetry-data">
<div class="text-right">
<div class="text-on-surface font-semibold">31.5 km</div>
<div class="text-outline text-label-sm">Est: 1h 22m</div>
</div>
<button class="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors text-on-surface-variant shadow-sm" title="Vehicle Detail (2.7)">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
<!-- ================= RIGHT SECTION: RESULTS PANEL (~38% -> 5 cols on XL) ================= -->
<div class="xl:col-span-5 flex flex-col gap-space-md">
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-5">
<!-- Section 1: Stat Tiles Grid -->
<div>
<div class="flex items-center justify-between mb-3">
<span class="font-headline-sm text-label-md font-bold uppercase tracking-wider text-on-surface">Optimization Key Metrics</span>
<span class="font-label-sm text-label-sm text-outline">Seed #92841</span>
</div>
<div class="grid grid-cols-2 gap-3">
<!-- Tile 1: Deliveries -->
<div class="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">Deliveries Served</span>
<div class="font-metric-huge text-headline-lg font-bold text-on-surface my-1">48 / 48</div>
<span class="font-body-sm text-body-sm text-secondary font-medium">100% clustered nodes</span>
</div>
<!-- Tile 2: Vehicles -->
<div class="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">Vehicles Used</span>
<div class="font-metric-huge text-headline-lg font-bold text-on-surface my-1">4 Units</div>
<span class="font-body-sm text-body-sm text-outline font-medium">2 EV · 2 Diesel/Hybrid</span>
</div>
<!-- Tile 3: Total Distance -->
<div class="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">Total Distance</span>
<div class="font-metric-huge text-headline-lg font-bold text-primary-container my-1">118.9 km</div>
<span class="font-body-sm text-body-sm text-secondary font-medium">↓ 45.3 km vs Baseline</span>
</div>
<!-- Tile 4: Transit Time -->
<div class="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">Total Transit Time</span>
<div class="font-metric-huge text-headline-lg font-bold text-on-surface my-1">5h 12m</div>
<span class="font-body-sm text-body-sm text-outline font-medium">cumulative fleet time</span>
</div>
</div>
<!-- Constraint Violations Banner -->
<div class="mt-3 p-3 rounded-lg bg-secondary-fixed/30 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
<span class="material-symbols-outlined text-[18px]">verified</span>
</div>
<div>
<div class="font-headline-sm text-label-md text-on-secondary-fixed font-bold">Constraint Violations: 0</div>
<div class="font-body-sm text-[12px] text-on-surface-variant">Time windows, EV battery range &amp; capacities fully respected</div>
</div>
</div>
<span class="font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider">Validated</span>
</div>
</div>
<!-- Section 2: Multi-Solver Benchmark Matrix Strip -->
<div>
<div class="flex items-center justify-between mb-2">
<div>
<h3 class="font-headline-sm text-label-md uppercase tracking-wider font-bold text-on-surface">Multi-Solver Benchmark Matrix</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">Compare Pareto-front solutions against standard routing heuristics</p>
</div>
</div>
<!-- Pill Tabs -->
<div class="grid grid-cols-6 gap-1 p-1 bg-surface-container-low rounded-lg font-telemetry-data text-label-sm">
<button class="py-1.5 text-center rounded text-on-surface-variant hover:text-on-surface transition-colors font-medium">NN</button>
<button class="py-1.5 text-center rounded text-on-surface-variant hover:text-on-surface transition-colors font-medium">GA</button>
<button class="py-1.5 text-center rounded text-on-surface-variant hover:text-on-surface transition-colors font-medium">ACO</button>
<button class="py-1.5 text-center rounded text-on-surface-variant hover:text-on-surface transition-colors font-medium">PSO</button>
<button class="py-1.5 text-center rounded bg-[#FF6B5B] text-on-primary font-bold shadow-sm flex flex-col items-center justify-center">
<span>QPSO</span>
<span class="text-[9px] uppercase tracking-tighter opacity-90 font-sans">BEST</span>
</button>
<button class="py-1.5 text-center rounded text-on-surface-variant hover:text-on-surface transition-colors font-medium">ILP</button>
</div>
</div>
<!-- Section 3: Solver Comparison Table -->
<div>
<div class="flex items-center justify-between mb-2">
<span class="font-headline-sm text-label-sm text-on-surface font-semibold">Baseline Nearest-Neighbour vs. QPSO</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Convergence @ 100 iters</span>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left font-body-sm text-label-md">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-2 px-3 rounded-l-md">Metric</th>
<th class="py-2 px-2">Baseline (NN)</th>
<th class="py-2 px-2 text-primary-container font-semibold">Our QPSO</th>
<th class="py-2 px-3 text-right rounded-r-md">% Improvement</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container font-telemetry-data text-telemetry-data">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-low/50">
<td class="py-2.5 px-3 font-body-sm text-on-surface font-medium">Total Distance</td>
<td class="py-2.5 px-2 text-outline">164.2 km</td>
<td class="py-2.5 px-2 text-on-surface font-bold text-primary-container">118.9 km</td>
<td class="py-2.5 px-3 text-right">
<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-secondary text-label-sm font-semibold">
                        ↓ 27.6% Saved
                      </span>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-low/50">
<td class="py-2.5 px-3 font-body-sm text-on-surface font-medium">Transit Time</td>
<td class="py-2.5 px-2 text-outline">7h 45m</td>
<td class="py-2.5 px-2 text-on-surface font-bold text-primary-container">5h 12m</td>
<td class="py-2.5 px-3 text-right">
<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-secondary text-label-sm font-semibold">
                        ↓ 32.9% Faster
                      </span>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container-low/50">
<td class="py-2.5 px-3 font-body-sm text-on-surface font-medium">Operating Cost</td>
<td class="py-2.5 px-2 text-outline">₹4,820</td>
<td class="py-2.5 px-2 text-on-surface font-bold text-primary-container">₹3,410</td>
<td class="py-2.5 px-3 text-right">
<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-secondary text-label-sm font-semibold">
                        ↓ ₹1,410 (29.2%)
                      </span>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-surface-container-low/50">
<td class="py-2.5 px-3 font-body-sm text-on-surface font-medium">Fleet CO₂</td>
<td class="py-2.5 px-2 text-outline">38.4 kg</td>
<td class="py-2.5 px-2 text-on-surface font-bold text-primary-container">24.1 kg</td>
<td class="py-2.5 px-3 text-right">
<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-secondary text-label-sm font-semibold">
                        ↓ 37.2% Less
                      </span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Section 4: Algorithmic Proof Note Box -->
<div class="p-3.5 rounded-lg bg-surface-container-low border-l-4 border-primary-container flex items-start gap-2.5">
<span class="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">psychology</span>
<div class="font-telemetry-data text-body-sm leading-relaxed text-on-surface-variant">
<span class="text-on-surface font-bold">Quantum Tunneling Advantage:</span> Overcame 6 local minima in BKC-Kurla bottleneck; classical GA &amp; Nearest-Neighbour trapped in sub-optimal cross-cluster routes causing +45 km detours.
            </div>
</div>
<!-- Section 5: Action Footer & Export Bar -->
<div class="pt-2 flex flex-col gap-3">
<div class="grid grid-cols-2 gap-2">
<button class="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-sm font-medium flex items-center justify-center gap-1.5 transition-colors" onclick="triggerExport('csv')">
<span class="material-symbols-outlined text-[18px] text-primary-container">download</span>
<span>Export CSV</span>
</button>
<button class="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-sm font-medium flex items-center justify-center gap-1.5 transition-colors" onclick="triggerExport('json')">
<span class="material-symbols-outlined text-[18px] text-primary-container">data_object</span>
<span>Export JSON</span>
</button>
</div>
<!-- Print Dispatch Manifest Link -->
<button class="text-center font-label-sm text-label-sm text-outline hover:text-primary-container transition-colors flex items-center justify-center gap-1.5" onclick="window.print()">
<span class="material-symbols-outlined text-[16px]">print</span>
<span class="underline underline-offset-4">Print Dispatch Manifest &amp; Driver Turn-by-Turn Sheets</span>
</button>
<!-- Primary Dispatch Action -->
<button class="w-full py-3.5 px-4 rounded-xl bg-[#FF6B5B] hover:bg-[#F05746] text-on-primary font-headline-md text-headline-sm uppercase tracking-wide font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2">
<span>DISPATCH FLEET NOW</span>
<span class="material-symbols-outlined text-[20px]">rocket_launch</span>
</button>
</div>
</div>
</div>
</div>
</div>
<script>
    function filterRoute(routeId) {
      const routes = ['r1', 'r2', 'r3', 'r4'];
      const buttons = document.querySelectorAll('.route-filter-btn');
      
      buttons.forEach(btn => {
        btn.classList.remove('bg-surface-container-lowest', 'text-primary-container', 'shadow-sm', 'font-semibold');
        btn.classList.add('text-on-surface-variant');
      });

      if (routeId === 'all') {
        routes.forEach(id => {
          const el = document.getElementById(\`route-layer-\${id}\`);
          if (el) el.style.opacity = '1';
        });
        const activeBtn = document.getElementById('toggle-all');
        if (activeBtn) {
          activeBtn.classList.add('bg-surface-container-lowest', 'text-primary-container', 'shadow-sm', 'font-semibold');
          activeBtn.classList.remove('text-on-surface-variant');
        }
      } else {
        routes.forEach(id => {
          const el = document.getElementById(\`route-layer-\${id}\`);
          if (el) {
            el.style.opacity = id === routeId ? '1' : '0.15';
          }
        });
        const activeBtn = document.getElementById(\`toggle-\${routeId}\`);
        if (activeBtn) {
          activeBtn.classList.add('bg-surface-container-lowest', 'text-primary-container', 'shadow-sm', 'font-semibold');
          activeBtn.classList.remove('text-on-surface-variant');
        }
      }
    }

    function triggerExport(format) {
      const feedback = document.createElement('div');
      feedback.className = 'fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-inverse-surface text-inverse-on-surface rounded-lg font-telemetry-data text-label-sm shadow-xl flex items-center gap-2';
      feedback.innerHTML = \`<span class="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span> Exporting dispatch manifest as \${format.toUpperCase()}...\`;
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 2400);
    }
  </script>
</div></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">QIDRE</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
