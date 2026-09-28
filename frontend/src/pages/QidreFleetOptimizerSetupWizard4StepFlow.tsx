import React, { useEffect, useRef } from 'react';

export default function QidreFleetOptimizerSetupWizard4StepFlow({ navigate }: { navigate: (path: string) => void }) {
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
      dangerouslySetInnerHTML={{ __html: `<header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-20 w-full px-gutter md:px-margin max-w-7xl mx-auto flex items-center justify-between"><a class="group flex items-center gap-space-xs transition-opacity hover:opacity-80" data-path="landing-portal" href="#"><span class="font-['Orbitron'] text-headline-md tracking-[0.28em] text-primary-container font-bold uppercase select-none">QIDRE</span></a><div class="flex items-center gap-space-lg"><div class="hidden sm:flex items-center gap-space-xs px-space-xs py-1 rounded-full bg-surface-container-low"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Node Active</span></div><nav class="flex items-center gap-space-md" data-active-classes="text-primary-container font-semibold"><a class="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center" data-path="benchmarks" href="#">Benchmarks →</a></nav><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full pb-space-xl">
<!-- Centered Wizard Container (Max-Width 740px) -->
<div class="w-full max-w-[740px] mx-auto px-gutter-mobile md:px-0">
<!-- Top Meta Context Bar -->
<div class="flex items-center justify-between py-space-sm mb-space-xs text-on-surface-variant">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-[18px] text-primary">memory</span>
<span class="font-label-sm text-label-sm tracking-widest uppercase text-primary font-semibold">QPSO Solver Engine v2.4</span>
</div>
<div class="flex items-center gap-space-xs font-telemetry-data text-telemetry-data text-outline">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Auto-sync active</span>
</div>
</div>
<!-- Stepper Navigation Module -->
<div class="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-md">
<nav aria-label="Optimization Setup Pipeline" class="relative">
<!-- Connecting Line Behind Nodes -->
<div class="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-surface-container pointer-events-none -z-0">
<div class="h-full bg-secondary transition-all duration-300 w-0" id="stepper-progress-fill"></div>
</div>
<ul class="relative z-10 flex items-center justify-between list-none p-0 m-0">
<!-- Step 1 Trigger -->
<li class="flex-1 flex flex-col items-center">
<button aria-label="Step 1: Area" class="group flex flex-col items-center focus:outline-none" onclick="goToStep(1)" type="button">
<span class="w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-tertiary-container text-on-primary shadow-sm ring-4 ring-tertiary-fixed" id="step-indicator-1">
                1
              </span>
<span class="mt-space-xs font-label-md text-label-md font-semibold text-on-surface" id="step-label-1">Area</span>
</button>
</li>
<!-- Step 2 Trigger -->
<li class="flex-1 flex flex-col items-center">
<button aria-label="Step 2: Depot and Deliveries" class="group flex flex-col items-center focus:outline-none" onclick="goToStep(2)" type="button">
<span class="w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-surface-container-low text-primary ring-2 ring-primary" id="step-indicator-2">
                2
              </span>
<span class="mt-space-xs font-label-md text-label-md text-outline" id="step-label-2">Depot &amp; Stops</span>
</button>
</li>
<!-- Step 3 Trigger -->
<li class="flex-1 flex flex-col items-center">
<button aria-label="Step 3: Fleet Allocation" class="group flex flex-col items-center focus:outline-none" onclick="goToStep(3)" type="button">
<span class="w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-surface-container-low text-primary ring-2 ring-primary" id="step-indicator-3">
                3
              </span>
<span class="mt-space-xs font-label-md text-label-md text-outline" id="step-label-3">Fleet Units</span>
</button>
</li>
<!-- Step 4 Trigger -->
<li class="flex-1 flex flex-col items-center">
<button aria-label="Step 4: Engine Constraints" class="group flex flex-col items-center focus:outline-none" onclick="goToStep(4)" type="button">
<span class="w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-surface-container-low text-primary ring-2 ring-primary" id="step-indicator-4">
                4
              </span>
<span class="mt-space-xs font-label-md text-label-md text-outline" id="step-label-4">Constraints</span>
</button>
</li>
</ul>
</nav>
</div>
<!-- Main Wizard Card Container -->
<div class="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-xl flex flex-col">
<!-- ================= STEP 1: AREA SELECTION ================= -->
<section class="wizard-panel flex flex-col" id="step-content-1">
<header class="mb-space-md">
<div class="flex items-center gap-space-xs text-primary font-telemetry-data text-label-sm uppercase tracking-widest font-semibold mb-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Step 01 of 04 · Area Selection
          </div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Choose Your Operating Area</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
            Designate the computational boundary for high-density quantum particle route clustering.
          </p>
</header>
<!-- Geospatial Mock Grid & Sectors -->
<div class="relative w-full h-[260px] bg-surface-container-low rounded-xl overflow-hidden mb-space-md flex flex-col justify-between p-space-md select-none">
<!-- Geometric vector grid backdrop -->
<svg class="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="40" id="road-grid" patternunits="userSpaceOnUse" width="40">
<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#bac3ff" stroke-dasharray="2 2" stroke-width="0.75"></path>
<circle cx="20" cy="20" fill="#757686" opacity="0.3" r="1"></circle>
</pattern>
</defs>
<rect fill="url(#road-grid)" height="100%" width="100%"></rect>
<!-- Major arterials -->
<path d="M-20,130 C120,90 280,180 500,120 S680,240 760,190" fill="none" opacity="0.6" stroke="#1d3fd1" stroke-width="2.5"></path>
<path d="M180,-20 C220,100 240,160 310,280" fill="none" opacity="0.5" stroke="#1d3fd1" stroke-width="1.75"></path>
<path d="M420,-10 C410,120 460,200 490,290" fill="none" opacity="0.5" stroke="#1d3fd1" stroke-width="2"></path>
</svg>
<!-- Status badge pinned on map top-left -->
<div class="relative z-10 flex items-center justify-between w-full">
<div class="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-sm">
<span class="material-symbols-outlined text-[16px] text-secondary">explore</span>
<span class="font-telemetry-data text-label-sm font-semibold text-on-surface">MUMBAI METROPOLITAN REGION</span>
</div>
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase font-semibold">
<span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Live Geofence
            </div>
</div>
<!-- Dynamic SVG Sector Polygons -->
<div class="relative z-10 w-full h-full flex items-center justify-center">
<!-- BKC Interactive Polygon -->
<div class="absolute top-[35%] left-[34%] px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 bg-secondary text-on-secondary shadow-md ring-2 ring-tertiary-container flex flex-col items-center" id="map-poly-bkc" onclick="selectArea('BKC')">
<span class="font-display-hero text-label-md font-bold tracking-wider">BKC SECTOR</span>
<span class="font-telemetry-data text-[10px] uppercase text-secondary-fixed">ACTIVE SECTOR</span>
</div>
<!-- Churchgate Polygon -->
<div class="absolute bottom-[14%] left-[12%] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 bg-surface-container-lowest/80 text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container shadow-sm flex flex-col items-center" id="map-poly-churchgate" onclick="selectArea('Churchgate')">
<span class="font-display-hero text-body-sm font-semibold">Churchgate</span>
<span class="font-telemetry-data text-[9px] text-outline">South Zone</span>
</div>
<!-- Lower Parel Polygon -->
<div class="absolute top-[48%] left-[20%] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 bg-surface-container-lowest/80 text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container shadow-sm flex flex-col items-center" id="map-poly-lower-parel" onclick="selectArea('Lower Parel')">
<span class="font-display-hero text-body-sm font-semibold">Lower Parel</span>
<span class="font-telemetry-data text-[9px] text-outline">Central West</span>
</div>
<!-- Andheri Polygon -->
<div class="absolute top-[16%] left-[45%] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 bg-surface-container-lowest/80 text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container shadow-sm flex flex-col items-center" id="map-poly-andheri" onclick="selectArea('Andheri')">
<span class="font-display-hero text-body-sm font-semibold">Andheri MIDC</span>
<span class="font-telemetry-data text-[9px] text-outline">Western Suburbs</span>
</div>
<!-- Powai Polygon -->
<div class="absolute top-[18%] right-[16%] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 bg-surface-container-lowest/80 text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container shadow-sm flex flex-col items-center" id="map-poly-powai" onclick="selectArea('Powai')">
<span class="font-display-hero text-body-sm font-semibold">Powai Tech Basin</span>
<span class="font-telemetry-data text-[9px] text-outline">Eastern Cluster</span>
</div>
</div>
<!-- Bottom map overlay coordinates -->
<div class="relative z-10 flex items-center justify-between text-outline font-telemetry-data text-[11px]">
<span>19.0657° N, 72.8687° E</span>
<span>Projection: WGS 84 / UTM 43N</span>
</div>
</div>
<!-- Quick Selectable Pill Chips -->
<div class="mb-space-md">
<label class="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-space-xs">
            Quick Sector Select
          </label>
<div class="flex flex-wrap gap-space-xs" id="area-chips">
<button class="area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-semibold transition-all bg-secondary text-on-secondary shadow-sm" onclick="selectArea('BKC')" type="button">
              BKC Hub (Selected)
            </button>
<button class="area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-medium transition-all bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="selectArea('Churchgate')" type="button">
              Churchgate
            </button>
<button class="area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-medium transition-all bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="selectArea('Lower Parel')" type="button">
              Lower Parel
            </button>
<button class="area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-medium transition-all bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="selectArea('Andheri')" type="button">
              Andheri MIDC
            </button>
<button class="area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-medium transition-all bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="selectArea('Powai')" type="button">
              Powai
            </button>
</div>
</div>
<!-- Sector Summary Confirmation Box -->
<div class="rounded-xl bg-surface-container-low p-space-md flex items-start gap-space-md mb-space-lg">
<div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 text-secondary">
<span class="material-symbols-outlined text-[24px]">verified</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center gap-space-xs mb-0.5">
<span class="font-label-sm text-label-sm font-semibold uppercase text-secondary">Sector Assigned</span>
<span class="font-telemetry-data text-[11px] text-outline">#MMR-SEC-04</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-semibold" id="sector-summary-text">
              Mumbai BKC Commercial Hub
            </p>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              42.6 km² boundary area · Estimated 120+ active daily freight nodes configured for QPSO clustering.
            </p>
</div>
</div>
</section>
<!-- ================= STEP 2: DEPOT & DELIVERIES ================= -->
<section class="wizard-panel hidden flex-col" id="step-content-2">
<header class="mb-space-md">
<div class="flex items-center gap-space-xs text-primary font-telemetry-data text-label-sm uppercase tracking-widest font-semibold mb-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Step 02 of 04 · Dispatch Topology
          </div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Depot &amp; Deliveries</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
            Anchor the primary central cross-dock and verify sequential drop stops.
          </p>
</header>
<!-- Split Layout Grid -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-space-md mb-space-lg">
<!-- Left Column: Search & Delivery Stops -->
<div class="md:col-span-7 flex flex-col gap-space-md">
<!-- Depot Address Input Field -->
<div class="flex flex-col gap-space-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider flex items-center justify-between">
<span>Primary Depot Hub</span>
<span class="text-secondary font-telemetry-data text-[11px] normal-case">Fixed Node #0</span>
</label>
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-3 text-[20px] text-primary">store</span>
<input class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container" type="text" value="BKC Central Fulfillment Hub, G Block"/>
</div>
<!-- Toggle switch for map pin -->
<div class="flex items-center justify-between mt-1 px-1">
<span class="font-body-sm text-body-sm text-on-surface-variant">Direct pin positioning enabled on map</span>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-9 h-5 bg-surface-container rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
</label>
</div>
</div>
<!-- Staged Stops Header -->
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Staged Drop Stops</span>
<span class="px-2 py-0.5 rounded-full bg-surface-container font-telemetry-data text-label-sm text-primary font-bold">4</span>
</div>
<button class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">upload_file</span>
                Import CSV
              </button>
</div>
<!-- Staged Deliveries List -->
<div class="flex flex-col gap-space-xs">
<!-- Stop 1 -->
<div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-space-sm min-w-0">
<span class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shrink-0">1</span>
<div class="truncate">
<div class="font-body-md text-body-md font-semibold text-on-surface truncate">Phoenix Marketcity Depot</div>
<div class="font-telemetry-data text-body-sm text-on-surface-variant truncate">LBS Marg, Kurla West · 140 kg</div>
</div>
</div>
<div class="flex items-center gap-2 shrink-0">
<span class="font-telemetry-data text-body-sm text-outline">10:30 SLA</span>
<button aria-label="Remove stop" class="text-outline hover:text-error transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Stop 2 -->
<div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-space-sm min-w-0">
<span class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shrink-0">2</span>
<div class="truncate">
<div class="font-body-md text-body-md font-semibold text-on-surface truncate">MIDC Cross-Dock C-12</div>
<div class="font-telemetry-data text-body-sm text-on-surface-variant truncate">Central Road, Andheri East · 280 kg</div>
</div>
</div>
<div class="flex items-center gap-2 shrink-0">
<span class="font-telemetry-data text-body-sm text-outline">11:15 SLA</span>
<button aria-label="Remove stop" class="text-outline hover:text-error transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Stop 3 -->
<div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-space-sm min-w-0">
<span class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shrink-0">3</span>
<div class="truncate">
<div class="font-body-md text-body-md font-semibold text-on-surface truncate">Bandra West Retail Hub</div>
<div class="font-telemetry-data text-body-sm text-on-surface-variant truncate">Linking Road Junction · 85 kg</div>
</div>
</div>
<div class="flex items-center gap-2 shrink-0">
<span class="font-telemetry-data text-body-sm text-outline">12:00 SLA</span>
<button aria-label="Remove stop" class="text-outline hover:text-error transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Stop 4 -->
<div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-space-sm min-w-0">
<span class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shrink-0">4</span>
<div class="truncate">
<div class="font-body-md text-body-md font-semibold text-on-surface truncate">Worli Express Terminal</div>
<div class="font-telemetry-data text-body-sm text-on-surface-variant truncate">Dr E Moses Rd, Worli · 190 kg</div>
</div>
</div>
<div class="flex items-center gap-2 shrink-0">
<span class="font-telemetry-data text-body-sm text-outline">13:30 SLA</span>
<button aria-label="Remove stop" class="text-outline hover:text-error transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Ghost Add Delivery Button -->
<button class="w-full py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">add_location_alt</span>
                + Add Delivery Stop
              </button>
</div>
</div>
<!-- Right Column: Vector Map Route Preview -->
<div class="md:col-span-5 flex flex-col">
<div class="relative w-full h-full min-h-[320px] bg-surface-container-low rounded-xl overflow-hidden p-space-md flex flex-col justify-between">
<!-- Subtle Map Visual Representation -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
<!-- Trajectory Connecting Lines -->
<!-- Depot to Stop 1 -->
<path d="M140,160 L80,90" fill="none" stroke="#006a69" stroke-dasharray="4 3" stroke-width="2"></path>
<!-- Stop 1 to Stop 2 -->
<path d="M80,90 L210,60" fill="none" stroke="#006a69" stroke-dasharray="4 3" stroke-width="2"></path>
<!-- Stop 2 to Stop 3 -->
<path d="M210,60 L60,220" fill="none" stroke="#006a69" stroke-dasharray="4 3" stroke-width="2"></path>
<!-- Stop 3 to Stop 4 -->
<path d="M60,220 L190,240" fill="none" stroke="#006a69" stroke-dasharray="4 3" stroke-width="2"></path>
<!-- Stop 4 back to Depot -->
<path d="M190,240 L140,160" fill="none" opacity="0.4" stroke="#1d3fd1" stroke-dasharray="2 2" stroke-width="1.5"></path>
</svg>
<!-- Header Tag -->
<div class="relative z-10 flex items-center justify-between">
<span class="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 font-telemetry-data text-[11px] text-on-surface font-semibold shadow-sm">
                  ROUTE TRAJECTORY SIM
                </span>
<span class="font-telemetry-data text-[11px] text-secondary font-bold">QPSO-OPT #1</span>
</div>
<!-- Interactive Node Pins on Vector Canvas -->
<div class="relative z-10 w-full h-full">
<!-- Central Depot Pin (Cobalt Square) -->
<div class="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-md">
<span class="material-symbols-outlined text-[18px]">warehouse</span>
</div>
<span class="font-telemetry-data text-[9px] font-bold text-primary bg-surface-container-lowest/90 px-1.5 py-0.5 rounded mt-1 shadow-sm">DEPOT-01</span>
</div>
<!-- Stop 1 (Phoenix) -->
<div class="absolute top-[26%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shadow-md">1</div>
<span class="font-label-sm text-[9px] text-on-surface bg-surface-container-lowest/90 px-1 rounded shadow-xs mt-0.5">Phoenix</span>
</div>
<!-- Stop 2 (MIDC) -->
<div class="absolute top-[16%] right-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shadow-md">2</div>
<span class="font-label-sm text-[9px] text-on-surface bg-surface-container-lowest/90 px-1 rounded shadow-xs mt-0.5">MIDC</span>
</div>
<!-- Stop 3 (Bandra West) -->
<div class="absolute bottom-[28%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shadow-md">3</div>
<span class="font-label-sm text-[9px] text-on-surface bg-surface-container-lowest/90 px-1 rounded shadow-xs mt-0.5">Bandra</span>
</div>
<!-- Stop 4 (Worli) -->
<div class="absolute bottom-[20%] right-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div class="w-6 h-6 rounded-full bg-tertiary-container text-on-primary font-display-hero text-[11px] flex items-center justify-center shadow-md">4</div>
<span class="font-label-sm text-[9px] text-on-surface bg-surface-container-lowest/90 px-1 rounded shadow-xs mt-0.5">Worli</span>
</div>
</div>
<!-- Route Metric Summary Footer -->
<div class="relative z-10 p-2.5 rounded-lg bg-surface-container-lowest/95 backdrop-blur shadow-sm flex items-center justify-between text-body-sm">
<div>
<span class="text-outline block text-[10px] uppercase font-label-sm">Gross Transit</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">38.4 km</span>
</div>
<div class="text-right">
<span class="text-outline block text-[10px] uppercase font-label-sm">Load Utilization</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">695 kg / 1.2T</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- ================= STEP 3: FLEET ALLOCATION ================= -->
<section class="wizard-panel hidden flex-col" id="step-content-3">
<header class="mb-space-md">
<div class="flex items-center gap-space-xs text-primary font-telemetry-data text-label-sm uppercase tracking-widest font-semibold mb-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Step 03 of 04 · Vehicle Allocation
          </div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Configure Fleet Units</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
            Assign active vehicle archetypes for payload constraints and energy optimization.
          </p>
</header>
<!-- Repeatable Fleet Cards List -->
<div class="flex flex-col gap-space-md mb-space-lg">
<!-- Card 1: Tata Ace EV -->
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-display-hero text-body-md">
<span class="material-symbols-outlined text-[22px]">electric_bolt</span>
</div>
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Tata Ace EV (EV-01)</h2>
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm text-secondary font-semibold">Electric Light Commercial</span>
<span class="text-outline">·</span>
<span class="font-telemetry-data text-body-sm text-outline">Reg #MH-02-EQ-8812</span>
</div>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  100% Battery
                </span>
<button aria-label="Vehicle settings" class="text-outline hover:text-on-surface p-1" type="button">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>
<!-- Parameters Grid -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs text-on-surface">
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Payload Cap</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">500 kg</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Cost Metric</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">₹18 / km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Operational Range</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">120 km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Dispatch Priority</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">Tier 1 (Eco)</span>
</div>
</div>
</div>
<!-- Card 2: Bolero Maxi Truck -->
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-display-hero text-body-md">
<span class="material-symbols-outlined text-[22px]">local_shipping</span>
</div>
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Bolero Maxi Truck (TRK-02)</h2>
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm text-primary font-semibold">Heavy Duty Diesel</span>
<span class="text-outline">·</span>
<span class="font-telemetry-data text-body-sm text-outline">Reg #MH-04-FD-4109</span>
</div>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-telemetry-data text-label-sm font-semibold text-on-surface">
                  Diesel Fuel (Full)
                </span>
<button aria-label="Vehicle settings" class="text-outline hover:text-on-surface p-1" type="button">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>
<!-- Parameters Grid -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs text-on-surface">
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Payload Cap</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">1,200 kg</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Cost Metric</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">₹24 / km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Operational Range</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">250 km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Dispatch Priority</span>
<span class="font-telemetry-data text-body-md font-bold text-primary">Heavy Freight</span>
</div>
</div>
</div>
<!-- Card 3: E-Rickshaw Cargo -->
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-display-hero text-body-md">
<span class="material-symbols-outlined text-[22px]">moped</span>
</div>
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface">E-Rickshaw Cargo (EV-03)</h2>
<div class="flex items-center gap-space-xs">
<span class="font-label-sm text-label-sm text-secondary font-semibold">Micro Last-Mile EV</span>
<span class="text-outline">·</span>
<span class="font-telemetry-data text-body-sm text-outline">Reg #MH-01-CR-2290</span>
</div>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  94% Battery
                </span>
<button aria-label="Vehicle settings" class="text-outline hover:text-on-surface p-1" type="button">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>
<!-- Parameters Grid -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs text-on-surface">
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Payload Cap</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">250 kg</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Cost Metric</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">₹10 / km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Operational Range</span>
<span class="font-telemetry-data text-body-md font-bold text-on-surface">80 km</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low">
<span class="font-label-sm text-[11px] uppercase tracking-wider text-outline block">Dispatch Priority</span>
<span class="font-telemetry-data text-body-md font-bold text-secondary">Congestion Bypass</span>
</div>
</div>
</div>
<!-- Ghost Card: Add Vehicle -->
<button class="w-full py-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row items-center justify-center gap-space-xs text-primary shadow-xs group" type="button">
<span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[20px]">add</span>
</span>
<span class="font-headline-sm text-headline-sm font-semibold">+ Add Vehicle to Pool</span>
</button>
</div>
</section>
<!-- ================= STEP 4: CONSTRAINTS & BIAS ================= -->
<section class="wizard-panel hidden flex-col" id="step-content-4">
<header class="mb-space-md">
<div class="flex items-center gap-space-xs text-primary font-telemetry-data text-label-sm uppercase tracking-widest font-semibold mb-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Step 04 of 04 · Quantum Engine Bias
          </div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Optimization Constraints</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
            Calibrate objective weights within the Quantum Particle Swarm (QPSO) cost tensor.
          </p>
</header>
<!-- Interactive Toggles List -->
<div class="flex flex-col gap-space-sm mb-space-lg">
<!-- Constraint 1: Strict Capacity Limits -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div class="flex-1">
<div class="flex items-center gap-space-xs mb-1">
<span class="material-symbols-outlined text-[20px] text-secondary">weight</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Volumetric &amp; Payload Strict Cap (95% Threshold)</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                Prevents vehicle overload and dynamic reroutes during transit by clamping total mass to 95% rated max.
              </p>
<div class="mt-2 inline-flex items-center gap-1 font-telemetry-data text-[11px] text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Active heuristic parameter: penalty_lambda = 4.8e3</span>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
</label>
</div>
<!-- Constraint 2: Max Distance Clustering -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div class="flex-1">
<div class="flex items-center gap-space-xs mb-1">
<span class="material-symbols-outlined text-[20px] text-secondary">hub</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Hard 40km Distance Radius per Cluster</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                QPSO will subdivide long-tail nodes into distinct delivery zones, preventing cross-city zigzag dispatches.
              </p>
<div class="mt-2 inline-flex items-center gap-1 font-telemetry-data text-[11px] text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Spatial limit: R_max = 40,000m radial</span>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
</label>
</div>
<!-- Constraint 3: Priority SLA Handling -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div class="flex-1">
<div class="flex items-center gap-space-xs mb-1">
<span class="material-symbols-outlined text-[20px] text-secondary">timer</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">High-Priority Express SLA Weight Bias</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                Applies exponential penalty in QPSO fitness function for time-sensitive deliveries arriving past deadline.
              </p>
<div class="mt-2 inline-flex items-center gap-1 font-telemetry-data text-[11px] text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>SLA loss multiplier: factor 2.5x</span>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
</label>
</div>
<!-- Constraint 4: Toll Avoidance & Eco-Tuning -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div class="flex-1">
<div class="flex items-center gap-space-xs mb-1">
<span class="material-symbols-outlined text-[20px] text-secondary">eco</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Green Corridor &amp; Emissions Minimization</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                Weights EV routing through low-congestion avenues and dynamically penalizes ICE vehicle carbon output.
              </p>
<div class="mt-2 inline-flex items-center gap-1 font-telemetry-data text-[11px] text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Carbon factor active: EV offset priority</span>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
</label>
</div>
</div>
</section>
<!-- Persistent Bottom Action Bar -->
<footer class="pt-space-md border-t-0 flex flex-col sm:flex-row items-center justify-between gap-space-md select-none">
<!-- Back Navigation Button -->
<button class="inline-flex items-center gap-1.5 font-label-md text-label-md text-outline hover:text-on-surface transition-colors py-2 px-1 focus:outline-none" id="btn-back" onclick="previousStep()" type="button">
<span class="material-symbols-outlined text-[18px]">arrow_back</span>
<span>Back</span>
</button>
<!-- Autosave Indicator -->
<div class="flex items-center gap-1.5 font-telemetry-data text-label-sm text-outline">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
<span>Saved to local node</span>
</div>
<!-- Primary Forward Action CTA -->
<button class="w-full sm:w-auto px-space-lg py-2.5 rounded-xl bg-tertiary-container hover:bg-tertiary-container/90 text-on-primary font-display-hero text-body-md font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-space-xs" id="btn-next" onclick="nextStep()" type="button">
<span id="btn-next-label">NEXT (STEP 2) →</span>
</button>
</footer>
</div>
</div>
</div>
<script>
  let currentStep = 1;
  const totalSteps = 4;

  const areaProfiles = {
    'BKC': {
      title: 'Mumbai BKC Commercial Hub',
      desc: '42.6 km² boundary area · Estimated 120+ active daily freight nodes configured for QPSO clustering.'
    },
    'Churchgate': {
      title: 'Churchgate & Fort Financial District',
      desc: '18.4 km² heritage zone · Strict time-window constraints and narrow alleyway EV micro-routing.'
    },
    'Lower Parel': {
      title: 'Lower Parel Commercial Basin',
      desc: '24.1 km² high-rise corridor · Optimized for subterranean loading bays and high-volume freight.'
    },
    'Andheri': {
      title: 'Andheri MIDC Industrial Sector',
      desc: '56.8 km² heavy manufacturing zone · High payload capacity truck prioritization active.'
    },
    'Powai': {
      title: 'Powai Technology & Residential Zone',
      desc: '31.2 km² lakeside topography · Elevation gradient energy minimization enabled.'
    }
  };

  function selectArea(areaKey) {
    const data = areaProfiles[areaKey];
    if (!data) return;

    // Update text summary
    const summaryText = document.getElementById('sector-summary-text');
    if (summaryText) summaryText.textContent = data.title;
    
    // Update chip styling
    const chips = document.querySelectorAll('.area-chip');
    chips.forEach(chip => {
      const match = chip.textContent.includes(areaKey);
      if (match) {
        chip.className = 'area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-semibold transition-all bg-secondary text-on-secondary shadow-sm';
        chip.textContent = areaKey + ' (Selected)';
      } else {
        chip.className = 'area-chip px-3 py-1.5 rounded-full font-label-md text-label-md font-medium transition-all bg-surface-container hover:bg-surface-container-high text-on-surface';
        chip.textContent = chip.textContent.replace(' (Selected)', '');
      }
    });

    // Update map polygon highlight
    ['bkc', 'churchgate', 'lower-parel', 'andheri', 'powai'].forEach(slug => {
      const poly = document.getElementById('map-poly-' + slug);
      if (!poly) return;
      const isTarget = (slug === 'lower-parel' && areaKey === 'Lower Parel') ||
                       (slug === 'andheri' && areaKey === 'Andheri') ||
                       (slug === areaKey.toLowerCase());
      
      if (isTarget) {
        poly.className = 'absolute px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 bg-secondary text-on-secondary shadow-md ring-2 ring-tertiary-container flex flex-col items-center z-20';
        const tag = poly.querySelector('span:last-child');
        if (tag) {
          tag.className = 'font-telemetry-data text-[10px] uppercase text-secondary-fixed';
          tag.textContent = 'ACTIVE SECTOR';
        }
      } else {
        poly.className = 'absolute px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 bg-surface-container-lowest/80 text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container shadow-sm flex flex-col items-center';
        const tag = poly.querySelector('span:last-child');
        if (tag) {
          tag.className = 'font-telemetry-data text-[9px] text-outline';
          tag.textContent = 'Standby Zone';
        }
      }
    });
  }

  function updateStepperUI() {
    // Progress line width
    const progressFill = document.getElementById('stepper-progress-fill');
    if (progressFill) {
      const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressFill.style.width = percent + '%';
    }

    for (let step = 1; step <= totalSteps; step++) {
      const indicator = document.getElementById(\`step-indicator-\${step}\`);
      const label = document.getElementById(\`step-label-\${step}\`);
      if (!indicator || !label) continue;

      if (step < currentStep) {
        // Completed Step: Filled teal circle with checkmark
        indicator.className = 'w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-secondary text-on-secondary shadow-sm ring-0';
        indicator.innerHTML = '<span class="material-symbols-outlined text-[20px]">check</span>';
        label.className = 'mt-space-xs font-label-md text-label-md font-semibold text-on-surface';
      } else if (step === currentStep) {
        // Active Step: Filled coral circle with numeral
        indicator.className = 'w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-tertiary-container text-on-primary shadow-sm ring-4 ring-tertiary-fixed';
        indicator.innerHTML = step;
        label.className = 'mt-space-xs font-label-md text-label-md font-semibold text-on-surface';
      } else {
        // Upcoming Step: Outlined cobalt circle
        indicator.className = 'w-9 h-9 rounded-full flex items-center justify-center font-display-hero text-body-md transition-all duration-200 bg-surface-container-low text-primary ring-2 ring-primary';
        indicator.innerHTML = step;
        label.className = 'mt-space-xs font-label-md text-label-md text-outline';
      }
    }

    // Toggle Panels
    for (let step = 1; step <= totalSteps; step++) {
      const panel = document.getElementById(\`step-content-\${step}\`);
      if (panel) {
        if (step === currentStep) {
          panel.classList.remove('hidden');
          panel.classList.add('flex');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('flex');
        }
      }
    }

    // Toggle Back button visibility/opacity
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
      if (currentStep === 1) {
        btnBack.classList.add('opacity-40', 'pointer-events-none');
      } else {
        btnBack.classList.remove('opacity-40', 'pointer-events-none');
      }
    }

    // Update Next Button Label
    const nextLabel = document.getElementById('btn-next-label');
    const nextBtn = document.getElementById('btn-next');
    if (nextLabel && nextBtn) {
      if (currentStep === totalSteps) {
        nextLabel.textContent = 'REVIEW & OPTIMIZE 🚀';
        nextBtn.className = 'w-full sm:w-auto px-space-lg py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-primary font-display-hero text-body-md font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-space-xs';
      } else {
        nextLabel.textContent = \`NEXT (STEP \${currentStep + 1}) →\`;
        nextBtn.className = 'w-full sm:w-auto px-space-lg py-2.5 rounded-xl bg-tertiary-container hover:bg-tertiary-container/90 text-on-primary font-display-hero text-body-md font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-space-xs';
      }
    }
  }

  function goToStep(step) {
    if (step >= 1 && step <= totalSteps) {
      currentStep = step;
      updateStepperUI();
    }
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepperUI();
    } else {
      // Trigger execution event
      const nextBtn = document.getElementById('btn-next');
      if (nextBtn) {
        nextBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> <span>SOLVING QPSO TENSOR...</span>';
        setTimeout(() => {
          alert('🚀 QIDRE Quantum PSO optimization sequence triggered for Mumbai BKC Sector!');
          nextBtn.innerHTML = '<span id="btn-next-label">REVIEW &amp; OPTIMIZE 🚀</span>';
        }, 1200);
      }
    }
  }

  function previousStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepperUI();
    }
  }

  // Initialize view
  document.addEventListener('DOMContentLoaded', () => {
    updateStepperUI();
  });
</script></main><footer class="w-full bg-surface-container-lowest py-space-xl"><div class="w-full max-w-7xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left"><div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase"><span class="font-semibold text-on-surface">SIH 2026</span><span>·</span><span>Quantum Technology Vertical</span><span>·</span><span class="text-secondary">Egreen Quanta</span></div><div class="font-label-sm text-label-sm text-outline tracking-wider">© 2026 QIDRE Algorithmic Routing Engine</div></div></footer>` }} 
      className="w-full h-full"
    />
  );
}
