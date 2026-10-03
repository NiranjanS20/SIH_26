export const API_BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000";

export const AREAS = [
  { id: "bkc", label: "BKC, Mumbai", center: { lat: 19.0654, lon: 72.8656 } },
  { id: "churchgate", label: "Churchgate, Mumbai", center: { lat: 18.9322, lon: 72.8264 } },
  { id: "lower_parel", label: "Lower Parel, Mumbai", center: { lat: 18.9953, lon: 72.83 } },
  { id: "andheri", label: "Andheri, Mumbai", center: { lat: 19.1136, lon: 72.8697 } },
  { id: "powai", label: "Powai, Mumbai", center: { lat: 19.1176, lon: 72.906 } },
  { id: "borivali", label: "Borivali, Mumbai", center: { lat: 19.2288, lon: 72.8569 } },
] as const;

export type AreaId = (typeof AREAS)[number]["id"];

export function areaMeta(id: string) {
  return AREAS.find((a) => a.id === id) ?? AREAS[0];
}

/** Stops within ~5 km of BKC so they snap onto the OSM graph. */
export const BKC_STOPS = [
  { lat: 19.0668, lon: 72.8692 },
  { lat: 19.0602, lon: 72.8554 },
  { lat: 19.0726, lon: 72.8826 },
  { lat: 19.0755, lon: 72.8618 },
  { lat: 19.0548, lon: 72.8404 },
  { lat: 19.051, lon: 72.889 },
  { lat: 19.0812, lon: 72.8415 },
  { lat: 19.0699, lon: 72.878 },
  { lat: 19.0465, lon: 72.863 },
  { lat: 19.0588, lon: 72.8772 },
  { lat: 19.0622, lon: 72.851 },
  { lat: 19.0705, lon: 72.8688 },
  { lat: 19.0595, lon: 72.868 },
  { lat: 19.064, lon: 72.8595 },
  { lat: 19.078, lon: 72.869 },
];

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    return JSON.stringify(body.detail ?? body);
  } catch {
    return res.statusText;
  }
}

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export type Health = {
  status: string;
  version: string;
  graph_loaded: boolean;
  area: string | null;
};

export function getHealth() {
  return jsonFetch<Health>("/health");
}

export function loadGraph(area: string) {
  return jsonFetch<{ area: string; num_nodes: number; num_edges: number }>("/graph/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area }),
  });
}

export type TrafficRefreshResponse = {
  source: string;
  area: string;
  refreshed_at: string | null;
  requested: number;
  updated: number;
  failed_or_low_confidence: number;
  edges: Array<{
    u: number;
    v: number;
    speed_kmh: number;
    confidence: number;
    free_flow_speed_kmh: number;
    geometry: number[][];
  }>;
};

export type TrafficSegment = TrafficRefreshResponse["edges"][number];

export function refreshLiveTraffic(maxSegments = 20) {
  return jsonFetch<TrafficRefreshResponse>("/graph/traffic/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ max_segments: maxSegments }),
  });
}

export type GeoHit = { display_name: string; lat: number; lon: number };

export async function geocode(q: string, area?: string): Promise<GeoHit | null> {
  const query = q.trim();
  if (!query) return null;
  const params = new URLSearchParams({ q: query.includes("Mumbai") ? query : `${query}, Mumbai` });
  if (area) params.set("area", area);
  const hits = await jsonFetch<GeoHit[]>(`/geocode/search?${params}`);
  const hit = hits[0];
  if (!hit) return null;
  return { ...hit, lat: Number(hit.lat), lon: Number(hit.lon) };
}

export type CompareResponse = {
  baseline: {
    method: string;
    cost_basis: string;
    distance_km: number;
    time_min: number;
    geometry: { type: string; geometry: { type: string; coordinates: Array<number[] | string> } };
  };
  ours: {
    method: string;
    cost_basis: string;
    distance_km: number;
    time_min: number;
    geometry: { type: string; geometry: { type: string; coordinates: Array<number[] | string> } };
  };
  identical: boolean;
  traffic_aware: boolean;
  traffic_source: string;
  traffic_refreshed_at: string | null;
  traffic_updated_edges: number;
};

