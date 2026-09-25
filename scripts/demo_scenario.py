"""
scripts/demo_scenario.py
─────────────────────────
Full end-to-end QIDRE demo runner for SIH presentation.

Runs:
  1. Load a synthetic Bengaluru graph (200 nodes)
  2. Solve a 15-stop, 3-vehicle routing problem with QPSO
  3. Inject 5 congestion events and re-solve
  4. Run full benchmark (QPSO vs GA vs ACO vs PSO vs ILP)
  5. Print a formatted summary table

Usage:
    python scripts/demo_scenario.py [--host localhost] [--port 8000]
"""

import argparse
import json
import sys
import time

try:
    import httpx
except ImportError:
    print("httpx not installed. Run: pip install httpx")
    sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────────────────────

DEMO_STOPS = [
    {"id": 0,  "lat": 12.9352, "lon": 77.6245, "demand": 1.0},
    {"id": 1,  "lat": 12.9698, "lon": 77.7499, "demand": 1.0},
    {"id": 2,  "lat": 13.0012, "lon": 77.5800, "demand": 1.5},
    {"id": 3,  "lat": 12.9279, "lon": 77.6271, "demand": 1.0},
    {"id": 4,  "lat": 12.9719, "lon": 77.5937, "demand": 2.0},
    {"id": 5,  "lat": 12.9141, "lon": 77.6101, "demand": 1.0},
    {"id": 6,  "lat": 13.0297, "lon": 77.5477, "demand": 1.5},
    {"id": 7,  "lat": 12.9566, "lon": 77.7010, "demand": 1.0},
    {"id": 8,  "lat": 12.9783, "lon": 77.6408, "demand": 1.0},
    {"id": 9,  "lat": 13.0100, "lon": 77.5500, "demand": 1.0},
    {"id": 10, "lat": 12.9400, "lon": 77.5600, "demand": 2.0},
    {"id": 11, "lat": 12.9500, "lon": 77.6900, "demand": 1.0},
    {"id": 12, "lat": 12.9900, "lon": 77.6200, "demand": 1.5},
    {"id": 13, "lat": 12.9600, "lon": 77.5700, "demand": 1.0},
    {"id": 14, "lat": 13.0200, "lon": 77.6000, "demand": 1.0},
]

DEMO_VEHICLES = [
    {"id": 0, "capacity": 6.0, "is_ev": True,  "soc": 1.0},
    {"id": 1, "capacity": 6.0, "is_ev": False, "soc": 1.0},
    {"id": 2, "capacity": 6.0, "is_ev": False, "soc": 1.0},
]

DEPOT = {"lat": 12.9716, "lon": 77.5946}

CONGESTION_EDGES = [
    {"u": 0, "v": 1, "weight": 9999},
    {"u": 1, "v": 2, "weight": 8500},
    {"u": 5, "v": 6, "weight": 7800},
    {"u": 8, "v": 9, "weight": 9200},
    {"u": 3, "v": 4, "weight": 8100},
]


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def sep(char="─", w=72): print(char * w)

def section(title):
    sep("═")
    print(f"  {title}")
    sep("═")

def ok(msg):  print(f"  ✅  {msg}")
def err(msg): print(f"  ❌  {msg}")
def info(msg):print(f"  ℹ   {msg}")

