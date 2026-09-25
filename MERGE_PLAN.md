# MERGE_PLAN.md — QIDRE SIH 2026

> **Phase 0 Discovery & Merge Plan**
> Generated 2026-09-25 after full inventory of both projects.

---

## 1. Repo Inventory

### 1A. Original project (root)

| Path | What it is | Status |
|---|---|---|
| `run.py` | Uvicorn entry point | Working |
| `src/api/main.py` | FastAPI app, 480 lines, endpoints: `/`, `/graph/load`, `/graph`, `/graph/traffic`, `/route`, `/route/benchmark`, `/metrics` | Functional but has issues (see §3) |
| `src/graph/loader.py` | OSM loading via osmnx + synthetic graph generator. 5 Mumbai area presets (BKC, Churchgate, Lower Parel, Andheri, Powai). No GraphML caching. | Partially working |
| `src/graph/spatial_index.py` | KDTree nearest-node via scipy. No bbox validation. | Working, needs extension |
| `src/oracle/ch.py` | Contraction Hierarchies distance oracle. Bidirectional Dijkstra query + dynamic update. 413 lines. | Working on synthetic, CH path reconstruction through shortcuts is incorrect (returns CH-path nodes, not original road-network nodes). Runs on copy of graph (deepcopy). |
| `src/optimizer/encoding.py` | `Stop`, `Vehicle`, `VRPProblem` dataclasses + random-key decode + greedy encode. Vehicle has `is_ev`, `soc`, `energy_per_km`, `max_range_km` but no `max_distance_km`, `max_duration_min`, `cost_per_km`, `fixed_cost`, `type`, `service_time_min`, `priority`. Demand defaults to 1.0. | Needs extension |
| `src/optimizer/fitness.py` | 5-weight fitness (dist, time, congestion, emissions, violations). Congestion uses edge_weights param rarely supplied. | Needs redesign |
| `src/optimizer/qpso.py` | QPSO with beta-annealing, greedy seeding, early stop. 226 lines. No diversity-preserving mutation. mbest computed but never used in position update. | Core is sound but needs fixes |
| `src/baselines/ga.py` | GA with tournament selection, crossover, mutation. 80 lines. | Working |
| `src/baselines/aco.py` | MMAS ant colony. 130 lines. | Working |
| `src/baselines/pso_classic.py` | Standard velocity-position PSO. 69 lines. | Working |
| `src/baselines/ilp.py` | PuLP MTZ formulation capped at 25 stops. | Working |
| `src/baselines/__init__.py` | Missing: nearest-neighbour (NN) and Clarke-Wright savings baselines. | To build |
| `src/sustainability/emissions.py` | CO2 model + EV SoC tracker. | Working but emissions formula needs documented labelling |
| `frontend/` | Vanilla HTML/CSS/JS, dark-neon theme, 3 files. Leaflet map. Tabs: Home, Compare, Dashboard, Optimizer, Benchmark, Fleet. | Many mocked values. Will be replaced. |
| `tests/test_backend.py` | 9 pytest tests on synthetic graphs. All use Bengaluru coords. | Needs Mumbai coords |
| `scripts/demo_scenario.py` | CLI demo runner. Uses Bengaluru depot. | Needs Mumbai conversion |
| `data/osm/`, `data/benchmarks/` | Empty directories | Will hold cached graphs and benchmark CSV |

### 1B. Teammate's project (`SIH PS-2/SIH-2/`)

| Path | What it is | Status |
|---|---|---|
| `package.json` | Vite + React SPA. Deps: `maplibre-gl`, `lucide-react`, `react`, `vite`. Name: `routa-fleet-operations`. | No TypeScript, no Tailwind |
| `src/bkcApp.jsx` | 865-line single-file React app. Pages: Overview, Plan, Orders, Fleet, Live, Simulation, Analytics. Polished dispatcher-operations UI with sidebar nav, metric cards, order table, vehicle detail panel, constraints modal, simulation page. MapLibre map with OSM tiles. | Excellent design language but 100% mock data |
| `src/data/mock.js` | 25 BKC-area delivery orders with real Mumbai areas/coordinates, 4 vehicles with drivers, baseline vs optimized comparison (96 to 84 km), scenario profiles. | All hardcoded; no backend calls |
| `src/services/optimization.js` | Fake: 4 setTimeout stages returning mock data. | Delete |
| `src/styles.css` | 850 lines of clean, warm-toned CSS. Light theme, paper-white, dense panels, hairline borders. | Excellent - matches the dispatcher ops console aesthetic |

