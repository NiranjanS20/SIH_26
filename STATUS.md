# STATUS

## 1. File Tree (Depth 3)
```text
|-- CACHEDIR.TAG
|-- README.md
|-- run.py
|-- requirements.txt
|-- SIH_26137_Technical_Persp.pdf
|-- SIH_Quantum_VRP_Technical_Report.pdf
|-- product analysis.pdf
|-- qidre-source.md
|-- data
|   |-- benchmarks
|   |-- osm
|-- frontend
|   |-- app.js
|   |-- index.html
|   |-- style.css
|-- qidre-source
|   |-- app.config.ts
|   |-- components.json
|   |-- package-lock.json
|   |-- package.json
|   |-- tsconfig.json
|   |-- vite.config.ts
|   |-- src
|       |-- components
|       |-- hooks
|       |-- lib
|       |-- routes
|       |-- server.ts
|       |-- start.ts
|       |-- styles.css
|       |-- routeTree.gen.ts
|       |-- router.tsx
|-- scripts
|   |-- demo_scenario.py
|-- src
|   |-- __init__.py
|   |-- api
|       |-- __init__.py
|       |-- main.py
|   |-- baselines
|       |-- __init__.py
|       |-- aco.py
|       |-- ga.py
|       |-- ilp.py
|       |-- pso_classic.py
|   |-- graph
|       |-- __init__.py
|       |-- loader.py
|       |-- spatial_index.py
|   |-- optimizer
|       |-- __init__.py
|       |-- encoding.py
|       |-- fitness.py
|       |-- qpso.py
|   |-- oracle
|       |-- __init__.py
|       |-- ch.py
|   |-- sustainability
|       |-- __init__.py
|       |-- emissions.py
|-- tests
    |-- __init__.py
    |-- test_backend.py
```

## 2. Tech Stack Actually in Use
**Backend (from `requirements.txt`)**
- `fastapi==0.115.0` & `uvicorn[standard]==0.30.6` (API Framework)
- `numpy==2.1.1`, `scipy==1.14.1` (Scientific computation for QPSO)
- `networkx==3.3`, `osmnx==1.9.4` (Graph and OSM routing)
- `pulp==2.9.0` (ILP Solver baseline)
- `pydantic==2.9.2` (Data validation)

**Frontend (from `package.json`)**
- `react==19.2.0`, `react-dom==19.2.0` (UI Library)
- `@tanstack/react-router==1.170.18`, `@tanstack/react-start==1.168.32` (Framework)
- `vite==8.1.5` (Bundler)
- `tailwindcss==4.2.1` (Styling)
- `lucide-react==0.575.0` (Icons)
- `recharts==2.15.4` (Analytics Charts)
- `Leaflet` (via CDN for Map Visualization)

## 3. Feature Status
- **OSM road network loading:** DONE (Implemented via OSMnx in `graph/loader.py`).
- **Distance+time matrix:** DONE (Computed efficiently using Contraction Hierarchies oracle in `oracle/ch.py`).
- **Route comparison (baseline vs ours):** DONE (`CompareView` accurately runs both `GA` and `QPSO` in parallel and diffs the results).
- **VRP formulation:** DONE (`VRPProblem`, constraints, and node data modeled rigorously in `optimizer/encoding.py`).
- **QPSO optimizer:** DONE (Core quantum mechanics logic and evolution implemented in `optimizer/qpso.py`).
- **Constraint checking (capacity, max distance):** PARTIAL (Capacity limits are enforced during array decoding logic, but hard limits on max distance/vehicle range are unhandled/implicit).
- **Baseline solver:** DONE (`GASolver`, `ACOSolver`, and `ClassicPSOSolver` correctly integrated as baselines).
- **Fleet map visualization:** DONE (`RealMap` using real Esri Dark map tiles and rendering multi-vehicle paths over Mumbai layout).
- **Results panel:** DONE (`CompareView` calculates exact % saved; `FleetView` StatCards populate with distance and CO2 calculations).
- **Export:** MISSING (No UI button or backend logic to export routes to CSV/JSON).

## 4. Real Measured Numbers
From live test data across the REST API:
- **Distance/Time:** On a basic 3-node graph configuration, both GA and QPSO return exactly **23.9 km**.
- **Computation Time:** Due to current small node limits (3-20 points), backend `elapsed_s` is essentially instantaneous (**~0.0s**) across solvers.
- **Baseline vs QPSO:** Currently measuring **0.0% SAVED** for trivial instances (both algorithms perfectly converge on the optimal route instantly). Will require 25+ node bounds to see measurable QPSO dominance.

## 5. Hardcoded/Mocked Items that Should be Real
1. **Frontend Depot Coordinates:** The API request hardcodes `depot_lat: 12.9716, depot_lon: 77.5946` rather than reading user inputs.
2. **Frontend Stop Geocoding:** The stops are randomly scattered `(Math.random() - 0.5) * 0.1` around the hardcoded depot, instead of passing actual geocoded lat/long arrays based on map clicks/user searches.
3. **Frontend Travel Time Display:** The `CompareView` explicitly mocks the Travel Time metric as `Math.round(distBase * 2.2)`, rather than consuming exact time matrices from the backend.
4. **Graph Nodes Default Limit:** Hardcoded to `num_nodes: 200` in the graph load trigger payload, limiting scale.

## 6. Known Bugs and How to Run
**Known Bugs:**
- Leaflet map re-renders/initialization conflicts occasionally occur with SSR (hydration mismatch), mitigated by turning SSR off globally in `app.config.ts`.
- Selecting multiple specific points triggers identical results from baseline/optimizer on small fleets, occasionally yielding a 0% saved visual anomaly which users misinterpret as "not working".

**How to run:**
1. **Backend:** Run `python run.py`. Starts Uvicorn on `http://localhost:8000`.
2. **Frontend:** `cd qidre-source` and run `npm run dev`. Starts Vite dev server on `http://localhost:8080`.

## 7. Top 5 Highest-Impact Fixes (Priority Order)
1. **Real Geocoding Integration:** Hook up user text fields (e.g. "Indiranagar") to an OSM Nominatim API to replace Math.random() coordinates with real user destinations.
2. **Backend Travel Time Transport:** Add `travel_time` computations explicitly into the backend `/route` payload so the frontend can display exact ETA instead of `dist * 2.2`.
3. **Hard Constraint Penalties:** Implement `max_distance` constraint in `FitnessEvaluator.evaluate()` to fully satisfy PDF enterprise conditions.
4. **CSV/PDF Export:** Add an `exportData()` function to the `FleetView` to dump `routes` and `stats` state to a downloadable JSON or CSV file.
5. **Scale Up Default Nodes:** Increase frontend payload parameter from `num_nodes: 200` to `2000` to allow the QPSO solver to properly demonstrate supremacy over Baseline GA.
