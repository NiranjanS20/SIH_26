<div align="center">
  <img src="assets/logo.png" alt="QIDRE Logo" width="240" />
</div>

# QIDRE Project Progress Report

**Date:** 28 September 2026  
**Repository:** `SIH_26`  
**Latest pushed commit:** `002c8ad` — `Add live traffic refresh and map overlay` (`main` → `origin/main`)

## Summary

QIDRE is running as a local frontend and FastAPI backend prototype. The current build loads a Mumbai OpenStreetMap road graph, compares shortest-distance and fastest-time routes, runs fleet optimization, and can request a small sample of current TomTom traffic speeds. The Fleet Optimizer can display returned traffic segments on its map.

This is meaningful demo progress, but the project is **not yet fully aligned with the problem statement**. In particular, time-window constraints are represented in the request models but are not enforced by the optimizer, and sampled TomTom speeds are currently assigned to OSM edges using edge midpoints. Benchmark screens also need to be checked against reproducible backend measurements.

## Work completed

- Repaired the frontend map rendering workflow. The current dashboard uses MapLibre with OpenStreetMap tiles and renders route geometry.
- Made the route comparison clearer: it identifies shortest-distance Dijkstra and fastest-time Dijkstra separately, reports their cost bases, and indicates whether the graph has TomTom live traffic weights.
- Added a backend TomTom Traffic Flow refresh endpoint. It keeps the API key server-side, limits each frontend refresh to 20 segment requests, filters low-confidence data, and updates travel-time weights in the loaded graph.
- Added a Fleet Optimizer refresh button and a traffic overlay. The overlay draws TomTom-returned segment geometry and colors it according to current speed relative to free-flow speed.
- Added `.env.example` to document environment variable names without including credentials. The Google Routes integration remains optional and is currently a placeholder.
- Pushed the reviewed code changes to `origin/main` in commit `002c8ad`.

## Verification performed

- Backend Python modules compiled successfully.
- The local API health endpoint returned `ok`, and the cached BKC road graph loaded with **9,626 nodes and 21,290 directed edges**.
- A live TomTom refresh updated **19 of 20** sampled edges in one check. After adding segment geometry to the response, a follow-up check updated **3 of 4** sampled edges with usable geometry. These are small integration checks, not coverage or accuracy benchmarks.
- Route comparison reported `traffic_aware: true` after a successful live refresh.
- The frontend production build completed successfully. Vite reports that the MapLibre JavaScript chunk is larger than 500 kB after minification.
- The working tree still contains untracked user reference files (`SIH PS-2/` and several PDFs); they were not included in the pushed commit.

## Alignment with the problem statement

The attached PS is **“Quantum-Inspired Intelligent Traffic Route Optimization in Transportation Systems Using Metaheuristic Optimization.”** It asks for a weighted road graph with dynamic traffic weights, a VRP model with capacity, time-window, and flow constraints, a quantum-inspired optimizer, an executable API/UI with map visualization, and systematic benchmarking.

- **Road graph and map output — substantially implemented.** OSM roads provide the graph and map geometry. TomTom live flow data can update a bounded sample of graph weights. Current traffic coverage is sparse, and edge matching is approximate.
- **VRP and capacity — implemented with caveats.** The model and decoder contain vehicle capacity, maximum distance, and duration handling. Fitness applies penalties and a feasibility checker can report violations; this should not be described as strict feasibility until solver outputs are validated against it.
- **Time windows — not yet implemented in optimization.** `earliest` and `latest` are carried by the stop model, but the current decoder, fitness penalties, and exact ILP baseline do not enforce arrival/service windows.
- **Flow constraints — partial.** The ILP baseline contains flow-conservation constraints. The metaheuristic solution path needs explicit route validation and documented constraint semantics.
- **Quantum-inspired solver — implemented in code.** QPSO is a classical quantum-inspired metaheuristic; the project should report measured comparisons rather than claim a performance advantage in advance.
- **Benchmarking — incomplete as evidence.** The backend has solver benchmarking code, but dashboard/research copy includes hard-coded-looking claims and solver labels that need to be traced to actual runs. Keep illustrative results clearly labeled until reproducible measurements are connected.
- **Google benchmark — not implemented.** `src/baselines/google_routes.py` currently returns `NOT_IMPLEMENTED`; a working Google key is not required for the core project.

## Recommended next steps

1. **Improve traffic-to-road matching.** Match TomTom segment geometry and direction against OSM edge geometry, and apply a speed only when the match is close and unambiguous. The current midpoint method can associate a nearby parallel road with the wrong edge. Also define a freshness/expiry policy for in-memory traffic weights.
2. **Implement time windows end to end.** Track arrival and service times in route evaluation; penalize or reject early/late arrivals; apply the same rules in the feasibility checker and exact baseline; return window violations to the UI.
3. **Validate every solver result.** Run the shared feasibility checker after QPSO, GA, ACO, PSO, and ILP. Report unserved stops, capacity/distance/duration/window violations, and whether the solution is feasible.
4. **Make benchmarks reproducible.** Connect benchmark screens to actual backend runs; record instance, seed, solver settings, runtime, objective values, feasibility, and convergence. Compare QPSO with classical baselines and use the exact solver only at tractable sizes.
5. **Improve traffic coverage and explain it in the UI.** Show the number of roads sampled, successful matches, confidence, source, and refresh time. Keep request caps visible so refreshes stay within the provider’s free allowance.
6. **Address release quality.** Split or lazy-load the large map bundle, verify TomTom attribution and product terms for the intended demo/public use, and add deployment guidance for secret management and allowed origins.

## Key references

- Problem statement supplied by the user: `C:\Users\DAKSH\Downloads\SIH26137 (1).pdf`
- Backend: `src/api/main.py`, `src/optimizer/encoding.py`, `src/optimizer/fitness.py`, `src/optimizer/feasibility.py`, `src/baselines/ilp.py`
- Frontend: `frontend/src/components/qidre-dashboard.tsx`, `frontend/src/lib/api.ts`
- [TomTom Flow Segment Data documentation](https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/traffic-flow/flow-segment-data)
- [TomTom Traffic API market coverage](https://docs.tomtom.com/traffic-api/documentation/tomtom-maps/v1/product-information/market-coverage)