export function compareRoutes(body: {
  area: string;
  source: { lat: number; lon: number };
  destination: { lat: number; lon: number };
  stops: Array<{ lat: number; lon: number }>;
}) {
  return jsonFetch<CompareResponse>("/route/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export type FleetRoute = {
  vehicle_id: number;
  stops: Array<{ stop_id: number; lat: number; lon: number }>;
  distance_km: number;
  travel_time_min: number;
  polyline: number[][];
};

export type FleetResult = {
  routes: FleetRoute[];
  elapsed_s: number;
  algorithm: string;
  emissions?: { total_co2_kg?: number };
  convergence?: number[];
  depot?: { lat: number; lon: number };
};

export function startRouteJob(body: Record<string, unknown>) {
  return jsonFetch<{ job_id: string }>("/route/job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function solveRoute(body: Record<string, unknown>) {
  return jsonFetch<FleetResult>("/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function jobStreamUrl(jobId: string) {
  return `${API_BASE}/route/job/${jobId}/stream`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Operations Intelligence API Helpers (Modules A, B, C, D)
// ─────────────────────────────────────────────────────────────────────────────

export type WeatherFestiveSummary = {
  weather: {
    condition: string;
    rainfall_mm_hr: number;
    forecast_1h_mm: number;
    rain_prob_pct: number;
    heat_index_c: number;
    waterlogging_risk: string;
  };
  festive: {
    mode: string;
    is_public_holiday: boolean;
    is_long_weekend: boolean;
    active_event: string | null;
  };
  system_impact: {
    weather_uplift_pct: number;
    festive_uplift_pct: number;
    fleet_demand_surge: number;
    confidence: string;
  };
  zones: Record<string, {
    name: string;
    delay_multiplier: number;
    demand_surge_factor: number;
    flood_risk: string;
    status: string;
  }>;
};

export function fetchWeatherFestive() {
  return jsonFetch<WeatherFestiveSummary>("/operations/weather-festive");
}

export function updateWeatherFestive(data: { condition?: string; rainfall_mm_hr?: number; waterlogging_risk?: string; festive_mode?: string }) {
  return jsonFetch<WeatherFestiveSummary>("/operations/weather-festive/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export type WellbeingSummary = {
  drivers: Array<{
    id: number;
    name: string;
    vehicle: string;
    wsi_score: number;
    band: "green" | "amber" | "red";
    label: string;
    driving_hr: number;
    longest_stretch_min: number;
    break_deficit_min: number;
    stops: number;
  }>;
  average_wsi: number;
  peak_wsi: number;
  gini_coefficient: number;
  gini_threshold: number;
  gini_compliant: boolean;
  burnout_risk_count: number;
  demanding_count: number;
  optimal_count: number;
};

export function fetchDriverWellbeing() {
  return jsonFetch<WellbeingSummary>("/operations/wellbeing");
}

export type SimulationResult = {
  scenario: {
    id: string;
    title: string;
    description: string;
    weather: string;
    festive: string;
    fleet: string;
  };
  baseline: {
    on_time_pct: number;
    total_travel_time_min: number;
    total_cost_inr: number;
    co2_emissions_kg: number;
    peak_driver_strain: number;
    fleet_delay_ratio: number;
  };
  simulated: {
    on_time_pct: number;
    total_travel_time_min: number;
    total_cost_inr: number;
    co2_emissions_kg: number;
    peak_driver_strain: number;
    fleet_delay_ratio: number;
    p90_duration_range?: string;
    sla_failure_prob?: number;
  };
  deltas: {
    travel_time_min: number;
    cost_inr: number;
    strain_points: number;
    on_time_drop_pct: number;
  };
  recommended_mitigation: string;
};

export function simulateScenario(scenarioId: string) {
  return jsonFetch<SimulationResult>("/operations/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_id: scenarioId }),
  });
}

export type CorrectiveTip = {
  id: string;
  title: string;
  category: string;
  urgency: "high" | "medium" | "low";
  trigger: string;
  evidence: string;
  action: string;
  benefits: {
    time_saved_min: number;
    cost_saved_inr: number;
    co2_saved_kg: number;
    strain_reduction: number;
  };
  confidence_pct: number;
  status: string;
};

export function fetchCorrectiveTips() {
  return jsonFetch<CorrectiveTip[]>("/operations/tips");
}

export function takeTipAction(tipId: string, action: "apply" | "dismiss") {
  return jsonFetch<{ tip_id: string; status: string; success: boolean }>(`/operations/tips/${tipId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

export function fetchEcoMetrics() {
  return jsonFetch<Record<string, any>>("/fleet/eco-metrics");
}

export type QuantumHardwareStatus = {
  status: string;
  qiskit_version: string;
  ibm_token_configured: boolean;
  local_simulator: string;
  ibm_channel: string;
  connected_hardware: Array<{ name: string; num_qubits: number; operational: boolean }>;
  least_busy_backend: string;
  qubits_available: number;
  nisq_boundary_stops: number;
  ibm_connection_error?: string;
};

export function fetchQuantumStatus() {
  return jsonFetch<QuantumHardwareStatus>("/quantum/status");
}

let _clientTomTomKey = (import.meta.env["VITE_TOMTOM_API_KEY"] as string | undefined) ?? "";

export async function fetchClientConfig(): Promise<{ tomtom_configured?: boolean; tomtom_api_key?: string }> {
  try {
    const res = await jsonFetch<{ tomtom_configured?: boolean; tomtom_api_key?: string }>("/config");
    if (res.tomtom_api_key) {
      _clientTomTomKey = res.tomtom_api_key;
    }
    return res;
  } catch {
    return { tomtom_configured: Boolean(_clientTomTomKey), tomtom_api_key: _clientTomTomKey };
  }
}

export function getTomTomKey(): string {
  return _clientTomTomKey || ((import.meta.env["VITE_TOMTOM_API_KEY"] as string | undefined) ?? "");
}

export function setTomTomKey(key: string): void {
  _clientTomTomKey = key;
}