### 1C. qidre-source (second frontend, React+TanStack Start)

| Path | What it is | Status |
|---|---|---|
| `package.json` | TanStack Start + React 19 + Tailwind 4 + shadcn/ui + Recharts. 90 dependencies. | Heavy, SSR issues |
| `src/components/qidre-dashboard.tsx` | 603-line dashboard. Views: Home, Compare, Fleet. Dark neon theme. Connects to real backend at localhost:8000. Uses Math.random() for stop coords. Has convergence chart (Recharts), stat cards, route toggles. | Partially connected but uses fake stop coordinates, fake convergence data, hardcoded fallbacks |
| `src/components/real-map.tsx` | Minimal Leaflet/Esri map component. | Functional |
| `src/components/ui/` | Full shadcn/ui component library | Reusable |
| `src/styles.css` | Tailwind v4 theme with dark neon colours. | To be replaced per design direction |

---

## 2. Requirements Summary (from all source materials, 15 lines)

1. Product: QIDRE for SIH 2026. Tagline: "Optimize Every Delivery. Move More with Less."
2. Two modules: Part A (Route Comparison) and Part B (Fleet Optimizer with QPSO + baselines).
3. Real OSM road network: Mumbai areas (BKC, Churchgate, Lower Parel, Andheri, Powai). Cached as GraphML.
4. Distance/time matrix from road network (Dijkstra), not Euclidean.
5. QPSO: random-key encoding, beta-annealing (1.0 to 0.5), mean-best attractor, greedy seeding, diversity mutation.
6. Baselines: NN (THE baseline), Clarke-Wright, GA, ACO, PSO, ILP (12 stops max for ground truth).
7. Constraints: Capacity, max distance, max duration, priority (soft). Time windows only if fully enforced.
8. Dynamic edge costs G(t). ML travel-time prediction (RF, XGBoost, MLP). Synthetic traffic with honest labelling.
9. Pipeline (TAPS23.png): User Input -> Map & Data Layer -> VRP Formulation -> QPSO Engine -> Route Evaluation (iterate) -> Optimized Delivery Plan.
10. Two-path architecture: Shared data layer -> Prediction & Cost Model -> Path A (single trip) + Path B (fleet VRP+QPSO) -> Comparison -> Frontend.
11. QML experiment (Tier 3): QSVR/QNN for travel-time prediction; QAOA for tiny TSP/VRP. Labelled experimental.
12. Honest claims only. Report results as measured, including where QPSO loses.
13. Exports: CSV, JSON, printable report. Demo scenario with real BKC coordinates.
14. Frontend: Map-first operations console. Light theme, Mumbai taxi-yellow + near-black palette, colorblind-safe vehicle colours.
15. Views: Home | Route Planner | Fleet Optimizer | Prediction | Research | Benchmarks.

---

## 3. Problems Found (Mocked/Fake/Broken)

### Original backend (`src/`)
- CH oracle path reconstruction returns CH-augmented path, not actual road-network path
- Distance matrix approximation: `D[i][j] = dist * (30 * 1000 / 3600)` wrong
- No GraphML caching (re-downloads every time)
- Synthetic fallback reachable from API
- Missing baselines: no NN, no Clarke-Wright
- No geocoding proxy
- No SSE streaming; `/route` is synchronous
- No Part A endpoint (`/route/compare`)
- Vehicle model too simple (no max_distance, cost_per_km, type, etc.)
- No independent feasibility checker
- Fitness objective uses 5 weights but spec wants `w1*distance + w2*time + w3*vehicle_cost + penalties`

### Original frontend (`frontend/`)
- `dist * 2.2` for time display
- `Math.random()` for stops
- Hardcoded Bengaluru depot (12.9716, 77.5946)
- Dark neon theme violates design direction
- No geocoding autocomplete

### qidre-source frontend
- `Math.random()` stop coordinates
- Fake convergence data array
- `"Systems nominal"` badge
- Dark neon theme with glassmorphism
- SSR disabled globally
- Single vehicle, uniform demand 1.0

### Teammate's frontend (`SIH PS-2/SIH-2/`)
- 100% mock data, no backend connection
- Hardcoded baseline/optimized numbers
- Fake optimization service (setTimeout stages)
- BUT: Excellent layout, operations-console design, real Mumbai BKC coordinates

