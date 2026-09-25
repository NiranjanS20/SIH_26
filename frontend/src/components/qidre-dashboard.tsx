import { useEffect, useMemo, useState, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Atom,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cloud,
  Gauge,
  GitCompareArrows,
  Leaf,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Network,
  PackageCheck,
  Plus,
  Route as RouteIcon,
  Satellite,
  Settings2,
  Sparkles,
  Target,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type View = "home" | "compare" | "fleet";

const convergenceData = [
  { i: 0, qpso: 96, baseline: 96 },
  { i: 10, qpso: 73, baseline: 85 },
  { i: 20, qpso: 49, baseline: 76 },
  { i: 30, qpso: 32, baseline: 69 },
  { i: 40, qpso: 21, baseline: 63 },
  { i: 50, qpso: 14, baseline: 59 },
];

const gapData = [
  { i: "08:00", gap: 12.8 },
  { i: "10:00", gap: 9.2 },
  { i: "12:00", gap: 6.7 },
  { i: "14:00", gap: 4.1 },
  { i: "16:00", gap: 2.4 },
  { i: "18:00", gap: 1.6 },
];

function Logo() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative grid size-9 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 shadow-neon-cyan">
        <Atom className="size-5 text-primary" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-status shadow-neon-status" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-lg font-bold leading-none tracking-normal text-foreground">QIDRE</div>
        <div className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
          Quantum route engine
        </div>
      </div>
    </div>
  );
}

const navigation: Array<{ id: View; label: string; icon: typeof Map }> = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "compare", label: "Compare Routes", icon: GitCompareArrows },
  { id: "fleet", label: "Fleet Optimizer", icon: Truck },
];

function TopNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <header className="relative z-30 flex h-[68px] shrink-0 items-center justify-between border-b border-border/70 bg-surface/70 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Logo />
      <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-1 rounded-md border border-border/70 bg-muted/50 p-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.id === view;
          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={active}
              onClick={() => onChange(item.id)}
              className={cn(
                "h-8 gap-2 px-2.5 text-muted-foreground hover:bg-accent/60 hover:text-foreground sm:px-3",
                active && "bg-accent text-foreground shadow-neon-soft",
              )}
            >
              <Icon className={cn("size-3.5", active && "text-primary")} />
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden">{item.id === "compare" ? "Compare" : item.id === "fleet" ? "Fleet" : "Home"}</span>
            </Button>
          );
        })}
      </nav>
      <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-status opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-status" />
        </span>
        Systems nominal
      </div>
    </header>
  );
}

function RouteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <svg viewBox="0 0 1440 720" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
        <defs>
          <linearGradient id="hero-route" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--quantum)" />
          </linearGradient>
          <filter id="hero-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M-60 590 C210 520 210 220 510 310 S790 600 1010 400 1210 150 1500 240" fill="none" stroke="url(#hero-route)" strokeWidth="2" strokeDasharray="10 10" filter="url(#hero-glow)" />
        <path d="M110 40 C240 210 430 115 610 190 S860 360 1100 230 1320 300 1470 490" fill="none" stroke="var(--map-line)" strokeWidth="1" />
        {[170, 510, 800, 1090, 1290].map((x, i) => <circle key={x} cx={x} cy={[520, 310, 510, 330, 205][i]} r="5" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />)}
      </svg>
      <div className="absolute left-[12%] top-[18%] size-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[12%] size-40 rounded-full bg-quantum/10 blur-3xl" />
    </div>
  );
}

