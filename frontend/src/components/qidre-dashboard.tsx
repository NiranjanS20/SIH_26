import { lazy, Suspense, useEffect, useMemo, useState, useRef } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Activity,
  ArrowRight,
  Atom,
  Boxes,
  ChevronRight,
  Cloud,
  Clock3,
  Gauge,
  GitCompareArrows,
  Leaf,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Network,
  Plus,
  Route as RouteIcon,
  RefreshCw,
  Satellite,
  Settings2,
  Sparkles,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
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
import { AREAS, areaMeta, compareRoutes, geocode, jobStreamUrl, loadGraph, refreshLiveTraffic, startRouteJob, type AreaId, type CompareResponse, type TrafficSegment } from "@/lib/api";

type View = "home" | "compare" | "fleet";
const MiniChart = lazy(() => import("./mini-chart"));

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
          {[["Mumbai", "road network"], ["QPSO", "fleet optimizer"], ["Live", "route metrics"]].map(([value, label]) => (
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
  optimized = true,
  showTraffic = true,
  trafficSegments = [],
  nodes = true, 
  fleet = false,
  routeData = null,
  areaId = "bkc",
}: { 
  baseline?: boolean; 
  optimized?: boolean;
  showTraffic?: boolean;
  trafficSegments?: TrafficSegment[];
  nodes?: boolean; 
  fleet?: boolean;
  routeData?: any;
  areaId?: AreaId;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const maplibre = useRef<typeof import("maplibre-gl") | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let disposed = false;
    import("maplibre-gl").then((maplibreModule) => {
      if (disposed || !mapContainer.current) return;
      maplibre.current = maplibreModule;
      const instance = new maplibreModule.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            openstreetmap: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
            "live-traffic": {
              type: "geojson",
              data: { type: "FeatureCollection", features: [] },
            },
          },
          layers: [
            { id: "openstreetmap", type: "raster", source: "openstreetmap" },
            {
              id: "live-traffic",
              type: "line",
              source: "live-traffic",
              layout: { "line-cap": "round", "line-join": "round", visibility: showTraffic ? "visible" : "none" },
              paint: {
                "line-color": [
                  "case",
                  ["<", ["get", "speed_ratio"], 0.45], "#ef4444",
                  ["<", ["get", "speed_ratio"], 0.75], "#f59e0b",
                  "#22c55e",
                ],
                "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 15, 6],
                "line-opacity": 0.9,
              },
            },
          ],
        },
        center: [areaMeta("bkc").center.lon, areaMeta("bkc").center.lat],
        zoom: 11,
      });
      map.current = instance;
      instance.on("error", (event) => {
        const message = event.error?.message;
        if (message) {
          console.error("Map rendering error", event.error);
          setMapError("Map tiles could not be loaded. Check your connection and reload.");
        }
      });
      instance.once("load", () => {
        if (!disposed) {
          instance.resize();
          setMapReady(true);
        }
      });
    }).catch((cause: unknown) => console.error("Could not load the map engine", cause));

    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
      maplibre.current = null;
    };
  }, []);

  useEffect(() => {
    const center = areaMeta(areaId).center;
    map.current?.setCenter([center.lon, center.lat]);
  }, [areaId, mapReady]);

  useEffect(() => {
    const trafficSource = map.current?.getSource("live-traffic") as GeoJSONSource | undefined;
    if (!trafficSource || !mapReady) return;
    trafficSource.setData({
      type: "FeatureCollection",
      features: trafficSegments
        .filter((segment) => segment.geometry.length >= 2)
        .map((segment) => ({
          type: "Feature" as const,
          properties: {
            speed_ratio: segment.free_flow_speed_kmh > 0
              ? segment.speed_kmh / segment.free_flow_speed_kmh
              : 1,
            speed_kmh: segment.speed_kmh,
          },
          geometry: { type: "LineString" as const, coordinates: segment.geometry },
        })),
    });
    map.current?.setLayoutProperty("live-traffic", "visibility", showTraffic ? "visible" : "none");
  }, [trafficSegments, showTraffic, mapReady]);

  useEffect(() => {
    const maplibreModule = maplibre.current;
    if (!map.current || !mapReady || !routeData || !maplibreModule) return;

    const sourceId = 'optimized-routes';
    const features = routeData.routes
      .filter((route: any) => route.kind === "baseline" ? baseline : route.kind === "fastest_time" ? optimized : true)
      .map((route: any, idx: number) => {
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
        (map.current.getSource(sourceId) as GeoJSONSource).setData({
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
        const bounds = new maplibreModule.LngLatBounds();
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

  }, [routeData, baseline, optimized, mapReady]);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-md border border-border bg-map shadow-panel">
      <div ref={mapContainer} className="map-canvas-container" />
      {mapError && (
        <div role="status" className="absolute inset-x-4 bottom-4 z-10 rounded-md border border-warning/30 bg-background/90 px-3 py-2 text-xs text-foreground shadow-panel backdrop-blur">
          {mapError}
        </div>
      )}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
        <Satellite className="size-3.5 text-primary" /> {areaMeta(areaId).label} network
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

function comparisonPolyline(route: CompareResponse["baseline"]): number[][] {
  return route.geometry.geometry.coordinates.flatMap((coordinate) => {
    if (typeof coordinate === "string") {
      const [lon, lat] = coordinate.trim().split(/\s+/).map(Number);
      return Number.isFinite(lat) && Number.isFinite(lon) ? [[lat!, lon!]] : [];
    }
    return coordinate.length >= 2 ? [[coordinate[1]!, coordinate[0]!]] : [];
  });
}

function CompareView() {
  const areaId: AreaId = "bkc";
  const [source, setSource] = useState("Bandra Kurla Complex, Mumbai");
  const [destination, setDestination] = useState("Santacruz East, Mumbai");
  const [stops, setStops] = useState<string[]>([]);
  const [baseline, setBaseline] = useState(true);
  const [showFastest, setShowFastest] = useState(true);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recalculate = async () => {
    setLoading(true);
    setError("");
    setComparison(null);
    try {
      await loadGraph(areaId);
      const sourcePoint = await geocode(source, areaId);
      if (!sourcePoint) throw new Error(`Could not find “${source}” in BKC, Mumbai.`);
      const destinationPoint = await geocode(destination, areaId);
      if (!destinationPoint) throw new Error(`Could not find “${destination}” in BKC, Mumbai.`);
      const stopPoints: Array<{ lat: number; lon: number }> = [];
      for (const stop of stops.filter((value) => value.trim())) {
        const point = await geocode(stop, areaId);
        if (!point) throw new Error(`Could not find “${stop}” in BKC, Mumbai.`);
        stopPoints.push({ lat: point.lat, lon: point.lon });
      }
      const result = await compareRoutes({
        area: areaId,
        source: { lat: sourcePoint.lat, lon: sourcePoint.lon },
        destination: { lat: destinationPoint.lat, lon: destinationPoint.lon },
        stops: stopPoints,
      });
      setComparison(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not compare these routes.");
    } finally {
      setLoading(false);
    }
  };

  const distanceChange = comparison
    ? ((comparison.ours.distance_km - comparison.baseline.distance_km) / Math.max(comparison.baseline.distance_km, 0.001)) * 100
    : null;
  const distanceLabel = distanceChange === null
    ? "Run comparison"
    : Math.abs(distanceChange) < 0.05
      ? "SAME DISTANCE"
      : `${Math.abs(distanceChange).toFixed(1)}% ${distanceChange > 0 ? "LONGER DISTANCE" : "SHORTER DISTANCE"}`;
  const fastestRouteLabel = comparison?.traffic_source === "tomtom_live"
    ? "Fastest Time (TomTom Live)"
    : comparison?.traffic_source === "manual"
      ? "Fastest Time (Updated Weights)"
      : "Fastest Time (Static OSM)";
  const compareMapData = comparison ? {
    routes: [
      { kind: "baseline", polyline: comparisonPolyline(comparison.baseline) },
      { kind: "fastest_time", polyline: comparisonPolyline(comparison.ours) },
    ],
  } : null;

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden p-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-5">
      <ScrollArea className="min-h-0 rounded-md border border-border bg-card/70 shadow-panel backdrop-blur-md">
        <div className="space-y-5 p-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><RouteIcon className="size-4 text-primary" /> Route Setup</div>
            <p className="mt-1 text-xs text-muted-foreground">Compare shortest distance with fastest graph travel time. The fastest route uses TomTom speeds after a traffic refresh; otherwise it uses OSM estimates.</p>
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
            <Button onClick={recalculate} disabled={loading} className="h-10 bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">{loading ? <><Activity className="animate-spin" /> Looking up routes</> : <><Sparkles /> Recalculate comparison</>}</Button>
          </div>
          {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          <div className="border-t border-border pt-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Comparison Metrics</h2><span className="rounded-sm bg-status/10 px-2 py-1 text-[10px] font-semibold text-status">{distanceLabel}</span></div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 rounded-md border border-border bg-muted/40 p-3">
              <MetricColumn label="Shortest Distance" distance={comparison?.baseline.distance_km.toFixed(1) ?? "—"} time={comparison?.baseline.time_min.toFixed(0) ?? "—"} tone="baseline" />
              <div className="w-px bg-border" />
              <MetricColumn label={fastestRouteLabel} distance={comparison?.ours.distance_km.toFixed(1) ?? "—"} time={comparison?.ours.time_min.toFixed(0) ?? "—"} tone="primary" />
            </div>
            <div className="mt-3 space-y-2">
              <RouteToggle label="Shortest Distance" checked={baseline} onCheckedChange={setBaseline} tone="baseline" />
              <RouteToggle label={fastestRouteLabel} checked={showFastest} onCheckedChange={setShowFastest} tone="primary" />
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="min-h-[300px] min-w-0"><MapCanvas baseline={baseline} optimized={showFastest} routeData={compareMapData} areaId={areaId} /></div>
    </section>
  );
}

function MetricColumn({ label, distance, time, tone }: { label: string; distance: string; time: string; tone: "baseline" | "primary" }) {
  return <div className="min-w-0"><div className={cn("mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]", tone === "primary" ? "text-primary" : "text-baseline")}>{label}</div><div className="font-mono text-xl font-semibold text-foreground">{distance}<span className="ml-1 text-[10px] font-normal text-muted-foreground">km</span></div><div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> {time} min</div></div>;
}

function RouteToggle({ label, checked, onCheckedChange, tone }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; tone: "baseline" | "primary" }) {
  return <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-3 py-2.5"><span className="flex items-center gap-2 text-xs text-foreground"><span className={cn("size-2 rounded-full", tone === "primary" ? "bg-primary shadow-neon-cyan" : "bg-baseline")} />{label}</span><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={`Show ${label}`} /></div>;
}

function FleetView() {
  const [areaId, setAreaId] = useState<AreaId>("bkc");
  const [stopLocations, setStopLocations] = useState<string[]>([areaMeta("bkc").label]);
  const [fleet, setFleet] = useState([3]);
  const [trafficRefreshing, setTrafficRefreshing] = useState(false);
  const [trafficVisible, setTrafficVisible] = useState(true);
  const [trafficSegments, setTrafficSegments] = useState<TrafficSegment[]>([]);
  const [trafficStatus, setTrafficStatus] = useState("");
  const [trafficError, setTrafficError] = useState("");
  const [nodes, setNodes] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [run, setRun] = useState(0);
  const [routeData, setRouteData] = useState<any>(null);
  const [error, setError] = useState("");
  const stopCount = stopLocations.length;
  const fleetCount = fleet[0] ?? 1;

  const refreshTraffic = async () => {
    setTrafficRefreshing(true);
    setTrafficError("");
    setTrafficStatus("");
    try {
      await loadGraph(areaId);
      const result = await refreshLiveTraffic(20);
      setTrafficSegments(result.edges);
      setTrafficStatus(
        result.updated > 0
          ? `${result.updated} live road speeds applied (${result.requested} checked)`
          : `No confident speeds found (${result.requested} roads checked)`,
      );
    } catch (cause) {
      setTrafficError(cause instanceof Error ? cause.message : "Could not refresh live traffic.");
    } finally {
      setTrafficRefreshing(false);
    }
  };
  const routeStats = routeData ? [
    { label: "Total Distance", value: `${routeData.routes.reduce((sum: number, route: any) => sum + route.distance_km, 0).toFixed(1)} km`, icon: Navigation },
    { label: "Travel Time", value: `${routeData.routes.reduce((sum: number, route: any) => sum + route.travel_time_min, 0).toFixed(0)} min`, icon: Clock3 },
    { label: "Vehicles Used", value: `${routeData.routes.filter((route: any) => route.stop_count > 0).length}`, icon: Truck },
    { label: "CO₂ Emissions", value: routeData.emissions ? `${routeData.emissions.total_co2_kg.toFixed(2)} kg` : "—", icon: Leaf },
    { label: "Solve Time", value: `${routeData.elapsed_s.toFixed(2)} s`, icon: Gauge },
  ] : [
    { label: "Total Distance", value: "—", icon: Navigation },
    { label: "Travel Time", value: "—", icon: Clock3 },
    { label: "Vehicles Used", value: "—", icon: Truck },
    { label: "CO₂ Emissions", value: "—", icon: Leaf },
    { label: "Solve Time", value: "—", icon: Gauge },
  ];

  const optimize = async () => { 
    setRunning(true);
    setProgress(0);
    setRouteData(null);
    setError("");
    
    try {
        const depot = areaMeta(areaId).center;
        await loadGraph(areaId);
        const resolvedStops: Array<{ id: number; lat: number; lon: number; demand: number; service_time_min: number }> = [];
        for (const [index, location] of stopLocations.entries()) {
            if (!location.trim()) throw new Error(`Enter a location for stop ${index + 1}.`);
            const hit = await geocode(location, areaId);
            if (!hit) throw new Error(`Could not find “${location}” in ${areaMeta(areaId).label}.`);
            resolvedStops.push({
            id: index + 1,
            lat: hit.lat,
            lon: hit.lon,
            demand: 1,
            service_time_min: 15.0
            });
            setProgress(Math.round(((index + 1) / stopLocations.length) * 10));
        }

        const generatedVehicles = Array.from({length: fleetCount}).map((_, i) => ({
            id: i + 1,
            capacity: 50,
            speed_kmh: 40.0,
            cost_per_km: 15.0,
            cost_per_hour: 200.0
        }));

        const { job_id: jobId } = await startRouteJob({
                depot_lat: depot.lat,
                depot_lon: depot.lon,
                stops: resolvedStops,
                vehicles: generatedVehicles,
                qpso_config: { max_iterations: 50, population_size: 40 }
        });
        
        const eventSource = new EventSource(jobStreamUrl(jobId));
        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            if (typeof parsed.iteration === "number") {
                setProgress(Math.max(10, Math.floor((parsed.iteration / 50) * 100)));
            } else if (parsed.status === "failed") {
                setError(parsed.error ?? "Route optimization failed.");
                setRunning(false);
                eventSource.close();
            } else if (parsed.status === "completed") {
                setRouteData(parsed.result);
                setProgress(100);
                setRunning(false);
                setRun(r => r + 1);
                eventSource.close();
            }
        };
        eventSource.onerror = () => {
            setError("The optimization stream disconnected before finishing.");
            setRunning(false);
            eventSource.close();
        };
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Could not optimize these locations.");
        setRunning(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-3 lg:gap-4 lg:p-5">
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 lg:gap-3">
        {routeStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
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
                <SelectField label="Service Area" value={areaId} onValueChange={(value) => {
                  const nextArea = value as AreaId;
                  if (stopLocations.length === 1 && stopLocations[0] === areaMeta(areaId).label) {
                    setStopLocations([areaMeta(nextArea).label]);
                  }
                  setTrafficStatus("");
                  setTrafficError("");
                  setTrafficSegments([]);
                  setAreaId(nextArea);
                  }} options={AREAS.map(({ id, label }) => [id, label])} />
                <SelectField label="Algorithm" defaultValue="qpso" options={[["qpso", "QPSO — Quantum Swarm"], ["ga", "GA — Genetic Algorithm"], ["aco", "ACO — Ant Colony"]]} />
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground"><span>Delivery Locations</span><span>{stopCount}/15</span></div>
                  {stopLocations.map((location, index) => (
                    <div key={index} className="flex gap-2">
                      <Input aria-label={`Delivery location ${index + 1}`} value={location} onChange={(event) => setStopLocations(stopLocations.map((item, i) => i === index ? event.target.value : item))} placeholder="Search a Mumbai address" className="h-9 border-border bg-input/40" />
                      <Button aria-label={`Remove delivery location ${index + 1}`} title="Remove location" size="icon" variant="ghost" disabled={stopLocations.length === 1} onClick={() => setStopLocations(stopLocations.filter((_, i) => i !== index))} className="shrink-0 text-muted-foreground hover:text-destructive"><Trash2 /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" disabled={stopCount >= 15} onClick={() => setStopLocations([...stopLocations, ""])} className="border-dashed border-border bg-transparent text-muted-foreground"><Plus /> Add delivery location</Button>
                </div>
                <ControlSlider label="Fleet Size" value={fleet} onValueChange={setFleet} min={1} max={15} suffix="vehicles" />
                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <div className="mb-2 flex items-center justify-between"><span>Search complexity</span><span className="font-mono text-foreground">{(stopCount * fleetCount).toLocaleString()} nodes</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, (stopCount * fleetCount) / 10)}%` }} /></div>
                </div>
                <Button onClick={optimize} disabled={running} className="h-11 w-full bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">
                  {running ? <><Activity className="animate-spin" /> Optimizing {progress}%</> : <><Zap /> Run Optimization <ChevronRight /></>}
                </Button>
                {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
              </div></ScrollArea>
            </TabsContent>
            <TabsContent value="analytics" className="mt-0 min-h-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full"><div className="space-y-4 p-4">
                <Suspense fallback={<p className="rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">Loading analytics…</p>}>
                  {routeData?.convergence?.length ? <MiniChart title="Convergence" subtitle="Best fitness by iteration" data={routeData.convergence.map((value: number, i: number) => ({ i, value }))} dataKey="value" color="var(--primary)" /> : <p className="rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">Run an optimization to see its convergence data.</p>}
                  {routeData?.diversity?.length ? <MiniChart title="Population Diversity" subtitle="Swarm diversity by iteration" data={routeData.diversity.map((value: number, i: number) => ({ i, value }))} dataKey="value" color="var(--quantum)" /> : null}
                </Suspense>
              </div></ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
        <div className="relative min-h-[300px] min-w-0">
          <MapCanvas baseline={false} showTraffic={trafficVisible} trafficSegments={trafficSegments} nodes={nodes} fleet routeData={routeData} areaId={areaId} />
          <div className="absolute right-3 top-3 z-20 w-48 rounded-md border border-border bg-surface/80 p-3 shadow-panel backdrop-blur-md sm:right-4 sm:top-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"><Network className="size-3.5 text-primary" /> Map layers</div>
            <Button type="button" size="sm" variant="outline" onClick={refreshTraffic} disabled={trafficRefreshing} className="w-full justify-start border-border bg-transparent text-xs">
              <RefreshCw className={cn("size-3.5", trafficRefreshing && "animate-spin")} />
              {trafficRefreshing ? "Refreshing traffic…" : "Refresh live speeds"}
            </Button>
            <MapSwitch icon={Cloud} label="Traffic overlay" checked={trafficVisible} onCheckedChange={setTrafficVisible} />
            {trafficStatus && <p role="status" className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{trafficStatus}</p>}
            {trafficError && <p role="alert" className="mt-2 text-[10px] leading-relaxed text-destructive">{trafficError}</p>}
            <MapSwitch icon={Boxes} label="Show Nodes" checked={nodes} onCheckedChange={setNodes} />
          </div>
          {trafficSegments.length > 0 && <div className="absolute bottom-4 left-4 z-20 rounded-md border border-border bg-surface/85 px-3 py-2 text-[10px] text-muted-foreground shadow-panel backdrop-blur-md">Traffic data © TomTom · Green: flowing · Amber: slow · Red: congested</div>}
          <div className="absolute bottom-4 right-4 z-20 rounded-md border border-border bg-surface/80 px-3 py-2 font-mono text-[10px] text-muted-foreground backdrop-blur-md">RUN #{run || 1} · {running ? `SOLVING ${progress}%` : routeData ? "COMPLETE" : "READY"}</div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Gauge }) {
  return <Card className="group overflow-hidden rounded-md border-border bg-card/70 p-3 shadow-panel backdrop-blur-md transition-colors hover:border-primary/30 lg:p-4"><div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="size-4" /></div><div className="mt-3 truncate font-mono text-lg font-semibold text-foreground lg:text-xl">{value}</div><div className="mt-1 truncate text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</div></Card>;
}

type SelectFieldProps =
  | { label: string; value: string; onValueChange: (value: string) => void; options: Array<[string, string]> }
  | { label: string; defaultValue: string; options: Array<[string, string]> };

function SelectField(props: SelectFieldProps) {
  const { label, options } = props;
  const selectProps = "value" in props
    ? { value: props.value, onValueChange: props.onValueChange }
    : { defaultValue: props.defaultValue };
  return <label className="grid gap-2 text-xs font-medium text-muted-foreground">{label}<Select {...selectProps}><SelectTrigger className="h-10 border-border bg-input/40 text-foreground"><SelectValue /></SelectTrigger><SelectContent>{options.map(([optionValue, text]) => <SelectItem key={optionValue} value={optionValue}>{text}</SelectItem>)}</SelectContent></Select></label>;
}

function ControlSlider({ label, value, onValueChange, min, max, suffix }: { label: string; value: number[]; onValueChange: (value: number[]) => void; min: number; max: number; suffix: string }) {
  return <div className="grid gap-3"><div className="flex items-end justify-between"><label className="text-xs font-medium text-muted-foreground">{label}</label><span className="font-mono text-lg font-semibold text-foreground">{value[0]} <span className="text-[10px] font-normal text-muted-foreground">{suffix}</span></span></div><Slider value={value} onValueChange={onValueChange} min={min} max={max} step={1} aria-label={label} /><div className="flex justify-between font-mono text-[9px] text-muted-foreground"><span>{min}</span><span>{max}</span></div></div>;
}

function MapSwitch({ icon: Icon, label, checked, onCheckedChange }: { icon: typeof Boxes; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
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
