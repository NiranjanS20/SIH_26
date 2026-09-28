export const API_BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000";

export const AREAS = [
  { id: "bkc", label: "BKC, Mumbai", center: { lat: 19.0654, lon: 72.8656 } },
  { id: "churchgate", label: "Churchgate, Mumbai", center: { lat: 18.9322, lon: 72.8264 } },
  { id: "lower_parel", label: "Lower Parel, Mumbai", center: { lat: 18.9953, lon: 72.83 } },
  { id: "andheri", label: "Andheri, Mumbai", center: { lat: 19.1136, lon: 72.8697 } },
  { id: "powai", label: "Powai, Mumbai", center: { lat: 19.1176, lon: 72.906 } },
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
    distance_km: number;
    time_min: number;
    geometry: { type: string; geometry: { type: string; coordinates: Array<number[] | string> } };
  };
  ours: {
    distance_km: number;
    time_min: number;
    geometry: { type: string; geometry: { type: string; coordinates: Array<number[] | string> } };
  };
  identical: boolean;
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