def post(client, base, path, payload, label):
    t0 = time.perf_counter()
    r = client.post(base + path, json=payload, timeout=300)
    elapsed = (time.perf_counter() - t0) * 1000
    if r.status_code != 200:
        err(f"{label} failed ({r.status_code}): {r.text[:200]}")
        return None
    ok(f"{label} → {elapsed:.0f} ms")
    return r.json()


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main(host="localhost", port=8000):
    base = f"http://{host}:{port}"
    print()
    section("QIDRE — SIH 2026 Demo Scenario")
    print(f"  Target: {base}")
    print()

    with httpx.Client() as client:

        # ── 1. Health check ───────────────────────────────────────────
        section("Step 1 / 4 — Health Check")
        r = client.get(base + "/")
        if r.status_code != 200:
            err(f"Server unreachable at {base}. Start with: python run.py"); return
        d = r.json()
        ok(f"QIDRE API {d['version']} is {d['status']}")

        # ── 2. Load graph ─────────────────────────────────────────────
        section("Step 2 / 4 — Load Synthetic Bengaluru Graph")
        r = post(client, base, "/graph/load",
                 {"city": "bengaluru", "num_nodes": 200, "use_osm": False},
                 "Graph load")
        if r:
            info(f"Nodes: {r['num_nodes']}  |  Edges: {r['num_edges']}  |  CH shortcuts: {r['shortcuts_added']}")

        # ── 3. First solve (pre-congestion) ───────────────────────────
        section("Step 3 / 4 — QPSO Route Optimization (15 stops, 3 vehicles)")
        payload = {
            "depot_lat": DEPOT["lat"], "depot_lon": DEPOT["lon"],
            "stops": DEMO_STOPS, "vehicles": DEMO_VEHICLES,
            "algorithm": "qpso",
            "qpso_config": {"population_size": 40, "max_iterations": 100, "beta_start": 1.0},
        }
        r = post(client, base, "/route", payload, "QPSO solve (initial)")
        if r:
            print()
            print(f"    {'Vehicle':<10} {'Stops':>6} {'Distance':>12} {'Type':>8}")
            sep()
            total_km = 0
            for vr in r["routes"]:
                dist_km = vr["distance_km"]
                total_km += dist_km
                vtype = "⚡ EV" if vr["is_ev"] else "⛽ ICE"
                print(f"    Vehicle {vr['vehicle_id']+1:<4}   {vr['stop_count']:>5}   {dist_km:>10.2f} km   {vtype}")
            sep()
            em = r["emissions"]
            print(f"    Total distance : {em['total_distance_km']:.2f} km")
            print(f"    Total CO₂      : {em['total_co2_kg']:.3f} kg")
            print(f"    CO₂ saved      : {em['co2_saved_vs_all_ice']:.3f} kg  ({em['co2_reduction_pct']}%)")
            print(f"    Solver time    : {r['elapsed_s']*1000:.1f} ms")
            print(f"    Iterations     : {r['iterations']}")

        # ── 4. Inject congestion + re-solve ───────────────────────────
        print()
        info("Injecting 5 congestion events…")
        r2 = post(client, base, "/graph/traffic", {"edges": CONGESTION_EDGES}, "Traffic update")
        if r2:
            info(f"Updated {r2['updated']} edges")

        r3 = post(client, base, "/route", payload, "QPSO solve (post-congestion)")
        if r3 and r:
            delta_km = r3["emissions"]["total_distance_km"] - r["emissions"]["total_distance_km"]
            info(f"Route length change after congestion: {delta_km:+.2f} km (CH rerouting active)")

        # ── 5. Benchmark ──────────────────────────────────────────────
        section("Step 4 / 4 — Algorithm Benchmark (15 stops, 150 iterations)")
        bench_payload = {
            "depot_lat": DEPOT["lat"], "depot_lon": DEPOT["lon"],
            "stops": DEMO_STOPS[:12],   # 12 stops → ILP tractable
            "vehicles": DEMO_VEHICLES,
            "algorithms": ["ilp", "qpso", "ga", "aco", "pso"],
        }
        rb = post(client, base, "/route/benchmark", bench_payload, "Benchmark (5 algos)")
        if rb:
            print()
            print(f"    {'Algorithm':<20} {'Fitness':>10} {'Time':>10} {'Iters':>7} {'Gap':>8}")
            sep()
            algos = rb["algorithms"]
            order = ["ilp", "qpso", "ga", "aco", "pso"]
            labels = {"ilp":"ILP (MTZ)", "qpso":"⚛ QPSO", "ga":"Genetic Alg.",
                      "aco":"Ant Colony", "pso":"Classic PSO"}
            for key in order:
                a = algos.get(key)
                if not a: continue
                if "error" in a:
                    print(f"    {labels[key]:<20}  {'ERROR':>10}   {'—':>9}   {'—':>6}   {'—':>7}")
                else:
                    marker = " ◄ BEST" if a.get("gap_pct", 99) == 0 else ""
                    print(f"    {labels[key]:<20}  {a['fitness']:>10.5f}   {a['elapsed_s']:>7.3f}s"
                          f"   {a['iterations']:>6}   {a.get('gap_pct',0):>6.1f}%{marker}")
            sep()
            print(f"    Best fitness: {rb['best_fitness']:.5f}")

    print()
    section("Demo Complete 🎉")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QIDRE demo scenario runner")
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()
    main(args.host, args.port)
