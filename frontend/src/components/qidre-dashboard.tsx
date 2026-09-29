import { lazy, Suspense, useEffect, useMemo, useState, useRef } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Atom,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  CloudRain,
  Flame,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  HeartHandshake,
  Leaf,
  LocateFixed,
  Map,
  MapPin,
  Moon,
  Navigation,
  Network,
  Plus,
  RefreshCw,
  Route as RouteIcon,
  Satellite,
  Settings2,
  ShieldAlert,
  Sparkles,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Umbrella,
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
import {
  AREAS,
  areaMeta,
  compareRoutes,
  fetchClientConfig,
  fetchCorrectiveTips,
  fetchDriverWellbeing,
  fetchEcoMetrics,
  fetchWeatherFestive,
  geocode,
  getTomTomKey,
  jobStreamUrl,
  loadGraph,
  refreshLiveTraffic,
  simulateScenario,
  startRouteJob,
  takeTipAction,
  updateWeatherFestive,
  type AreaId,
  type CompareResponse,
  type CorrectiveTip,
  type SimulationResult,
  type TrafficSegment,
  type WeatherFestiveSummary,
  type WellbeingSummary,
} from "@/lib/api";

type View = "home" | "compare" | "fleet" | "simulator" | "operations";
const MiniChart = lazy(() => import("./mini-chart"));

function findClosestArea(lat: number, lon: number): AreaId {
  let closest: AreaId = "bkc";
  let minDist = Infinity;
  for (const a of AREAS) {
    const d = Math.hypot(lat - a.center.lat, lon - a.center.lon);
    if (d < minDist) {
      minDist = d;
      closest = a.id as AreaId;
    }
  }
  return closest;
}

function Logo() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 p-1 shadow-neon-cyan transition-transform hover:scale-105">
        <img
          src="/logo-icon.png"
          alt="QIDRE Logo"
          className="size-8 object-contain drop-shadow-[0_0_10px_rgba(0,180,255,0.45)]"
        />
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
  { id: "simulator", label: "Scenario Simulator", icon: FlaskConical },
  { id: "operations", label: "Weather & Wellbeing", icon: HeartHandshake },
];

function TopNav({
  view,
  onChange,
  theme,
  onToggleTheme,
}: {
  view: View;
  onChange: (view: View) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
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
              <span className="md:hidden">{item.label.split(" ")[0]}</span>
            </Button>
          );
        })}
      </nav>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleTheme}
          className="h-8 gap-1.5 border-border/70 bg-muted/40 px-2.5 text-xs text-foreground hover:bg-accent/60"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? (
            <>
              <Sun className="size-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="size-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </Button>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-status opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-status" />
          </span>
          Systems nominal
        </div>
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
        </defs>
        <path d="M-40 540 C 260 520, 360 260, 680 290 S 1120 620, 1480 340" fill="none" stroke="url(#hero-route)" strokeWidth="1.5" strokeDasharray="6 8" />
      </svg>
    </div>
  );
}

