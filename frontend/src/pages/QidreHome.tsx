import React, { useEffect, useRef } from 'react';

export default function QidreHome({ navigate }: { navigate: (path: string) => void }) {
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
<section class="relative w-full overflow-hidden bg-surface py-space-xl md:py-28">
<div aria-hidden="true" class="absolute inset-0 pointer-events-none opacity-80">
<div class="absolute -top-32 -left-20 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-primary-container/10 via-secondary-container/20 to-transparent blur-3xl"></div>
<div class="absolute top-1/3 right-0 w-[540px] h-[540px] rounded-full bg-gradient-to-tl from-secondary/10 via-primary/5 to-transparent blur-3xl"></div>
</div>
<div class="relative w-full max-w-7xl mx-auto px-gutter md:px-margin grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
<div class="lg:col-span-7 flex flex-col items-start z-10">
<div class="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-surface-container-low shadow-sm mb-6">
<span class="inline-flex w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
<span class="font-sans font-bold text-label-sm font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
            ENTERPRISE QUANTUM TECHNOLOGY
          </span>
</div>
<div class="flex items-center gap-4 mb-5"><img src="/logo-icon.png" alt="QIDRE" class="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_24px_rgba(0,180,255,0.45)]" /><h1 class="font-sans font-bold text-primary-container text-5xl md:text-7xl font-bold tracking-[0.24em] uppercase leading-none select-none">QIDRE</h1></div>
<p class="font-headline-sm text-body-lg text-outline max-w-xl mb-8 leading-relaxed font-normal">
          Quantum-inspired route and fleet optimization — benchmarked, not promised.
        </p>
<div class="flex flex-wrap items-center gap-3">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">hub</span>
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase tracking-wider">Dual Core QPSO × QAOA</span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
<span class="font-telemetry-data text-label-sm text-on-surface-variant uppercase tracking-wider">Deterministic Reproducibility</span>
</div>
</div>
</div>
<div class="lg:col-span-5 relative w-full h-[360px] md:h-[440px] rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex items-center justify-center p-4">
<div class="absolute inset-0 bg-[radial-gradient(#1d3fd1_0.65px,transparent_0.65px)] [background-size:16px_16px] opacity-10"></div>
<svg class="relative w-full h-full" fill="none" viewbox="0 0 460 420" xmlns="http://www.w3.org/2000/svg">
<path d="M 65 30 C 95 65, 110 110, 125 160 C 138 200, 142 240, 155 285 C 168 330, 185 375, 210 405" stroke="#c5c5d7" stroke-dasharray="3 3" stroke-width="1.25"></path>
<path d="M 125 160 C 175 145, 235 155, 305 135 C 365 118, 410 75, 435 45" stroke="#e2e2ea" stroke-width="1.25"></path>
<path d="M 155 285 C 210 270, 275 295, 340 275 C 385 260, 420 225, 445 195" stroke="#e2e2ea" stroke-width="1.25"></path>
<path d="M 80 40 Q 140 180 170 290 T 230 395" opacity="0.45" stroke="#1d3fd1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
<path d="M 170 290 L 320 280 L 390 190" opacity="0.35" stroke="#1d3fd1" stroke-dasharray="4 4" stroke-width="1.75"></path>
<path d="M 75 50 C 115 130, 195 190, 245 230 C 295 270, 360 275, 410 235" id="quantum-route-1" stroke="#006a69" stroke-linecap="round" stroke-width="2.75"></path>
<path d="M 245 230 C 220 290, 210 330, 215 390" id="quantum-route-2" stroke="#006a69" stroke-dasharray="6 3" stroke-linecap="round" stroke-width="2.25"></path>
<circle cx="75" cy="50" fill="#1d3fd1" r="5"></circle>
<circle cx="75" cy="50" opacity="0.35" r="11" stroke="#1d3fd1" stroke-width="1.25"></circle>
<text fill="#191b22" font-family="'JetBrains Mono'" font-size="10" font-weight="600" x="88" y="46">HUB-NORTH (BOM-01)</text>
<circle cx="410" cy="235" fill="#006a69" r="5.5"></circle>
<circle class="animate-ping" cx="410" cy="235" opacity="0.4" r="12" stroke="#006a69" stroke-width="1.25"></circle>
<text fill="#006a69" font-family="'JetBrains Mono'" font-size="10" font-weight="700" x="310" y="222">Q-OPTIMAL TARGET</text>
<circle cx="215" cy="390" fill="#1d3fd1" r="4.5"></circle>
<text fill="#757686" font-family="'JetBrains Mono'" font-size="9.5" x="110" y="398">SOUTH HARBOR NODE</text>
<circle cx="245" cy="230" fill="#006a69" r="4"></circle>
<text fill="#00504f" font-family="'JetBrains Mono'" font-size="9" x="254" y="226">ENTANGLED JUNCTION</text>
<g transform="translate(18, 350)">
<rect fill="#faf8ff" fill-opacity="0.92" height="52" rx="8" width="138"></rect>
<text fill="#191b22" font-family="'Inter'" font-size="9" font-weight="700" letter-spacing="1" x="12" y="20">MUMBAI SECTOR 04</text>
<text fill="#006a69" font-family="'JetBrains Mono'" font-size="10" font-weight="600" x="12" y="38">Δ T -18.4% · CO² -24%</text>
</g>
</svg>
<div class="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span class="font-telemetry-data text-[10px] text-on-surface-variant font-semibold tracking-wide">VECTOR RUNNING</span>
</div>
</div>
</div>
</section>
<section class="w-full max-w-7xl mx-auto px-gutter md:px-margin -mt-4 mb-20">
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="group relative rounded-2xl p-8 bg-surface-container-lowest shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
<div>
<div class="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-primary-fixed">
<svg class="w-7 h-7 text-primary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewbox="0 0 24 24">
<circle cx="5" cy="18" r="2.5"></circle>
<circle cx="19" cy="6" r="2.5"></circle>
<circle cx="19" cy="18" r="2.5"></circle>
<path d="M7.5 18h4.5a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h1"></path>
<path d="M12 18h4.5a2.5 2.5 0 0 0 2.5-2.5"></path>
</svg>
</div>
<div class="flex items-center gap-2 mb-2">
<span class="font-telemetry-data text-label-sm text-secondary font-semibold uppercase tracking-wider">Module 01</span>
<span class="text-outline-variant">·</span>
<span class="font-telemetry-data text-label-sm text-outline">Pairwise Comparison</span>
</div>
<h2 class="font-sans font-semibold text-headline-lg font-bold text-on-surface tracking-tight mb-3">
            COMPARE ROUTES
          </h2>
<p class="font-body-md text-body-lg text-outline leading-relaxed mb-8">
            See our route vs the shortest-distance baseline for any trip.
          </p>
</div>
<div class="pt-4 flex items-center justify-between">
<a class="inline-flex items-center justify-center px-7 py-3 rounded-full bg-tertiary-container hover:bg-tertiary text-on-primary font-sans font-semibold font-bold text-label-md tracking-wider transition-all duration-200 transform group-hover:scale-[1.02] shadow-md" data-path="compare-routes" href="#">
            Start Comparing →
          </a>
<span class="font-telemetry-data text-label-sm text-on-surface-variant opacity-75">Dijkstra vs QPSO</span>
</div>
</div>
<div class="group relative rounded-2xl p-8 bg-surface-container-lowest shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
<div>
<div class="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-secondary-container">
<svg class="w-7 h-7 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewbox="0 0 24 24">
<rect height="14" rx="2" ry="2" width="20" x="2" y="7"></rect>
<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
<circle cx="6" cy="14" r="1"></circle>
<circle cx="18" cy="14" r="1"></circle>
<path d="M10 10h4"></path>
</svg>
</div>
<div class="flex items-center gap-2 mb-2">
<span class="font-telemetry-data text-label-sm text-primary font-semibold uppercase tracking-wider">Module 02</span>
<span class="text-outline-variant">·</span>
<span class="font-telemetry-data text-label-sm text-outline">Multi-Agent Dispatch</span>
</div>
<h2 class="font-sans font-semibold text-headline-lg font-bold text-on-surface tracking-tight mb-3">
            FLEET OPTIMIZER
          </h2>
<p class="font-body-md text-body-lg text-outline leading-relaxed mb-8">
            Optimize multi-vehicle delivery routes with QPSO.
          </p>
</div>
<div class="pt-4 flex items-center justify-between">
<a class="inline-flex items-center justify-center px-7 py-3 rounded-full bg-tertiary-container hover:bg-tertiary text-on-primary font-sans font-semibold font-bold text-label-md tracking-wider transition-all duration-200 transform group-hover:scale-[1.02] shadow-md" data-path="fleet-optimizer" href="#">
            Optimize a Fleet →
          </a>
<span class="font-telemetry-data text-label-sm text-on-surface-variant opacity-75">N-Vehicle CVRP</span>
</div>
</div>
</div>
</section>
<section class="w-full bg-surface-container-low/60 py-10">
<div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col sm:flex-row items-center justify-between gap-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-outline text-[20px]">science</span>
<p class="font-headline-sm text-body-sm text-outline">
          Powered by Quantum-Inspired Particle Swarm Optimization (QPSO) vs Classical Dijkstra &amp; Genetic Baselines
        </p>
</div>
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-highest">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-sans font-bold text-label-sm font-semibold tracking-wider text-on-surface-variant">v2.4-hybrid-engine</span>
</div>
</div>
</section>
</div></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">QIDRE</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