---

## 4. Merge Decision

### Frontend: NEW Vite + React SPA

None of the three frontends is usable as-is. Build a new `frontend/` as a Vite + React + TypeScript SPA:
- Design language and CSS: Port from teammate's `styles.css`, adapted to Mumbai palette (taxi-yellow, near-black, sea-green, BEST-bus red)
- Component library: shadcn/ui components rebuilt with new theme
- Charts: Recharts
- Maps: Leaflet with CARTO Positron basemap, dynamic import for client-only rendering
- Icons: lucide-react
- Views: Home, Route Planner, Fleet Optimizer, Prediction, Research, Benchmarks

### Backend: Keep `src/` FastAPI, extend and fix

The original `src/` has all core modules. Fix issues and add: GraphML caching, proper Dijkstra matrix, NN/CW baselines, SSE streaming, Part A + Part B endpoints, geocoding proxy, feasibility checker, redesigned models.

---

## 5. Architecture

```
  FRONTEND (Vite+React SPA, port 5173)
  Home | Route Planner | Fleet Optimizer | Prediction | Research | Benchmarks
  Leaflet map (CARTO Positron) + Recharts
  VITE_API_URL -> http://localhost:8000
                  |
                  | HTTP + SSE
                  v
  BACKEND (FastAPI, port 8000)
  src/api/main.py ---- REST endpoints + CORS
  src/graph/loader.py ---- OSM loading + GraphML cache
  src/graph/spatial_index.py ---- KDTree snapping
  src/graph/routing.py ---- Dijkstra shortest paths (NEW)
  src/oracle/matrix.py ---- distance/time matrix (NEW)
  src/optimizer/encoding.py ---- VRP model
  src/optimizer/fitness.py ---- objective function
  src/optimizer/qpso.py ---- QPSO solver
  src/optimizer/feasibility.py ---- constraint checker (NEW)
  src/baselines/ ---- NN, CW, GA, ACO, PSO, ILP
  src/sustainability/emissions.py ---- CO2 model
  src/geocoding.py ---- Nominatim proxy (NEW)
  data/osm/*.graphml ---- cached road networks
  data/benchmarks/results.csv ---- benchmark results
  data/demo/ ---- seeded demo scenario JSON
```

---

## 6. API Contract

### Graph and Areas
- `GET /health` -> `{status, version, graph_loaded, areas_available}`
- `GET /areas` -> `[{id, name, center_lat, center_lon, bbox}]`
- `POST /graph/load {area}` -> `{area, nodes, edges, bbox, load_seconds}`

### Geocoding
- `GET /geocode/search?q=...&area=...` -> `[{display_name, lat, lon}]`
- `GET /geocode/reverse?lat=...&lon=...` -> `{display_name, lat, lon}`

### Part A - Route Comparison
- `POST /route/compare` -> `{baseline:{geometry, distance_km, time_min, turns, segments, computation_ms}, ours:{...}, difference_geometry, identical:bool}`

### Part B - Fleet Optimizer
- `POST /fleet/optimize` -> `{job_id}`
- `GET /fleet/optimize/{job_id}/stream` -> SSE: `{iteration, best_fitness, diversity, elapsed_s, stage}`
- `GET /fleet/optimize/{job_id}` -> full result with per-vehicle routes, totals, baseline comparison, pct_change

### Benchmarks
- `GET /benchmarks` -> benchmark results from CSV

---

## 7. Diagram-to-Module Mapping

### TAPS23.png (Pipeline Diagram)