function HomeView({ onChange }: { onChange: (view: View) => void }) {
  return (
    <section className="relative flex h-full flex-col justify-between overflow-y-auto px-6 py-10 sm:px-10 lg:px-16">
      <RouteBackdrop />
      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src="/logo-icon.png"
            alt="QIDRE"
            className="size-16 sm:size-20 shrink-0 object-contain drop-shadow-[0_0_25px_rgba(0,180,255,0.45)]"
          />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-medium text-primary">
              <Sparkles className="size-3" /> Production · Quantum-Inspired Urban Logistics
            </div>
            <div className="font-display text-xs sm:text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Algorithmic Quantum Route Engine
            </div>
          </div>
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          Real-time dynamic fleet routing powered by <span className="text-primary">quantum-inspired metaheuristics</span>.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          QIDRE pairs OpenStreetMap road networks, live TomTom traffic, and thermodynamic vehicle physics with QPSO delta-potential-well sampling to cut transit delay, EV energy burn, and driver strain.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => onChange("fleet")} size="lg" className="h-11 bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">
            Open Fleet Optimizer <ArrowRight className="size-4" />
          </Button>
          <Button onClick={() => onChange("compare")} variant="outline" size="lg" className="h-11 border-border bg-card/60 hover:bg-card">
            Compare Single Routes
          </Button>
          <Button onClick={() => onChange("simulator")} variant="outline" size="lg" className="h-11 border-border bg-card/60 hover:bg-card">
            What-If Simulator
          </Button>
          <Button onClick={() => onChange("operations")} variant="outline" size="lg" className="h-11 border-border bg-card/60 hover:bg-card">
            Weather & Wellbeing
          </Button>
        </div>
      </div>
      <div className="relative z-10 grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Point-to-Point", desc: "Shortest vs fastest dynamic Dijkstra comparing physical distance against live traffic weights." },
          { title: "Fleet Engine", desc: "Multi-vehicle capacity-constrained routing solved via QPSO, GA, and Ant Colony Optimization." },
          { title: "Thermodynamic Physics", desc: "EV kilowatt-hour draw, regenerative descent, and ICE crawl fuel consumption models." },
          { title: "Driver Ergonomics", desc: "Route strain scoring, unprotected right-turn penalties, and fleet workload equity thresholds." },
        ].map((feat) => (
          <Card key={feat.title} className="rounded-md border-border bg-card/60 p-4 backdrop-blur-md">
            <div className="font-mono text-sm font-semibold text-foreground">{feat.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MapCanvas({
  baseline,
  optimized,
  showTraffic,
  trafficSegments = [],
  nodes: _nodes,
  fleet,
  routeData,
  areaId = "bkc",
  theme = "dark",
}: {
  baseline?: boolean;
  optimized?: boolean;
  showTraffic?: boolean;
  trafficSegments?: TrafficSegment[];
  nodes?: boolean;
  fleet?: boolean;
  routeData?: any;
  areaId?: AreaId;
  theme?: "dark" | "light";
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const maplibre = useRef<typeof import("maplibre-gl") | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tomtomKey, setTomtomKey] = useState<string>(() => getTomTomKey());
  const markersRef = useRef<any[]>([]);
  const drawnLayersRef = useRef<string[]>([]);
  const drawnSourcesRef = useRef<string[]>([]);

  useEffect(() => {
    fetchClientConfig()
      .then((cfg) => {
        if (cfg.tomtom_api_key && cfg.tomtom_api_key !== tomtomKey) {
          setTomtomKey(cfg.tomtom_api_key);
        }
      })
      .catch(console.warn);
  }, [tomtomKey]);

  const getTileUrl = (th: "dark" | "light", key: string) => {
    if (key) {
      return th === "dark"
        ? `https://api.tomtom.com/map/1/tile/basic/night/{z}/{x}/{y}.png?key=${key}`
        : `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${key}`;
    }
    // High-detail fallback with full road labels, landmarks, and street grid
    return th === "dark"
      ? "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getAttribution = (key: string) =>
    key
      ? "© OpenStreetMap contributors, © TomTom"
      : "© OpenStreetMap contributors, © CARTO";

  useEffect(() => {
    let disposed = false;
    import("maplibre-gl").then((maplibreModule) => {
      if (disposed || !mapContainer.current) return;
      maplibre.current = maplibreModule;
      const initialCenter = areaMeta(areaId).center;
      const initialTile = getTileUrl(theme, tomtomKey);
      const attribution = getAttribution(tomtomKey);

      const sources: Record<string, any> = {
        "basemap-tiles": {
          type: "raster",
          tiles: [initialTile],
          tileSize: 256,
          attribution,
        },
        "live-traffic": {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        },
      };

      const layers: any[] = [
        { id: "basemap-layer", type: "raster", source: "basemap-tiles" },
      ];

      if (tomtomKey) {
        sources["tomtom-traffic"] = {
          type: "raster",
          tiles: [`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`],
          tileSize: 256,
        };
        layers.push({
          id: "tomtom-traffic",
          type: "raster",
          source: "tomtom-traffic",
          layout: { visibility: showTraffic ? "visible" : "none" },
          paint: { "raster-opacity": 0.8 },
        });
      }

      layers.push({
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
      });

      const instance = new maplibreModule.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources,
          layers,
        },
        center: [initialCenter.lon, initialCenter.lat],
        zoom: 12,
      });

      map.current = instance;
      instance.on("error", (event) => {
        console.warn("Map notice:", event.error?.message);
      });
      instance.once("load", () => {
        if (!disposed) {
          instance.resize();
          setMapReady(true);
        }
      });
    }).catch((cause: unknown) => console.error("Could not load map engine", cause));

    return () => {
      disposed = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      maplibre.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update basemap when theme or tomtomKey changes
  useEffect(() => {
    const instance = map.current;
    if (!instance || !mapReady) return;
    const tileUrl = getTileUrl(theme, tomtomKey);
    const source = instance.getSource("basemap-tiles") as any;
    if (source && typeof source.setTiles === "function") {
      source.setTiles([tileUrl]);
    } else {
      try {
        if (instance.getLayer("basemap-layer")) instance.removeLayer("basemap-layer");
        if (instance.getSource("basemap-tiles")) instance.removeSource("basemap-tiles");
        instance.addSource("basemap-tiles", {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: getAttribution(tomtomKey),
        });
        const beforeLayer = instance.getLayer("tomtom-traffic")
          ? "tomtom-traffic"
          : (instance.getLayer("live-traffic") ? "live-traffic" : undefined);
        instance.addLayer(
          { id: "basemap-layer", type: "raster", source: "basemap-tiles" },
          beforeLayer,
        );
      } catch (err) {
        console.warn("Could not reload basemap tile source:", err);
      }
    }
  }, [theme, tomtomKey, mapReady]);

  // Center on area change
  useEffect(() => {
    const center = areaMeta(areaId).center;
    if (map.current && mapReady) {
      map.current.flyTo({ center: [center.lon, center.lat], zoom: 12, essential: true });
    }
  }, [areaId, mapReady]);

  // Update live traffic
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
            speed_ratio: segment.free_flow_speed_kmh > 0 ? segment.speed_kmh / segment.free_flow_speed_kmh : 1,
            speed_kmh: segment.speed_kmh,
          },
          geometry: {
            type: "LineString" as const,
            coordinates: segment.geometry.map((pt) => [pt[1] ?? 0, pt[0] ?? 0]),
          },
        })),
    });
  }, [trafficSegments, mapReady]);

  useEffect(() => {
    if (!map.current || !mapReady) return;
    if (map.current.getLayer("live-traffic")) {
      map.current.setLayoutProperty("live-traffic", "visibility", showTraffic ? "visible" : "none");
    }
    if (map.current.getLayer("tomtom-traffic")) {
      map.current.setLayoutProperty("tomtom-traffic", "visibility", showTraffic ? "visible" : "none");
    }
  }, [showTraffic, mapReady]);

  // Route & Markers rendering
  useEffect(() => {
    const instance = map.current;
    const ml = maplibre.current;
    if (!instance || !ml || !mapReady) return;

    // Clean previous route layers
    drawnLayersRef.current.forEach((id) => {
      try {
        if (instance.getLayer(id)) instance.removeLayer(id);
      } catch {}
    });
    drawnLayersRef.current = [];

    // Clean previous route sources
    drawnSourcesRef.current.forEach((id) => {
      try {
        if (instance.getSource(id)) instance.removeSource(id);
      } catch {}
    });
    drawnSourcesRef.current = [];

    // Clean previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const allCoords: [number, number][] = [];

    // Fleet Routes rendering
    if (routeData?.routes && fleet) {
      const colors = ["#06b6d4", "#a855f7", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];
      routeData.routes.forEach((r: any, idx: number) => {
        if (!r.polyline || r.polyline.length < 2) return;
        const coords: [number, number][] = r.polyline.map(([lat, lon]: [number, number]) => [lon, lat]);
        coords.forEach((c) => allCoords.push(c));

        const sourceId = `fleet-source-${idx}`;
        const layerGlowId = `fleet-glow-${idx}`;
        const layerCoreId = `fleet-core-${idx}`;
        const color = colors[idx % colors.length] ?? "#06b6d4";

        instance.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
          },
        });
        drawnSourcesRef.current.push(sourceId);

        // Glow casing for high visibility
        instance.addLayer({
          id: layerGlowId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": color,
            "line-width": 8,
            "line-opacity": 0.45,
            "line-blur": 2,
          },
        });
        drawnLayersRef.current.push(layerGlowId);

        // Core route line
        instance.addLayer({
          id: layerCoreId,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": color,
            "line-width": 4.5,
            "line-opacity": 0.95,
          },
        });
        drawnLayersRef.current.push(layerCoreId);
      });
    }
    // Compare Routes rendering
    else if (routeData?.routes && !fleet) {
      routeData.routes.forEach((r: any, idx: number) => {
        if (!r.polyline || r.polyline.length < 2) return;
        const isBaseline = r.kind === "baseline";
        if ((isBaseline && !baseline) || (!isBaseline && !optimized)) return;

        const coords: [number, number][] = r.polyline.map(([lat, lon]: [number, number]) => [lon, lat]);
        coords.forEach((c) => allCoords.push(c));

        const sourceId = `compare-source-${idx}-${r.kind}`;
        const layerGlowId = `compare-glow-${idx}-${r.kind}`;
        const layerCoreId = `compare-core-${idx}-${r.kind}`;

        instance.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
          },
        });
        drawnSourcesRef.current.push(sourceId);

        if (!isBaseline) {
          instance.addLayer({
            id: layerGlowId,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": "#06b6d4",
              "line-width": 8,
              "line-opacity": 0.45,
              "line-blur": 2,
            },
          });
          drawnLayersRef.current.push(layerGlowId);
        }

        instance.addLayer({
          id: layerCoreId,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isBaseline ? "#94a3b8" : "#06b6d4",
            "line-width": isBaseline ? 3.5 : 5,
            "line-opacity": 0.95,
            ...(isBaseline ? { "line-dasharray": [2, 2] } : {}),
          },
        });
        drawnLayersRef.current.push(layerCoreId);
      });
    }

    // Stop & Depot Markers
    if (routeData?.points && Array.isArray(routeData.points)) {
      routeData.points.forEach((pt: any) => {
        if (!Number.isFinite(pt.lat) || !Number.isFinite(pt.lon)) return;
        allCoords.push([pt.lon, pt.lat]);

        const el = document.createElement("div");
        el.className = "qidre-marker";
        if (pt.type === "depot") {
          el.title = "Central Depot (Dispatch Hub)";
          el.innerHTML = `
            <div style="background: #10b981; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; box-shadow: 0 0 16px rgba(16,185,129,0.8); border: 2px solid white; display: flex; align-items: center; gap: 4px; cursor: pointer; transform: scale(1); transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform='scale(1)'">
              <span>🏭 DEPOT</span>
            </div>`;
        } else if (pt.type === "source") {
          el.title = "Origin / Pickup Point (A)";
          el.innerHTML = `
            <div style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 50%; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(16,185,129,0.8); border: 2px solid white; cursor: pointer; transform: scale(1); transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">
              A
            </div>`;
        } else if (pt.type === "destination") {
          el.title = "Destination / Dropoff Point (B)";
          el.innerHTML = `
            <div style="background: #f43f5e; color: white; width: 28px; height: 28px; border-radius: 50%; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(244,63,94,0.8); border: 2px solid white; cursor: pointer; transform: scale(1); transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">
              B
            </div>`;
        } else {
          el.title = `Delivery Stop #${pt.label || ""}`;
          el.innerHTML = `
            <div style="background: #0ea5e9; color: white; width: 26px; height: 26px; border-radius: 50%; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(14,165,233,0.7); border: 2px solid white; cursor: pointer; transform: scale(1); transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">
              ${pt.label || "•"}
            </div>`;
        }

        const marker = new ml.Marker({ element: el })
          .setLngLat([pt.lon, pt.lat])
          .addTo(instance);
        markersRef.current.push(marker);
      });
    }

    // Auto fit-bounds to frame the route immediately
    if (allCoords.length > 0) {
      const bounds = new ml.LngLatBounds();
      allCoords.forEach((c) => bounds.extend(c));
      instance.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 70, right: 70 },
        maxZoom: 15,
        duration: 900,
      });
    }
  }, [routeData, baseline, optimized, fleet, mapReady]);

  return (
    <div className="relative size-full overflow-hidden rounded-md border border-border bg-card">
      <div ref={mapContainer} className="size-full" />
      <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-md border border-border bg-surface/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-panel backdrop-blur-md">
        <Satellite className="size-3.5 text-primary" /> {areaMeta(areaId).label}
        <span className="mx-1 h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <span className={cn("size-2 rounded-full", tomtomKey ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-cyan-400")} />
          {tomtomKey ? "TomTom HD Maps" : "CARTO Detailed"}
        </span>
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

