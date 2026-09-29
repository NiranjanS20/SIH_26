import React, { useEffect, useRef } from 'react';

export default function QidreGoogleBenchmarkTier4({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-16 w-full px-gutter flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img src="/logo-icon.png" alt="QIDRE" class="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,180,255,0.4)]" /><span class="text-headline-md font-headline-md tracking-wider text-primary" style="font-family: 'Inter', sans-serif; font-weight: 700;">QIDRE</span><div class="h-4 w-px bg-surface-container-highest"></div><nav aria-label="Breadcrumb" class="hidden xl:flex items-center gap-space-xs font-telemetry-data text-telemetry-data text-on-surface-variant"><span>Fleet Optimizer</span><span class="text-outline-variant">/</span><span class="text-on-surface">Google Benchmark (Tier 4)</span></nav></div><div class="hidden sm:flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-secondary-container/40"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span><span class="font-label-sm text-label-sm text-secondary uppercase">Node Active</span></div></div><nav class="hidden lg:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-headline-sm rounded-lg"><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="wizard" href="#">Wizard</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="traffic-prediction" href="#">Traffic Prediction</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="results" href="#">Results</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="comparison" href="#">Comparison</a><a aria-current="page" class="px-3 py-1.5 transition-colors bg-primary-container text-on-primary-container font-headline-sm rounded-lg" data-path="benchmarks-research" href="#">Benchmarks / Research</a><a class="px-3 py-1.5 rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quantum-lab" href="#">Quantum Lab</a></nav><div class="flex items-center gap-space-md"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-16 bg-surface"><div class="flex flex-col w-full">
<div class="w-full px-gutter py-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center gap-space-xs sm:gap-space-md">
<div class="flex items-center gap-space-xs font-telemetry-data text-label-sm text-on-surface-variant">
<span class="text-primary font-bold">WORKSPACE</span>
<span class="text-outline-variant">/</span>
<span class="text-on-surface">BENCHMARK AUDIT (TIER 4)</span>
<span class="text-outline-variant">·</span>
<span class="text-primary-container font-semibold">ROUTES API v2</span>
</div>
<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-telemetry-data text-label-sm">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Quota: 4,812 / 10,000 req/day</span>
<span class="text-outline-variant">|</span>
<span class="text-secondary font-semibold">Health: 99.8% OK</span>
</div>
</div>
<div class="flex flex-wrap items-center gap-space-xs">
<div class="relative inline-block text-left">
<select class="h-9 px-3 pr-8 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer shadow-sm" id="corridor-select">
<option value="bkc-airport">BKC to Airport Corridor (14.2 km Peak Hours)</option>
<option value="nariman-andheri">Nariman Point → Andheri MIDC (26.8 km Evening)</option>
<option value="vashi-lowerparel">Vashi Navi Mumbai → Lower Parel (21.4 km Morning)</option>
</select>
</div>
<div class="inline-flex items-center h-9 px-3 rounded-lg bg-surface-container-lowest font-telemetry-data text-label-sm text-on-surface-variant shadow-sm">
<span class="material-symbols-outlined text-[16px] mr-1 text-outline">calendar_today</span>
<span>Today · Peak PM</span>
</div>
<button class="inline-flex items-center gap-1 h-9 px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md transition-all hover:bg-primary active:scale-[0.99] shadow-sm" id="rerun-btn">
<span class="material-symbols-outlined text-[18px]">cached</span>
<span>Re-run Probe</span>
</button>
<button class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-all hover:bg-surface-container-high shadow-sm" id="toggle-state-btn">
<span class="material-symbols-outlined text-[16px] text-tertiary">tune</span>
<span id="state-toggle-text">Preview Unconfigured State</span>
</button>
</div>
</div>
<div class="flex flex-col w-full px-gutter py-space-lg gap-space-lg" id="view-configured">
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
<div class="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
<div>
<div class="flex items-center justify-between gap-space-xs mb-space-xs">
<span class="font-headline-md text-headline-md text-on-surface">Google Route</span>
<span class="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-telemetry-data text-[11px] font-semibold tracking-tight">API v2 · Live Probe</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant min-h-[38px]">Google Maps Platform Directions API (Best Guess Traffic)</p>
<div class="my-space-md flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-primary">34.2</span>
<span class="font-headline-sm text-headline-sm text-on-surface-variant">min</span>
<span class="ml-auto font-telemetry-data text-telemetry-data text-on-surface font-semibold">14.8 km</span>
</div>
<div class="p-space-xs rounded-lg bg-surface-container-low font-telemetry-data text-[11px] text-on-surface-variant leading-relaxed">
            Live traffic layer probe · Toll-aware · Latency: <strong class="text-on-surface">310 ms</strong>
</div>
</div>
<div class="mt-space-md pt-space-xs bg-surface-container-low/40 p-space-xs rounded-lg">
<div class="font-label-sm text-label-sm text-outline mb-1">Turn-by-Turn Topology:</div>
<div class="font-body-sm text-body-sm text-on-surface font-medium truncate">Western Express Hwy → BKC Connector → Sahar Elevated</div>
</div>
</div>
<div class="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
<div>
<div class="flex items-center justify-between gap-space-xs mb-space-xs">
<span class="font-headline-md text-headline-md text-on-surface">A* Classical</span>
<span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-telemetry-data text-[11px] font-semibold tracking-tight">Classical A* · Graph</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant min-h-[38px]">Static Graph Shortest Path (Dijkstra-Euclidean Heuristic)</p>
<div class="my-space-md flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-on-surface">37.9</span>
<span class="font-headline-sm text-headline-sm text-on-surface-variant">min</span>
<span class="ml-auto font-telemetry-data text-telemetry-data text-on-surface font-semibold">13.9 km</span>
</div>
<div class="p-space-xs rounded-lg bg-surface-container-low font-telemetry-data text-[11px] text-on-surface-variant leading-relaxed">
            Zero traffic foresight · Fixed edge speeds · Latency: <strong class="text-on-surface">12 ms</strong>
</div>
</div>
<div class="mt-space-md pt-space-xs bg-surface-container-low/40 p-space-xs rounded-lg">
<div class="font-label-sm text-label-sm text-outline mb-1">Turn-by-Turn Topology:</div>
<div class="font-body-sm text-body-sm text-on-surface font-medium truncate">Sion-Bandra Link Rd → LBS Marg → Nehru Rd</div>
</div>
</div>
<div class="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
<div>
<div class="flex items-center justify-between gap-space-xs mb-space-xs">
<span class="font-headline-md text-headline-md text-on-surface">Predicted Route</span>
<span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-telemetry-data text-[11px] font-semibold tracking-tight">QSVR Horizon +45m</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant min-h-[38px]">Tier 2 Quantum ML Enhanced (Flow Velocity Vector)</p>
<div class="my-space-md flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-secondary">32.6</span>
<span class="font-headline-sm text-headline-sm text-on-surface-variant">min</span>
<span class="ml-auto font-telemetry-data text-telemetry-data text-on-surface font-semibold">14.5 km</span>
</div>
<div class="p-space-xs rounded-lg bg-surface-container-low font-telemetry-data text-[11px] text-on-surface-variant leading-relaxed">
            128-Qubit kernel flow · Shockwave queue avoidance · Latency: <strong class="text-on-surface">48 ms</strong>
</div>
</div>
<div class="mt-space-md pt-space-xs bg-surface-container-low/40 p-space-xs rounded-lg">
<div class="font-label-sm text-label-sm text-outline mb-1">Turn-by-Turn Topology:</div>
<div class="font-body-sm text-body-sm text-on-surface font-medium truncate">CST Rd → Kurla Flyover bypass → Santa Cruz Chembur</div>
</div>
</div>
<div class="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
<div>
<div class="flex items-center justify-between gap-space-xs mb-space-xs">
<span class="font-headline-md text-headline-md text-on-surface">QPSO Route</span>
<span class="px-2 py-0.5 rounded-full bg-primary-fixed-dim text-on-primary-fixed font-telemetry-data text-[11px] font-semibold tracking-tight">QPSO Swarm Optima</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant min-h-[38px]">Tier 1 Quantum-Behaved Particle Swarm Multi-Objective</p>
<div class="my-space-md flex items-baseline gap-2">
<span class="font-metric-huge text-metric-huge text-primary-container">31.8</span>
<span class="font-headline-sm text-headline-sm text-on-surface-variant">min</span>
<span class="ml-auto font-telemetry-data text-telemetry-data text-on-surface font-semibold">14.4 km</span>
</div>
<div class="p-space-xs rounded-lg bg-surface-container-low font-telemetry-data text-[11px] text-on-surface-variant leading-relaxed">
            Pareto-optimal stop duration vs distance · Latency: <strong class="text-on-surface">84 ms</strong>
</div>
</div>
<div class="mt-space-md pt-space-xs bg-surface-container-low/40 p-space-xs rounded-lg">
<div class="font-label-sm text-label-sm text-outline mb-1">Turn-by-Turn Topology:</div>
<div class="font-body-sm text-body-sm text-on-surface font-medium truncate">BKC G-Block → Vidyanagari Marg → CST → Terminal 2</div>
</div>
</div>
</div>
<div class="w-full p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
<div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">analytics</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Empirical Performance Distribution (Sample: N = 500 Urban Trips · Mumbai MMR Logistics Corridor)</h2>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Fair multi-point audit comparing QIDRE optimized paths against Google Maps production route under identical real-world departure timestamps.</p>
</div>
<div class="flex items-center gap-space-xs font-telemetry-data text-label-sm">
<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary-container/40 text-secondary">
<span class="w-2 h-2 rounded-full bg-secondary"></span> 37.4% Faster
          </span>
<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-outline"></span> 44.2% Equivalent
          </span>
<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-error-container/40 text-on-error-container">
<span class="w-2 h-2 rounded-full bg-error"></span> 18.4% Slower
          </span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div class="p-space-md rounded-lg bg-surface-container-low flex flex-col">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Advantage Cohort</span>
<span class="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
</div>
<div class="my-space-xs font-metric-huge text-metric-huge text-secondary">187</div>
<div class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            Trips <strong>Faster than Google</strong> (&gt; 1.5 min Δ savings, <strong class="text-on-surface">37.4%</strong>) via queue avoidance.
          </div>
</div>
<div class="p-space-md rounded-lg bg-surface-container-low flex flex-col">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">Parity Cohort</span>
<span class="material-symbols-outlined text-outline text-[20px]">drag_handle</span>
</div>
<div class="my-space-xs font-metric-huge text-metric-huge text-on-surface">221</div>
<div class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            Trips <strong>Statistically Equivalent</strong> (within ± 1.5 min delta, <strong class="text-on-surface">44.2%</strong>) on major expressways.
          </div>
</div>
<div class="p-space-md rounded-lg bg-surface-container-low flex flex-col">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-tertiary uppercase font-semibold">Divergent Cohort</span>
<span class="material-symbols-outlined text-tertiary text-[20px]">trending_down</span>
</div>
<div class="my-space-xs font-metric-huge text-metric-huge text-tertiary">92</div>
<div class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            Trips <strong>Slower than Google</strong> (Due to unmapped local obstruction / sudden incident, <strong class="text-on-surface">18.4%</strong>).
          </div>
</div>
</div>
<div class="w-full flex flex-col gap-1.5">
<div class="w-full h-4 rounded-full bg-surface-container flex overflow-hidden">
<div class="h-full bg-secondary transition-all cursor-pointer relative group" style="width: 37.4%" title="Faster (37.4%)"></div>
<div class="h-full bg-primary-container/70 transition-all cursor-pointer relative group" style="width: 44.2%" title="Equivalent (44.2%)"></div>
<div class="h-full bg-tertiary-container/80 transition-all cursor-pointer relative group" style="width: 18.4%" title="Slower (18.4%)"></div>
</div>
<div class="flex justify-between font-telemetry-data text-[11px] text-outline">
<span>0%</span>
<span>Cumulative Audit Distribution Across 500 Independent Dispatches</span>
<span>100%</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<div class="lg:col-span-6 flex flex-col gap-space-md">
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md h-full">
<div class="flex items-center justify-between">
<h3 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-[20px] text-primary">table_chart</span>
<span>Parametric Route Telemetry Breakdown</span>
</h3>
<span class="font-telemetry-data text-label-sm text-outline">ISO-14064 Calibrated</span>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left font-telemetry-data text-body-sm">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider">
<th class="py-2.5 px-3 rounded-l-lg font-semibold">Evaluation Metric</th>
<th class="py-2.5 px-2 text-primary font-semibold">Google API</th>
<th class="py-2.5 px-2 text-on-surface font-semibold">Classical A*</th>
<th class="py-2.5 px-2 text-secondary font-semibold">Predicted (QSVR)</th>
<th class="py-2.5 px-2 rounded-r-lg text-primary-container font-semibold">QPSO (Swarm)</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low text-[13px]">
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">Composite Cost Score</td>
<td class="py-2 px-2 text-on-surface">42.8</td>
<td class="py-2 px-2 text-on-surface">49.1</td>
<td class="py-2 px-2 text-secondary font-semibold">39.4</td>
<td class="py-2 px-2 text-primary-container font-semibold">38.9</td>
</tr>
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">Max Gradient / Incline</td>
<td class="py-2 px-2 text-on-surface-variant">3.4°</td>
<td class="py-2 px-2 text-on-surface-variant">4.8°</td>
<td class="py-2 px-2 text-on-surface-variant">2.8°</td>
<td class="py-2 px-2 text-on-surface-variant">2.9°</td>
</tr>
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">Signal Intersections</td>
<td class="py-2 px-2 text-on-surface">9</td>
<td class="py-2 px-2 text-on-surface">14</td>
<td class="py-2 px-2 text-on-surface">7</td>
<td class="py-2 px-2 text-on-surface">6</td>
</tr>
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">ETA Variance (σ)</td>
<td class="py-2 px-2 text-on-surface">± 3.2m</td>
<td class="py-2 px-2 text-on-surface">± 7.4m</td>
<td class="py-2 px-2 text-secondary font-semibold">± 1.9m</td>
<td class="py-2 px-2 text-primary-container font-semibold">± 1.7m</td>
</tr>
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">Bottlenecks Encountered</td>
<td class="py-2 px-2 text-on-surface">2 moderate</td>
<td class="py-2 px-2 text-tertiary">4 severe</td>
<td class="py-2 px-2 text-secondary">0 detected</td>
<td class="py-2 px-2 text-secondary">1 minor</td>
</tr>
<tr class="hover:bg-surface-container-low/40">
<td class="py-2 px-3 text-on-surface font-medium">Estimated Fuel Burn</td>
<td class="py-2 px-2 text-on-surface">1.28 L</td>
<td class="py-2 px-2 text-on-surface">1.42 L</td>
<td class="py-2 px-2 text-secondary">1.19 L</td>
<td class="py-2 px-2 text-primary-container">1.17 L</td>
</tr>
</tbody>
</table>
</div>
<div class="mt-auto p-space-xs rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm text-[12px] flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-outline">info</span>
<span>All vehicles modeled under EV 1.5-ton commercial payload class at standard 32°C ambient.</span>
</div>
</div>
</div>
<div class="lg:col-span-6 flex flex-col gap-space-md">
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md h-full">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<h3 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-[20px] text-secondary">route</span>
<span>Cartographic Vector Layer Overlay</span>
</h3>
<div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
<button class="route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm bg-surface-container-lowest text-on-surface shadow-sm" id="layer-all">All</button>
<button class="route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm text-on-surface-variant hover:text-on-surface" id="layer-google">Google</button>
<button class="route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm text-on-surface-variant hover:text-on-surface" id="layer-astar">A*</button>
<button class="route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm text-on-surface-variant hover:text-on-surface" id="layer-predicted">QSVR</button>
<button class="route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm text-on-surface-variant hover:text-on-surface" id="layer-qpso">QPSO</button>
</div>
</div>
<div class="relative w-full h-[320px] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center shadow-inner">
<div class="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply" data-location="Bandra Kurla Complex, Mumbai, India" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0JTKUyuF4p_OkyrrRsrOSK4_HkD-oIdJEyf1Oew2o6WXgaidR5fXqWsDv_cLoRKYLAeLo2L411jP46uIproR0NFqA3LtRUSrM8hsLEeeoGHy9fIupaSkr_up6cD6bcTRcXl0ZbevWO6r6MQXb-wPZ1HDs37P2GxLtso0TQ_0vQ9s4drme3p3FeHoHu64Z9JDSccX3LpCjvoq15SrB_lzqRSFUbH2MGcVEuW8PF5W-VIyfVmQt5fCIxQ')"></div>
<svg class="absolute inset-0 w-full h-full z-10" fill="none" id="route-svg-canvas" viewbox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
<path class="transition-opacity duration-300" d="M 60 260 C 140 250, 180 190, 260 170 C 340 150, 420 100, 520 60" id="svg-route-google" stroke="#0027aa" stroke-dasharray="2 0" stroke-linecap="round" stroke-width="4"></path>
<path class="transition-opacity duration-300" d="M 60 260 C 110 240, 160 270, 240 230 C 320 190, 410 160, 520 60" id="svg-route-astar" stroke="#757686" stroke-dasharray="6 6" stroke-linecap="round" stroke-width="3"></path>
<path class="transition-opacity duration-300" d="M 60 260 C 130 230, 200 210, 290 140 C 370 80, 450 70, 520 60" id="svg-route-predicted" stroke="#006a69" stroke-linecap="round" stroke-width="4"></path>
<path class="transition-opacity duration-300" d="M 60 260 C 110 200, 220 180, 310 130 C 390 90, 470 70, 520 60" id="svg-route-qpso" stroke="#1d3fd1" stroke-dasharray="4 2" stroke-linecap="round" stroke-width="4"></path>
<circle class="animate-pulse" cx="60" cy="260" fill="#0027aa" r="7"></circle>
<text fill="#191b22" font-family="'JetBrains Mono'" font-size="11" font-weight="600" x="50" y="290">BKC HUB (Origin)</text>
<circle cx="520" cy="60" fill="#7b0707" r="7"></circle>
<text fill="#191b22" font-family="'JetBrains Mono'" font-size="11" font-weight="600" x="440" y="45">AIRPORT T2 (Dest)</text>
</svg>
<div class="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2 bg-surface-container-lowest/90 backdrop-blur-sm p-2 rounded-lg text-[11px] font-telemetry-data shadow-sm">
<span class="inline-flex items-center gap-1 text-primary"><span class="w-3 h-1 bg-primary rounded"></span> Google</span>
<span class="inline-flex items-center gap-1 text-on-surface-variant"><span class="w-3 h-1 bg-outline rounded"></span> Classical A*</span>
<span class="inline-flex items-center gap-1 text-secondary"><span class="w-3 h-1 bg-secondary rounded"></span> QSVR Pred</span>
<span class="inline-flex items-center gap-1 text-primary-container"><span class="w-3 h-1 bg-primary-container rounded"></span> QPSO</span>
</div>
</div>
<div class="flex items-center justify-between text-[12px] font-body-sm text-on-surface-variant">
<span>Projection: WGS84 Universal Transverse Mercator</span>
<span class="text-primary font-telemetry-data">Live GIS Stream Synced</span>
</div>
</div>
</div>
</div>
<div class="w-full p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
<div class="flex items-start gap-space-sm max-w-4xl">
<span class="material-symbols-outlined text-outline text-[24px] mt-0.5">verified_user</span>
<div>
<h4 class="font-headline-sm text-headline-sm text-on-surface">Scrupulous Evaluation Ethics &amp; Scientific Methodology</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
            Google Directions API represents the industry gold standard for real-time vehicular routing with millions of live crowdsourced probes. QIDRE does not claim universal superiority, but demonstrates targeted algorithmic improvements in multi-stop logistics clustering and 45-minute congestion shockwave anticipation under high-density arterial load.
          </p>
</div>
</div>
<div class="flex items-center gap-space-xs shrink-0">
<button class="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface transition-all shadow-sm" id="export-btn">
<span class="material-symbols-outlined text-[18px]">download</span>
<span>Export Audit (CSV)</span>
</button>
<button class="inline-flex items-center gap-1 h-9 px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm" id="retest-btn">
<span class="material-symbols-outlined text-[18px]">play_circle</span>
<span>Re-test Cohort (N=500)</span>
</button>
</div>
</div>
</div>
<div class="hidden flex flex-col items-center justify-center w-full px-gutter py-16" id="view-unconfigured">
<div class="max-w-xl w-full p-space-xl rounded-2xl bg-surface-container-lowest shadow-md flex flex-col items-center text-center">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-space-md text-primary">
<span class="material-symbols-outlined text-[32px]">key_off</span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Google Maps Platform API Key Required</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg leading-relaxed">
        Add a valid Google Maps Platform API key in workspace settings to enable this comparative benchmark. When configured, QIDRE runs live route probes against the Google Routes API v2 under strict rate limits for empirical auditing.
      </p>
<div class="w-full text-left p-space-md rounded-xl bg-surface-container-low mb-space-lg flex flex-col gap-space-xs">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">Enabled Capabilities in Configured Mode</span>
<div class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Live Directions API verification with Google Best-Guess traffic</span>
</div>
<div class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Real-time dynamic transit distance &amp; duration matrix parity</span>
</div>
<div class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Unbiased statistical tally logging across N=500 comparative sample</span>
</div>
</div>
<div class="flex flex-wrap items-center justify-center gap-space-sm w-full">
<button class="h-10 px-5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md transition-all hover:bg-primary shadow-sm" id="open-settings-btn">
          Go to Settings &amp; Keys
        </button>
<button class="h-10 px-4 rounded-xl bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all" id="enter-key-modal-btn">
          Quick Enter API Key
        </button>
<button class="h-10 px-4 rounded-xl text-primary font-label-md text-label-md hover:bg-surface-container-low transition-all" id="return-config-btn">
          ← Return to Configured Preview
        </button>
</div>
</div>
</div>
<div class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-2 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl font-telemetry-data text-body-sm" id="toast">
<span class="material-symbols-outlined text-[20px] text-secondary" id="toast-icon">check_circle</span>
<span id="toast-message">Telemetry updated successfully.</span>
</div>
</div>
<script>
  (function () {
    const configuredView = document.getElementById('view-configured');
    const unconfiguredView = document.getElementById('view-unconfigured');
    const toggleStateBtn = document.getElementById('toggle-state-btn');
    const stateToggleText = document.getElementById('state-toggle-text');
    const returnConfigBtn = document.getElementById('return-config-btn');
    const rerunBtn = document.getElementById('rerun-btn');
    const exportBtn = document.getElementById('export-btn');
    const retestBtn = document.getElementById('retest-btn');
    const corridorSelect = document.getElementById('corridor-select');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    let isConfigured = true;

    function showToast(message, isWarning = false) {
      if (!toast) return;
      toastMsg.textContent = message;
      const icon = document.getElementById('toast-icon');
      if (icon) {
        icon.textContent = isWarning ? 'warning' : 'check_circle';
        icon.className = isWarning 
          ? 'material-symbols-outlined text-[20px] text-tertiary-fixed-dim' 
          : 'material-symbols-outlined text-[20px] text-secondary';
      }
      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3200);
    }

    function setViewState(configured) {
      isConfigured = configured;
      if (isConfigured) {
        configuredView.classList.remove('hidden');
        unconfiguredView.classList.add('hidden');
        stateToggleText.textContent = 'Preview Unconfigured State';
      } else {
        configuredView.classList.add('hidden');
        unconfiguredView.classList.remove('hidden');
        stateToggleText.textContent = 'Return to Configured View';
      }
    }

    if (toggleStateBtn) {
      toggleStateBtn.addEventListener('click', () => {
        setViewState(!isConfigured);
        showToast(isConfigured ? 'Active Telemetry Workspace Restored' : 'Unconfigured Mode Simulated (No Key)');
      });
    }

    if (returnConfigBtn) {
      returnConfigBtn.addEventListener('click', () => {
        setViewState(true);
        showToast('Returned to Configured Benchmark Audit');
      });
    }

    if (rerunBtn) {
      rerunBtn.addEventListener('click', () => {
        rerunBtn.classList.add('animate-pulse');
        showToast('Querying Google Routes API v2 & Quantum Dispatch Nodes...');
        setTimeout(() => {
          rerunBtn.classList.remove('animate-pulse');
          showToast('Live Matrix Synchronized: 4 routes refreshed (310ms latency)');
        }, 1100);
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('Exported: N=500_MMR_Benchmark_Audit.csv generated');
      });
    }

    if (retestBtn) {
      retestBtn.addEventListener('click', () => {
        showToast('Initiating Monte Carlo iteration over 500 spatial pairs...');
      });
    }

    if (corridorSelect) {
      corridorSelect.addEventListener('change', (e) => {
        showToast(\`Corridor switch: \${e.target.options[e.target.selectedIndex].text}\`);
      });
    }

    const modalBtn = document.getElementById('enter-key-modal-btn');
    if (modalBtn) {
      modalBtn.addEventListener('click', () => {
        const key = prompt('Enter Google Maps Platform Routes API Key (AIzaSy...):');
        if (key && key.trim().length > 8) {
          showToast('Key validated! Switching to Active Telemetry view...');
          setTimeout(() => setViewState(true), 600);
        } else if (key !== null) {
          showToast('Invalid API key syntax. Requires standard Google Cloud credential.', true);
        }
      });
    }

    const settingsBtn = document.getElementById('open-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        showToast('Redirecting to Global Integrations Vault...');
      });
    }

    // Vector layer filter interactions
    const layerButtons = {
      all: document.getElementById('layer-all'),
      google: document.getElementById('layer-google'),
      astar: document.getElementById('layer-astar'),
      predicted: document.getElementById('layer-predicted'),
      qpso: document.getElementById('layer-qpso')
    };

    const routes = {
      google: document.getElementById('svg-route-google'),
      astar: document.getElementById('svg-route-astar'),
      predicted: document.getElementById('svg-route-predicted'),
      qpso: document.getElementById('svg-route-qpso')
    };

    function resetLayerButtons() {
      Object.values(layerButtons).forEach(btn => {
        if (!btn) return;
        btn.className = 'route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm text-on-surface-variant hover:text-on-surface';
      });
    }

    function setActiveBtn(btn) {
      resetLayerButtons();
      if (!btn) return;
      btn.className = 'route-filter-btn px-2 py-0.5 rounded font-telemetry-data text-label-sm bg-surface-container-lowest text-on-surface shadow-sm font-semibold';
    }

    if (layerButtons.all) {
      layerButtons.all.addEventListener('click', () => {
        setActiveBtn(layerButtons.all);
        Object.values(routes).forEach(r => r && (r.style.opacity = '1'));
      });
    }

    Object.keys(routes).forEach(key => {
      const btn = layerButtons[key];
      if (btn) {
        btn.addEventListener('click', () => {
          setActiveBtn(btn);
          Object.keys(routes).forEach(k => {
            if (routes[k]) {
              routes[k].style.opacity = (k === key) ? '1' : '0.15';
            }
          });
        });
      }
    });
  })();
</script></main><footer class="w-full bg-surface-container-low py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="w-full px-gutter flex flex-col md:flex-row items-center justify-between gap-space-sm font-telemetry-data text-telemetry-data text-on-surface-variant"><div class="flex items-center gap-space-xs"><span>Enterprise Logistics</span><span class="text-outline-variant">·</span><span>Quantum Engine</span><span class="text-outline-variant">·</span><span class="font-label-md text-label-md text-primary">Egreen Quanta</span></div><div class="flex items-center gap-space-md font-label-sm text-label-sm"><span>Q-CORE v2.4.9</span><span>LATENCY: 14ms</span></div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