function HomeView({ onChange }: { onChange: (view: View) => void }) {
  return (
    <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-5 pb-10 text-center">
      <RouteBackdrop />
      <div className="relative z-10 mx-auto max-w-5xl animate-enter">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur-md">
          <Zap className="size-3.5" /> Quantum-inspired optimization
        </div>
        <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-normal text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          <span className="text-gradient">Optimize Every Delivery.</span>
          <br />
          <span className="text-foreground">Move More with Less.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Localized route and fleet optimization using real-world road networks and quantum-inspired AI.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => onChange("compare")} size="lg" className="h-12 min-w-52 bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">
            <GitCompareArrows /> Compare Routes <ArrowRight />
          </Button>
          <Button onClick={() => onChange("fleet")} size="lg" variant="outline" className="h-12 min-w-52 border-quantum/40 bg-quantum/10 text-foreground shadow-neon-violet hover:bg-quantum/20">
            <Truck className="text-quantum-foreground" /> Launch Fleet Optimizer
          </Button>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-border/70 border-y border-border/60 py-4">
          {[["32%", "fewer kilometers"], ["18%", "lower costs"], ["2.4×", "faster planning"]].map(([value, label]) => (
            <div key={label} className="px-2">
              <div className="font-mono text-lg font-semibold text-foreground sm:text-2xl">{value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function MapCanvas({ 
  baseline = true, 
  qpso = true, 
  traffic = false, 
  nodes = true, 
  fleet = false,
  routeData = null
}: { 
  baseline?: boolean; 
  qpso?: boolean; 
  traffic?: boolean; 
  nodes?: boolean; 
  fleet?: boolean;
  routeData?: any;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [77.5946, 12.9716], // Bengaluru
      zoom: 11
    });
  }, []);

  useEffect(() => {
    if (!map.current || !routeData) return;

    const sourceId = 'optimized-routes';
    const features = routeData.routes.map((route: any, idx: number) => {
        let coordinates = [];
        if (route.polyline && route.polyline.length > 0) {
            coordinates = route.polyline.map((coord: any) => [coord[1], coord[0]]); // GeoJSON expects [lon, lat]
        } else if (route.stops) {
            coordinates = route.stops.map((stop: any) => [stop.lon, stop.lat]);
        }
        return {
            type: 'Feature',
            properties: { color: ['#a855f7', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'][idx % 6] },
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        };
    });

    if (map.current.getSource(sourceId)) {
        (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: features as any
        });
    } else {
        const addLayers = () => {
            if (!map.current) return;
            if (map.current.getSource(sourceId)) return;
            map.current.addSource(sourceId, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: features as any }
            });

            map.current.addLayer({
                id: 'routes-layer',
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': ['get', 'color'],
                    'line-width': 4,
                    'line-opacity': 0.8
                }
            });
            
            map.current.addLayer({
                id: 'routes-nodes',
                type: 'circle',
                source: sourceId,
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#fff',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': ['get', 'color']
                }
            });
        };
        
        if (map.current.isStyleLoaded()) {
            addLayers();
        } else {
            map.current.once('load', addLayers);
        }
    }
    
    if (routeData.routes.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        routeData.routes.forEach((r: any) => {
            if (r.polyline && r.polyline.length > 0) {
                r.polyline.forEach((coord: any) => {
                    bounds.extend([coord[1], coord[0]]); // [lon, lat]
                });
            } else if (r.stops) {
                r.stops.forEach((stop: any) => {
                    bounds.extend([stop.lon, stop.lat]);
                });
            }
        });
        if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50 });
        }
    }

  }, [routeData]);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-md border border-border bg-map shadow-panel">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
        <Satellite className="size-3.5 text-primary" /> Bengaluru network · live
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, placeholder }: { label: string; icon: typeof MapPin; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      <span className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 border-border bg-input/40 pl-9 text-foreground" />
      </span>
    </label>
  );
}