function CompareView({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [areaId, setAreaId] = useState<AreaId>("bkc");
  const [source, setSource] = useState("Bandra Kurla Complex, Mumbai");
  const [destination, setDestination] = useState("Santacruz East, Mumbai");
  const [stops, setStops] = useState<string[]>([]);
  const [baseline, setBaseline] = useState(true);
  const [showFastest, setShowFastest] = useState(true);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [routePoints, setRoutePoints] = useState<Array<{ type: string; lat: number; lon: number; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAreaChange = (newArea: AreaId) => {
    setAreaId(newArea);
    setComparison(null);
    setRoutePoints([]);
    if (newArea === "borivali") {
      setSource("Western Edge, Borivali East, Mumbai");
      setDestination("Malad East, Mumbai");
    } else if (newArea === "bkc") {
      setSource("Bandra Kurla Complex, Mumbai");
      setDestination("Santacruz East, Mumbai");
    } else if (newArea === "andheri") {
      setSource("Andheri East, Mumbai");
      setDestination("Juhu, Mumbai");
    } else if (newArea === "lower_parel") {
      setSource("Lower Parel, Mumbai");
      setDestination("Worli, Mumbai");
    } else if (newArea === "churchgate") {
      setSource("Churchgate, Mumbai");
      setDestination("Colaba, Mumbai");
    } else if (newArea === "powai") {
      setSource("IIT Bombay, Powai, Mumbai");
      setDestination("Vikhroli West, Mumbai");
    }
  };

  const recalculate = async () => {
    setLoading(true);
    setError("");
    setComparison(null);
    setRoutePoints([]);
    try {
      const sourcePoint = await geocode(source, areaId);
      if (!sourcePoint) throw new Error(`Could not find “${source}”. Please check address or try a nearby landmark.`);
      const destinationPoint = await geocode(destination, areaId);
      if (!destinationPoint) throw new Error(`Could not find “${destination}”. Please check address or try a nearby landmark.`);

      // Auto-detect if coordinates match another area better
      const bestSourceArea = findClosestArea(sourcePoint.lat, sourcePoint.lon);
      const activeArea = (bestSourceArea !== areaId && Math.hypot(sourcePoint.lat - areaMeta(areaId).center.lat, sourcePoint.lon - areaMeta(areaId).center.lon) > 0.08) ? bestSourceArea : areaId;
      if (activeArea !== areaId) {
        setAreaId(activeArea);
      }

      await loadGraph(activeArea);

      const stopPoints: Array<{ lat: number; lon: number }> = [];
      for (const stop of stops.filter((value) => value.trim())) {
        const point = await geocode(stop, activeArea);
        if (!point) throw new Error(`Could not find “${stop}”. Please check address.`);
        stopPoints.push({ lat: point.lat, lon: point.lon });
      }

      const result = await compareRoutes({
        area: activeArea,
        source: { lat: sourcePoint.lat, lon: sourcePoint.lon },
        destination: { lat: destinationPoint.lat, lon: destinationPoint.lon },
        stops: stopPoints,
      });
      setComparison(result);
      setRoutePoints([
        { type: "source", lat: sourcePoint.lat, lon: sourcePoint.lon, label: "A" },
        ...stopPoints.map((p, i) => ({ type: "stop", lat: p.lat, lon: p.lon, label: `${i + 1}` })),
        { type: "destination", lat: destinationPoint.lat, lon: destinationPoint.lon, label: "B" },
      ]);
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
    points: routePoints,
  } : null;

  return (
    <section className="grid h-full min-h-0 gap-4 overflow-hidden p-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-5">
      <ScrollArea className="min-h-0 rounded-md border border-border bg-card/70 shadow-panel backdrop-blur-md">
        <div className="space-y-5 p-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><RouteIcon className="size-4 text-primary" /> Route Setup</div>
            <p className="mt-1 text-xs text-muted-foreground">Compare shortest distance with fastest graph travel time across any Mumbai corridor.</p>
          </div>
          <div className="grid gap-4">
            <SelectField
              label="Service Area"
              value={areaId}
              onValueChange={(val) => handleAreaChange(val as AreaId)}
              options={AREAS.map(({ id, label }) => [id, label])}
            />
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
            <Button onClick={recalculate} disabled={loading} className="h-10 bg-primary text-primary-foreground shadow-neon-cyan hover:bg-primary/90">
              {loading ? <><Activity className="animate-spin" /> Looking up routes</> : <><Sparkles /> Recalculate comparison</>}
            </Button>
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
      <div className="min-h-[300px] min-w-0"><MapCanvas baseline={baseline} optimized={showFastest} routeData={compareMapData} areaId={areaId} theme={theme} /></div>
    </section>
  );
}

function MetricColumn({ label, distance, time, tone }: { label: string; distance: string; time: string; tone: "baseline" | "primary" }) {
  return <div className="min-w-0"><div className={cn("mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]", tone === "primary" ? "text-primary" : "text-baseline")}>{label}</div><div className="font-mono text-xl font-semibold text-foreground">{distance}<span className="ml-1 text-[10px] font-normal text-muted-foreground">km</span></div><div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> {time} min</div></div>;
}

function RouteToggle({ label, checked, onCheckedChange, tone }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; tone: "baseline" | "primary" }) {
  return <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-3 py-2.5"><span className="flex items-center gap-2 text-xs text-foreground"><span className={cn("size-2 rounded-full", tone === "primary" ? "bg-primary shadow-neon-cyan" : "bg-baseline")} />{label}</span><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={`Show ${label}`} /></div>;
}

function FleetView({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [areaId, setAreaId] = useState<AreaId>("bkc");
  const [stopLocations, setStopLocations] = useState<string[]>([areaMeta("bkc").label]);
  const [algorithm, setAlgorithm] = useState("qpso");
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
  const [fleetPoints, setFleetPoints] = useState<Array<{ type: string; lat: number; lon: number; label: string }>>([]);
  const [ecoMetrics, setEcoMetrics] = useState<any>(null);
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
    { label: "Total Distance", value: `${routeData.routes.reduce((sum: number, route: any) => sum + (route.distance_km || 0), 0).toFixed(1)} km`, icon: Navigation },
    { label: "Travel Time", value: `${routeData.routes.reduce((sum: number, route: any) => sum + (route.travel_time_min || 0), 0).toFixed(0)} min`, icon: Clock3 },
    { label: "Vehicles Used", value: `${routeData.routes.filter((route: any) => route.stop_count > 0).length}`, icon: Truck },
    { label: "CO₂ Emissions", value: routeData.emissions ? `${routeData.emissions.total_co2_kg?.toFixed(2) ?? "0.00"} kg` : "0.00 kg", icon: Leaf },
    { label: "Solve Time", value: `${routeData.elapsed_s?.toFixed(2) ?? "0.00"} s`, icon: Gauge },
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
      let activeArea = areaId;
      const firstLoc = stopLocations[0]?.trim();
      if (firstLoc) {
        const sampleHit = await geocode(firstLoc, areaId);
        if (sampleHit) {
          const closest = findClosestArea(sampleHit.lat, sampleHit.lon);
          const currentCenter = areaMeta(areaId).center;
          if (closest !== areaId && Math.hypot(sampleHit.lat - currentCenter.lat, sampleHit.lon - currentCenter.lon) > 0.08) {
            activeArea = closest;
            setAreaId(activeArea);
          }
        }
      }

      const depot = areaMeta(activeArea).center;
      await loadGraph(activeArea);
      const resolvedStops: Array<{ id: number; lat: number; lon: number; demand: number; service_time_min: number }> = [];
      for (const [index, location] of stopLocations.entries()) {
        if (!location.trim()) throw new Error(`Enter a location for stop ${index + 1}.`);
        const hit = await geocode(location, activeArea);
        if (!hit) throw new Error(`Could not find “${location}”. Please check spelling.`);
        resolvedStops.push({
          id: index + 1,
          lat: hit.lat,
          lon: hit.lon,
          demand: 1,
          service_time_min: 15.0,
        });
        setProgress(Math.round(((index + 1) / stopLocations.length) * 10));
      }

      const points = [
        { type: "depot", lat: depot.lat, lon: depot.lon, label: "DEPOT" },
        ...resolvedStops.map((s, i) => ({ type: "stop", lat: s.lat, lon: s.lon, label: `${i + 1}` })),
      ];
      setFleetPoints(points);

      const generatedVehicles = Array.from({ length: fleetCount }).map((_, i) => ({
        id: i + 1,
        capacity: 50,
        speed_kmh: 40.0,
        cost_per_km: 15.0,
        cost_per_hour: 200.0,
        is_ev: i % 2 === 0, // Alternate EV and conventional
        type: i % 2 === 0 ? "ev_van" : "ice_lcv",
      }));

      const { job_id: jobId } = await startRouteJob({
        area: activeArea,
        depot_lat: depot.lat,
        depot_lon: depot.lon,
        stops: resolvedStops,
        vehicles: generatedVehicles,
        algorithm,
        qpso_config: { max_iterations: 50, population_size: 40 },
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
          setRouteData({ ...parsed.result, points });
          setProgress(100);
          setRunning(false);
          setRun((r) => r + 1);
          eventSource.close();
          fetchEcoMetrics().then(setEcoMetrics).catch(console.warn);
        }
      };
      eventSource.onerror = () => {
        setError("Optimization streaming disconnected. Backend solve may still have completed.");
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
                <SelectField label="Algorithm" value={algorithm} onValueChange={setAlgorithm} options={[["qpso", "QPSO — Quantum Swarm"], ["ga", "GA — Genetic Algorithm"], ["aco", "ACO — Ant Colony"]]} />
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground"><span>Delivery Locations</span><span>{stopCount}/15</span></div>
                  {stopLocations.map((location, index) => (
                    <div key={index} className="flex gap-2">
                      <Input aria-label={`Delivery location ${index + 1}`} value={location} onChange={(event) => setStopLocations(stopLocations.map((item, i) => i === index ? event.target.value : item))} placeholder="Search Mumbai address" className="h-9 border-border bg-input/40" />
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
                {ecoMetrics && (
                  <div className="space-y-3">
                    <div className="rounded-md border border-border/80 bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Driver Ergonomics & Wellness</span>
                        <span className={cn("rounded px-2 py-0.5 font-mono text-[10px] font-semibold", ecoMetrics.gini_compliant ? "bg-status/10 text-status" : "bg-destructive/10 text-destructive")}>
                          {ecoMetrics.gini_compliant ? "Gini Compliant (≤0.15)" : "Equity Warning"}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {ecoMetrics.driver_wellness?.map((dw: any) => (
                          <div key={dw.driver_index} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Driver #{dw.driver_index + 1}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-foreground">{dw.cognitive_stress.toFixed(1)} stress</span>
                              <span className={cn("rounded px-1.5 py-0.5 text-[9px] uppercase", dw.wellness_level === "optimal" ? "bg-status/10 text-status" : dw.wellness_level === "demanding" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>
                                {dw.wellness_label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-border/80 bg-muted/30 p-3">
                      <span className="text-xs font-semibold text-foreground">Thermodynamic Energy Engine</span>
                      <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs">
                        <div className="rounded bg-background/50 p-2"><div className="text-[10px] text-muted-foreground">Electric Energy</div><div className="text-foreground">{ecoMetrics.fleet_energy_kwh?.toFixed(2) ?? "0.00"} kWh</div></div>
                        <div className="rounded bg-background/50 p-2"><div className="text-[10px] text-muted-foreground">CO₂ Saved vs ICE</div><div className="text-status">+{ecoMetrics.co2_saved_vs_all_ice_kg?.toFixed(2) ?? "0.00"} kg</div></div>
                      </div>
                    </div>
                  </div>
                )}
                <Suspense fallback={<p className="rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">Loading analytics…</p>}>
                  {routeData?.convergence?.length ? <MiniChart title="Convergence" subtitle="Best fitness by iteration" data={routeData.convergence.map((value: number, i: number) => ({ i, value }))} dataKey="value" color="var(--primary)" /> : <p className="rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">Run an optimization to see convergence data.</p>}
                  {routeData?.diversity?.length ? <MiniChart title="Population Diversity" subtitle="Swarm diversity by iteration" data={routeData.diversity.map((value: number, i: number) => ({ i, value }))} dataKey="value" color="var(--quantum)" /> : null}
                </Suspense>
              </div></ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
        <div className="relative min-h-[300px] min-w-0">
          <MapCanvas
            baseline={false}
            showTraffic={trafficVisible}
            trafficSegments={trafficSegments}
            nodes={nodes}
            fleet
            routeData={routeData ?? (fleetPoints.length > 0 ? { points: fleetPoints } : null)}
            areaId={areaId}
            theme={theme}
          />
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

function SimulatorView() {
  const [scenarioId, setScenarioId] = useState("rain_5pm");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [tips, setTips] = useState<CorrectiveTip[]>([]);
  const [appliedTips, setAppliedTips] = useState<string[]>([]);

  useEffect(() => {
    simulateScenario(scenarioId).then(setResult).catch(console.error);
    fetchCorrectiveTips().then(setTips).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimulate = async (id: string) => {
    setScenarioId(id);
    setLoading(true);
    try {
      const data = await simulateScenario(id);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTip = async (tipId: string, action: "apply" | "dismiss") => {
    try {
      await takeTipAction(tipId, action);
      if (action === "apply") {
        setAppliedTips((prev) => [...prev, tipId]);
      } else {
        setTips((prev) => prev.filter((t) => t.id !== tipId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <FlaskConical className="size-5 text-primary" /> Scenario Simulator & Corrective Tips (Modules C & D)
        </div>
        <p className="text-xs text-muted-foreground">
          Stress-test proposed routes against sudden monsoon downpours, festival exodus surges, and battery thermal derating.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "rain_5pm", label: "Heavy Monsoon at 5 PM", icon: CloudRain },
          { id: "long_weekend", label: "Long Weekend Outbound", icon: Calendar },
          { id: "breakdown_2v", label: "Two EV Breakdowns", icon: AlertTriangle },
          { id: "visarjan_rush", label: "Ganesh Visarjan Rush", icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          const active = scenarioId === item.id;
          return (
            <Button
              key={item.id}
              size="sm"
              variant={active ? "default" : "outline"}
              disabled={loading}
              onClick={() => handleSimulate(item.id)}
              className={cn("gap-1.5 text-xs", active && "bg-primary text-primary-foreground shadow-neon-cyan")}
            >
              {active && loading ? <RefreshCw className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
              {item.label}
            </Button>
          );
        })}
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-md border-border bg-card/70 p-4 shadow-panel backdrop-blur-md lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-foreground">{result.scenario.title}</h3>
                <p className="text-xs text-muted-foreground">{result.scenario.description}</p>
              </div>
              <span className="rounded bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                P90 Band: {result.simulated.p90_duration_range || "—"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="text-[10px] uppercase text-muted-foreground">On-Time Delivery</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{result.simulated.on_time_pct}%</div>
                <div className="mt-1 flex items-center text-[10px] text-destructive">
                  <TrendingDown className="mr-0.5 size-3" /> -{result.deltas.on_time_drop_pct}% vs baseline
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="text-[10px] uppercase text-muted-foreground">Transit Duration</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{result.simulated.total_travel_time_min}m</div>
                <div className="mt-1 flex items-center text-[10px] text-warning">
                  <TrendingUp className="mr-0.5 size-3" /> +{result.deltas.travel_time_min}m slowdown
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="text-[10px] uppercase text-muted-foreground">Operating Cost</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">₹{result.simulated.total_cost_inr}</div>
                <div className="mt-1 flex items-center text-[10px] text-destructive">
                  <TrendingUp className="mr-0.5 size-3" /> +₹{result.deltas.cost_inr} fuel/delay
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="text-[10px] uppercase text-muted-foreground">Peak Driver Strain</span>
                <div className="mt-1 font-mono text-xl font-bold text-destructive">{result.simulated.peak_driver_strain}</div>
                <div className="mt-1 text-[10px] text-destructive">Burnout Band (Red)</div>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">
              <span className="font-semibold text-primary">Simulated Mitigation Strategy: </span>
              <span className="text-muted-foreground">{result.recommended_mitigation}</span>
            </div>
          </Card>

          <Card className="rounded-md border-border bg-card/70 p-4 shadow-panel backdrop-blur-md">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldAlert className="size-4 text-warning" /> Corrective Action Tips (Ranked)
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Maximum 3 explainable advice cards generated by rule engine.</p>

            <div className="mt-4 space-y-3">
              {tips.map((tip) => {
                const applied = appliedTips.includes(tip.id);
                return (
                  <div key={tip.id} className={cn("rounded-md border p-3 text-xs transition-colors", applied ? "border-status/40 bg-status/5" : "border-border bg-muted/30")}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-foreground">{tip.title}</span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-primary">
                        {tip.confidence_pct}% conf
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{tip.action}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[10px]">
                      <span className="rounded bg-status/10 px-1.5 py-0.5 text-status">-{tip.benefits.time_saved_min}m</span>
                      <span className="rounded bg-status/10 px-1.5 py-0.5 text-status">₹{tip.benefits.cost_saved_inr} saved</span>
                      <span className="rounded bg-quantum/10 px-1.5 py-0.5 text-quantum">-{tip.benefits.strain_reduction} WSI</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {applied ? (
                        <div className="flex items-center gap-1 font-semibold text-status"><CheckCircle2 className="size-3.5" /> Applied to Fleet</div>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleTip(tip.id, "apply")} className="h-7 bg-primary px-3 text-[11px] text-primary-foreground">Apply</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleTip(tip.id, "dismiss")} className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive">Dismiss</Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}

function OperationsView() {
  const [data, setData] = useState<WeatherFestiveSummary | null>(null);
  const [wellbeing, setWellbeing] = useState<WellbeingSummary | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = () => {
    fetchWeatherFestive().then(setData).catch(console.error);
    fetchDriverWellbeing().then(setWellbeing).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWeatherChange = async (condition: string) => {
    setUpdating(true);
    try {
      const updated = await updateWeatherFestive({
        condition,
        rainfall_mm_hr: condition === "Heavy Monsoon" ? 50.0 : condition === "Light Rain" ? 15.0 : 0.0,
        waterlogging_risk: condition === "Heavy Monsoon" ? "High" : "Low",
      });
      setData(updated);
    } finally {
      setUpdating(false);
    }
  };

  const handleFestiveChange = async (festive_mode: string) => {
    setUpdating(true);
    try {
      const updated = await updateWeatherFestive({ festive_mode });
      setData(updated);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <HeartHandshake className="size-5 text-primary" /> Weather, Festive & Driver Wellbeing (Modules A & B)
        </div>
        <p className="text-xs text-muted-foreground">
          Calibrated Mumbai environmental impact modeling paired with humane driver Workload Strain Index (WSI) monitoring.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-md border-border bg-card/70 p-4 shadow-panel backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <CloudRain className="size-4 text-primary" /> Module A: Weather & Festive Delay Engine
            </div>
            {data && (
              <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                Demand: ×{data.system_impact.fleet_demand_surge}
              </span>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Weather Scenario Preset</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {[
                  { name: "Clear", icon: Sun },
                  { name: "Light Rain", icon: Umbrella },
                  { name: "Heavy Monsoon", icon: CloudRain },
                  { name: "Heatwave", icon: Flame },
                ].map((w) => {
                  const Icon = w.icon;
                  const active = data?.weather.condition === w.name;
                  return (
                    <Button
                      key={w.name}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      disabled={updating}
                      onClick={() => handleWeatherChange(w.name)}
                      className={cn("gap-1 text-xs", active && "bg-primary text-primary-foreground")}
                    >
                      <Icon className="size-3.5" /> {w.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-muted-foreground">Festive / Holiday Calendar</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {["Normal Weekday", "Long Weekend", "Ganesh Visarjan", "Diwali Peak"].map((mode) => {
                  const active = data?.festive.mode === mode;
                  return (
                    <Button
                      key={mode}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      disabled={updating}
                      onClick={() => handleFestiveChange(mode)}
                      className={cn("text-xs", active && "bg-primary text-primary-foreground")}
                    >
                      {mode}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3">
              <span className="text-xs font-semibold text-foreground">Mumbai Zone Delay Multipliers</span>
              <div className="mt-2 space-y-2">
                {data && Object.entries(data.zones).map(([zid, zone]) => (
                  <div key={zid} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{zone.name}</span>
                      <span className="text-[10px] text-muted-foreground">({zone.flood_risk})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">×{zone.delay_multiplier} delay</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px] uppercase", zone.status === "Normal" ? "bg-status/10 text-status" : zone.status === "Moderate" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>
                        {zone.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-md border-border bg-card/70 p-4 shadow-panel backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Activity className="size-4 text-primary" /> Module B: Driver Workload Strain Index (WSI)
            </div>
            {wellbeing && (
              <span className={cn("rounded px-2 py-0.5 font-mono text-xs font-semibold", wellbeing.gini_compliant ? "bg-status/10 text-status" : "bg-destructive/10 text-destructive")}>
                Gini: {wellbeing.gini_coefficient} (Compliant)
              </span>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded bg-status/10 p-2.5">
                <div className="font-mono text-lg font-bold text-status">{wellbeing?.optimal_count ?? 0}</div>
                <div className="text-[10px] text-muted-foreground">Optimal (&lt;40)</div>
              </div>
              <div className="rounded bg-warning/10 p-2.5">
                <div className="font-mono text-lg font-bold text-warning">{wellbeing?.demanding_count ?? 0}</div>
                <div className="text-[10px] text-muted-foreground">Demanding (40–70)</div>
              </div>
              <div className="rounded bg-destructive/10 p-2.5">
                <div className="font-mono text-lg font-bold text-destructive">{wellbeing?.burnout_risk_count ?? 0}</div>
                <div className="text-[10px] text-muted-foreground">Burnout Risk (&gt;70)</div>
              </div>
            </div>

            <div className="space-y-3">
              {wellbeing?.drivers.map((driver) => (
                <div key={driver.id} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">{driver.name}</span>
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">({driver.vehicle})</span>
                    </div>
                    <span className={cn("rounded px-2 py-0.5 font-mono text-xs font-semibold", driver.band === "green" ? "bg-status/10 text-status" : driver.band === "amber" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>
                      WSI {driver.wsi_score} · {driver.label}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full transition-all duration-500", driver.band === "green" ? "bg-status" : driver.band === "amber" ? "bg-warning" : "bg-destructive")}
                      style={{ width: `${Math.min(100, driver.wsi_score)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>Driving: {driver.driving_hr}h</span>
                    <span>Max stretch: {driver.longest_stretch_min}m</span>
                    <span>Break deficit: {driver.break_deficit_min}m</span>
                    <span>Stops: {driver.stops}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] leading-relaxed text-muted-foreground">
              ⚖️ DPDP Act 2023 Notice: WSI is an algorithmic route planning safeguard. Data is strictly used for route balancing, never for individual driver penalization.
            </p>
          </div>
        </Card>
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("qidre-theme") : null;
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("qidre-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const activeView = useMemo(
    () => ({
      home: <HomeView onChange={setView} />,
      compare: <CompareView theme={theme} />,
      fleet: <FleetView theme={theme} />,
      simulator: <SimulatorView />,
      operations: <OperationsView />,
    })[view],
    [view, theme]
  );

  return (
    <TooltipProvider>
      <main className="flex h-dvh min-h-[600px] flex-col overflow-hidden bg-background text-foreground transition-colors duration-200">
        <TopNav view={view} onChange={setView} theme={theme} onToggleTheme={toggleTheme} />
        <div className="min-h-0 flex-1 overflow-hidden">{activeView}</div>
        <Tooltip><TooltipTrigger asChild><div className="fixed bottom-3 left-3 z-40 hidden size-2 rounded-full bg-status shadow-neon-status lg:block" /></TooltipTrigger><TooltipContent side="right">Optimization engine online</TooltipContent></Tooltip>
      </main>
    </TooltipProvider>
  );
}