| Diagram Box | Module/File | Status |
|---|---|---|
| User & Fleet Input | `src/api/main.py` request models | Exists, needs extension |
| Map & Data Layer: OSM | `src/graph/loader.py` | Exists, needs caching |
| Map & Data Layer: Road Network | `src/graph/loader.py` RoadGraph | Exists |
| Map & Data Layer: Traffic Data | `src/graph/loader.py` time-of-day profile | Exists (basic), needs synthetic generator |
| Map & Data Layer: Distance/Travel-Time Matrix | `src/oracle/ch.py` | Exists but matrix build in main.py is wrong. Replace with proper Dijkstra in `src/oracle/matrix.py` |
| VRP Formulation: VRP | `src/optimizer/encoding.py` VRPProblem | Exists |
| VRP Formulation: Objective Function | `src/optimizer/fitness.py` FitnessEvaluator | Exists, needs redesign |
| VRP Formulation: Capacity & Time Constraints | `src/optimizer/encoding.py` decode_particle | Partial, needs max_distance/duration/priority |
| QPSO Engine: Initialize Candidates | `src/optimizer/qpso.py` greedy+random init | Exists |
| QPSO Engine: Fitness Evaluation | `src/optimizer/fitness.py` evaluate() | Exists |
| QPSO Engine: Quantum Position Update | `src/optimizer/qpso.py` main loop | Exists, mbest attractor unused |
| QPSO Engine: Constraint Handling | Penalty in fitness.py | Exists (time-window only) |
| QPSO Engine: Iterate | `src/optimizer/qpso.py` main loop | Exists |
| QPSO Engine: Best Feasible Solution | `src/optimizer/qpso.py` gbest tracking | Exists |
| Route Evaluation: Feasibility Check | Does not exist | To build: `src/optimizer/feasibility.py` |
| Route Evaluation: Distance/ETA | `src/optimizer/fitness.py` route_distance/time | Exists |
| Route Evaluation: Vehicle Utilisation | Not computed explicitly | To build |
| Route Evaluation: Fitness Comparison | `src/api/main.py` /route/benchmark | Exists |
| Optimized Delivery Plan: All outputs | Response JSON + Frontend | Exists partially |

### Vehicle Routing Diagram (Two-Path Architecture)

| Diagram Box | Module/File | Status |
|---|---|---|
| User Input (all) | API request models | Exists, needs extension |
| Map & Data Layer: OSM | `src/graph/loader.py` | Exists |
| Data Processing: OSM Extraction, Graph Construction | `src/graph/loader.py` load_osm_graph | Exists |
| Data Processing: Map Matching | Snap to nearest node | Exists (spatial_index) |
| Data Processing: Feature Generation | osmnx edge speeds/times | Partial |
| Prediction & Cost Model: ML Model | Phase 5 | To build |
| Prediction & Cost Model: Dynamic Edge Cost | Phase 5 | To build |
| Path A (Single Trip): A*/Dijkstra Baseline | `src/graph/routing.py` (NEW) | To build (Phase 1) |
| Path B (Fleet): VRP + QPSO | `src/optimizer/` | Exists, needs fixes |
| Comparison & Evaluation | `/route/compare`, `/fleet/optimize` | To build (Phase 2) |
| Output/Frontend: All views | Frontend | To build (Phase 3) |

---

## 8. Cleanup Plan

### Delete
- `frontend/app.js`, `frontend/index.html`, `frontend/style.css` (replaced by new frontend)
- `SIH PS-2/SIH-2/dist/` (build artifacts)
- `SIH PS-2/SIH-2/src/services/optimization.js` (fake)
- `qidre-source/` (entire, replaced by new frontend)
- `cache/` (unused)
- `STATUS.md` (superseded)

### Keep as reference then move to docs/
- `SIH PS-2/` folder (reference during dev, then `docs/reference/`)
- All PDFs -> `docs/`

### Port
- Teammate's styles.css design patterns -> new frontend CSS
- Teammate's bkcApp.jsx component structure -> new React components
- Teammate's mock.js orders data -> `data/demo/bkc_24_deliveries.json`
- qidre-source shadcn/ui setup pattern -> rebuilt with new theme

---

## 9. Phase Execution Order

| Phase | Scope |
|---|---|
| Phase 1 | Backend foundation: OSM graph + caching, spatial snapping, Dijkstra routing with GeoJSON, distance/time matrix, geocoding proxy |
| Phase 2 | Optimization engine: VRP model extension, fitness redesign, QPSO fixes, NN + CW baselines, feasibility checker, SSE streaming, Part A + Part B endpoints, benchmark harness |
| Phase 3 | Frontend: New Vite+React SPA, all 6 views, wired to real API, Mumbai palette, map-first, no mocks |
| Phase 4 | Run, docs, demo readiness: start.bat, README, prefetch, demo scenario, cleanup |
| Phase 5 | Dynamic edge cost, classical ML prediction, Research Dashboard |
| Phase 6 | QML + QAOA experiments |
| Phase 7 | Optional Google Routes API benchmark |

---

**STOP - Waiting for your confirmation before proceeding to Phase 1.**