function CompareView() {
  const [source, setSource] = useState("Indiranagar, Bengaluru");
  const [destination, setDestination] = useState("Electronic City, Bengaluru");
  const [stops, setStops] = useState(["Koramangala 5th Block"]);
  const [baseline, setBaseline] = useState(true);
  const [qpso, setQpso] = useState(true);

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden p-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-5">
      <ScrollArea className="min-h-0 rounded-md border border-border bg-card/70 shadow-panel backdrop-blur-md">
        <div className="space-y-5 p-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><RouteIcon className="size-4 text-primary" /> Route Setup</div>
            <p className="mt-1 text-xs text-muted-foreground">Define an A/B test across the live road graph.</p>
          </div>
          <div className="grid gap-4">
            <Field label="Source" icon={LocateFixed} value={source} onChange={setSource} placeholder="Enter pickup point" />
            <Field label="Destination" icon={MapPin} value={destination} onChange={setDestination} placeholder="Enter delivery point" />
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground"><span>Optional Stops</span><span>{stops.length}/4</span></div>
              {stops.map((stop, index) => (
                <div key={index} className="flex gap-2">
                  <Input aria-label={`Optional stop ${index + 1}`} value={stop} onChange={(event) => setStops(stops.map((item, i) => i === index ? event.target.value : item))} className="h-9 border-border bg-input/40" />
                  <Button aria-label={`Remove stop ${index + 1}`} title="Remove stop" size="icon" variant="ghost" onClick={() => setStops(stops.filter((_, i) => i !== index))} className="shrink-0 text-muted-foreground hover:text-destructive"><Trash2 /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" disabled={stops.length >= 4} onClick={() => setStops([...stops, ""])} className="border-dashed border-border bg-transparent text-muted-foreground"><Plus /> Add stop</Button>
            </div>
            <Button className="h-10 bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90"><Sparkles /> Recalculate comparison</Button>
          </div>
          <div className="border-t border-border pt-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Comparison Metrics</h2><span className="rounded-sm bg-status/10 px-2 py-1 text-[10px] font-semibold text-status">18.4% SAVED</span></div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 rounded-md border border-border bg-muted/40 p-3">
              <MetricColumn label="Baseline" distance="28.7" time="64" tone="baseline" />
              <div className="w-px bg-border" />
              <MetricColumn label="Our Route" distance="23.4" time="49" tone="primary" />
            </div>
            <div className="mt-3 space-y-2">
              <RouteToggle label="Baseline (Conventional)" checked={baseline} onCheckedChange={setBaseline} tone="baseline" />
              <RouteToggle label="Our Route (QPSO)" checked={qpso} onCheckedChange={setQpso} tone="primary" />
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="min-h-[300px] min-w-0"><MapCanvas baseline={baseline} qpso={qpso} /></div>
    </section>
  );
}

function MetricColumn({ label, distance, time, tone }: { label: string; distance: string; time: string; tone: "baseline" | "primary" }) {
  return <div className="min-w-0"><div className={cn("mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]", tone === "primary" ? "text-primary" : "text-baseline")}>{label}</div><div className="font-mono text-xl font-semibold text-foreground">{distance}<span className="ml-1 text-[10px] font-normal text-muted-foreground">km</span></div><div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> {time} min</div></div>;
}

function RouteToggle({ label, checked, onCheckedChange, tone }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; tone: "baseline" | "primary" }) {
  return <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-3 py-2.5"><span className="flex items-center gap-2 text-xs text-foreground"><span className={cn("size-2 rounded-full", tone === "primary" ? "bg-primary shadow-neon-cyan" : "bg-baseline")} />{label}</span><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={`Show ${label}`} /></div>;
}

const statDefinitions = [
  { label: "Deliveries Done", value: "1,284", icon: PackageCheck, trend: "+12.4%", positive: true },
  { label: "Fleet Utilisation", value: "87.6%", icon: Gauge, trend: "+5.2%", positive: true },
  { label: "Total Distance", value: "3,842 km", icon: Navigation, trend: "−8.1%", positive: true },
  { label: "CO₂ Saved", value: "426 kg", icon: Leaf, trend: "+18.7%", positive: true },
  { label: "Est. Operating Cost", value: "₹68,420", icon: CircleDollarSign, trend: "−6.3%", positive: true },
];

function FleetView() {
  const [stops, setStops] = useState([10]);
  const [fleet, setFleet] = useState([3]);
  const [traffic, setTraffic] = useState(true);
  const [nodes, setNodes] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [run, setRun] = useState(18);
  const [routeData, setRouteData] = useState<any>(null);
  const stopCount = stops[0] ?? 1;
  const fleetCount = fleet[0] ?? 1;

  const optimize = async () => { 
    setRunning(true);
    setProgress(0);
    setRouteData(null);
    
    try {
        const depot = { lat: 12.9716, lon: 77.5946 };
        const generatedStops = Array.from({length: stopCount}).map((_, i) => ({
            id: i + 1,
            lat: depot.lat + (Math.random() - 0.5) * 0.1,
            lon: depot.lon + (Math.random() - 0.5) * 0.1,
            demand: 1,
            tw_start: 8.0,
            tw_end: 18.0,
            service_time: 15.0
        }));

        const generatedVehicles = Array.from({length: fleetCount}).map((_, i) => ({
            id: i + 1,
            capacity: 50,
            speed_kmh: 40.0,
            cost_per_km: 15.0,
            cost_per_hour: 200.0
        }));

        const response = await fetch("http://localhost:8000/route/job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                depot_lat: depot.lat,
                depot_lon: depot.lon,
                stops: generatedStops,
                vehicles: generatedVehicles,
                qpso_config: { max_iterations: 50, population_size: 40 }
            })
        });
        const data = await response.json();
        const jobId = data.job_id;
        
        const eventSource = new EventSource(`http://localhost:8000/route/job/${jobId}/stream`);
        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            if (parsed.status === "optimizing") {
                setProgress(Math.floor((parsed.iteration / 50) * 100));
            } else if (parsed.status === "completed") {
                setRouteData(parsed.result);
                setProgress(100);
                setRunning(false);
                setRun(r => r + 1);
                eventSource.close();
            }
        };
        eventSource.onerror = () => {
            setRunning(false);
            eventSource.close();
        };
    } catch (e) {
        console.error(e);
        setRunning(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-3 lg:gap-4 lg:p-5">
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 lg:gap-3">
        {(routeData ? [
    { label: "Total Distance", value: `${routeData.metrics.total_distance_km.toFixed(1)} km`, icon: Navigation, trend: "-18%", positive: true },
    { label: "Avg Delivery Time", value: `${Math.floor(routeData.metrics.total_distance_km * 2)} min`, icon: Clock3, trend: "-12%", positive: true },
    { label: "Fleet Utilisation", value: "100%", icon: Gauge, trend: "+5.2%", positive: true },
    { label: "Est. Operating Cost", value: `₹${Math.floor(routeData.metrics.total_distance_km * 15)}`, icon: CircleDollarSign, trend: "−6.3%", positive: true },
    { label: "Deliveries Done", value: stopCount.toString(), icon: PackageCheck, trend: "live", positive: true }
] : statDefinitions).map((stat, index) => <StatCard key={stat.label} {...stat} value={index === 0 && run > 18 && !routeData ? "1,326" : stat.value} />)}
      </div>
      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-4">
        <Card className="min-h-0 overflow-hidden rounded-md border-border bg-card/70 shadow-panel backdrop-blur-md">
          <Tabs defaultValue="controls" className="flex h-full min-h-0 flex-col">
            <TabsList className="mx-4 mt-4 grid h-9 shrink-0 grid-cols-2 bg-muted/70">
              <TabsTrigger value="controls"><Settings2 className="mr-1.5 size-3.5" />Controls</TabsTrigger>
              <TabsTrigger value="analytics"><Activity className="mr-1.5 size-3.5" />Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="controls" className="mt-0 min-h-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full"><div className="space-y-5 p-5">
                <SelectField label="City Selection" defaultValue="bengaluru" options={[["bengaluru", "Bengaluru, KA"], ["mumbai", "Mumbai, MH"], ["delhi", "New Delhi, DL"]]} />
                <SelectField label="Algorithm" defaultValue="qpso" options={[["qpso", "QPSO — Quantum Swarm"], ["ga", "GA — Genetic Algorithm"], ["aco", "ACO — Ant Colony"]]} />
                <ControlSlider label="Number of Stops" value={stops} onValueChange={setStops} min={1} max={100} suffix="locations" />
                <ControlSlider label="Fleet Size" value={fleet} onValueChange={setFleet} min={1} max={15} suffix="vehicles" />
                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <div className="mb-2 flex items-center justify-between"><span>Search complexity</span><span className="font-mono text-foreground">{(stopCount * fleetCount).toLocaleString()} nodes</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, (stopCount * fleetCount) / 10)}%` }} /></div>
                </div>
                <Button onClick={optimize} disabled={running} className="h-11 w-full bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">
                  {running ? <><Activity className="animate-spin" /> Optimizing {progress}%</> : <><Zap /> Run Optimization <ChevronRight /></>}
                </Button>
              </div></ScrollArea>
            </TabsContent>
            <TabsContent value="analytics" className="mt-0 min-h-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full"><div className="space-y-4 p-4"><MiniChart title="Convergence" subtitle="Fitness score by iteration" data={convergenceData} dataKey="qpso" color="var(--primary)" /><MiniChart title="Optimality Gap" subtitle="Deviation from best known route" data={gapData} dataKey="gap" color="var(--quantum)" /></div></ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
        <div className="relative min-h-[300px] min-w-0">
          <MapCanvas baseline={false} qpso traffic={traffic} nodes={nodes} fleet routeData={routeData} />
          <div className="absolute right-3 top-3 z-20 w-48 rounded-md border border-border bg-surface/80 p-3 shadow-panel backdrop-blur-md sm:right-4 sm:top-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"><Network className="size-3.5 text-primary" /> Map layers</div>
            <MapSwitch icon={Cloud} label="Live Traffic" checked={traffic} onCheckedChange={setTraffic} />
            <MapSwitch icon={Boxes} label="Show Nodes" checked={nodes} onCheckedChange={setNodes} />
          </div>
          <div className="absolute bottom-4 right-4 z-20 rounded-md border border-border bg-surface/80 px-3 py-2 font-mono text-[10px] text-muted-foreground backdrop-blur-md">RUN #{run} · {running ? `SOLVING ${progress}%` : "OPTIMAL"}</div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, icon: Icon, trend, positive }: { label: string; value: string; icon: typeof Gauge; trend: string; positive: boolean }) {
  const Trend = positive ? ArrowUpRight : ArrowDownRight;
  return <Card className="group overflow-hidden rounded-md border-border bg-card/70 p-3 shadow-panel backdrop-blur-md transition-colors hover:border-primary/30 lg:p-4"><div className="flex items-start justify-between gap-2"><div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="size-4" /></div><span className="flex items-center gap-0.5 text-[10px] font-medium text-status"><Trend className="size-3" />{trend}</span></div><div className="mt-3 truncate font-mono text-lg font-semibold text-foreground lg:text-xl">{value}</div><div className="mt-1 truncate text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</div></Card>;
}

function SelectField({ label, defaultValue, options }: { label: string; defaultValue: string; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-medium text-muted-foreground">{label}<Select defaultValue={defaultValue}><SelectTrigger className="h-10 border-border bg-input/40 text-foreground"><SelectValue /></SelectTrigger><SelectContent>{options.map(([value, text]) => <SelectItem key={value} value={value}>{text}</SelectItem>)}</SelectContent></Select></label>;
}

function ControlSlider({ label, value, onValueChange, min, max, suffix }: { label: string; value: number[]; onValueChange: (value: number[]) => void; min: number; max: number; suffix: string }) {
  return <div className="grid gap-3"><div className="flex items-end justify-between"><label className="text-xs font-medium text-muted-foreground">{label}</label><span className="font-mono text-lg font-semibold text-foreground">{value[0]} <span className="text-[10px] font-normal text-muted-foreground">{suffix}</span></span></div><Slider value={value} onValueChange={onValueChange} min={min} max={max} step={1} aria-label={label} /><div className="flex justify-between font-mono text-[9px] text-muted-foreground"><span>{min}</span><span>{max}</span></div></div>;
}

function MiniChart({ title, subtitle, data, dataKey, color }: { title: string; subtitle: string; data: Array<Record<string, string | number>>; dataKey: string; color: string }) {
  const gradientId = `gradient-${dataKey}`;
  return <div className="rounded-md border border-border bg-muted/30 p-3"><div className="mb-3"><div className="text-xs font-semibold text-foreground">{title}</div><div className="mt-0.5 text-[10px] text-muted-foreground">{subtitle}</div></div><div className="h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 5, right: 4, left: -28, bottom: 0 }}><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0.35} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="i" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} /><YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} /><RechartsTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} /><Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} /></AreaChart></ResponsiveContainer></div></div>;
}

function MapSwitch({ icon: Icon, label, checked, onCheckedChange }: { icon: typeof Cloud; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between border-t border-border/70 py-2 first:border-t-0"><span className="flex items-center gap-2 text-xs text-foreground"><Icon className="size-3.5 text-muted-foreground" />{label}</span><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} /></div>;
}

export function QidreDashboard() {
  const [view, setView] = useState<View>("home");
  const activeView = useMemo(() => ({ home: <HomeView onChange={setView} />, compare: <CompareView />, fleet: <FleetView /> })[view], [view]);

  return (
    <TooltipProvider>
      <main className="flex h-dvh min-h-[600px] flex-col overflow-hidden bg-background text-foreground">
        <TopNav view={view} onChange={setView} />
        <div className="min-h-0 flex-1 overflow-hidden">{activeView}</div>
        <Tooltip><TooltipTrigger asChild><div className="fixed bottom-3 left-3 z-40 hidden size-2 rounded-full bg-status shadow-neon-status lg:block" /></TooltipTrigger><TooltipContent side="right">Optimization engine online</TooltipContent></Tooltip>
      </main>
    </TooltipProvider>
  );
}
