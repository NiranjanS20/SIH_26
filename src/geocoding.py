"""
src/geocoding.py
────────────────
Nominatim geocoding proxy for resolving location names to lat/lon.

Rate-limited to 1 request/second per Nominatim usage policy.
Results are cached in-memory to avoid repeat lookups.
"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# In-memory cache: query_string → results
_cache: Dict[str, List[Dict[str, Any]]] = {}
_last_request_time: float = 0.0
_MIN_INTERVAL: float = 1.1  # seconds between Nominatim requests


async def _rate_limit() -> None:
    """Enforce Nominatim 1 req/sec policy."""
    global _last_request_time
    now = time.monotonic()
    elapsed = now - _last_request_time
    if elapsed < _MIN_INTERVAL:
        await asyncio.sleep(_MIN_INTERVAL - elapsed)
    _last_request_time = time.monotonic()


# Common Mumbai neighborhoods and landmarks for resilient offline/fallback resolution
_MUMBAI_FALLBACK_COORDS: Dict[str, Tuple[float, float]] = {
    "bkc": (19.0654, 72.8656),
    "bandra kurla complex": (19.0654, 72.8656),
    "bandra": (19.0596, 72.8295),
    "bandra east": (19.0620, 72.8470),
    "bandra west": (19.0596, 72.8295),
    "santacruz": (19.0805, 72.8415),
    "santacruz east": (19.0825, 72.8490),
    "santacruz west": (19.0830, 72.8360),
    "andheri": (19.1136, 72.8697),
    "andheri east": (19.1170, 72.8680),
    "andheri west": (19.1190, 72.8280),
    "borivali": (19.2288, 72.8569),
    "borivali east": (19.2215, 72.8624),
    "borivali west": (19.2300, 72.8450),
    "malad": (19.1874, 72.8484),
    "malad east": (19.1860, 72.8580),
    "malad west": (19.1870, 72.8350),
    "goregaon": (19.1663, 72.8526),
    "kandivali": (19.2062, 72.8436),
    "lower parel": (18.9953, 72.8300),
    "churchgate": (18.9322, 72.8264),
    "powai": (19.1176, 72.9060),
    "dadar": (19.0178, 72.8478),
    "kurla": (19.0699, 72.8780),
    "ghatkopar": (19.0860, 72.9090),
    "chembur": (19.0522, 72.8994),
    "vikhroli": (19.1111, 72.9277),
    "mulund": (19.1726, 72.9565),
    "thane": (19.2183, 72.9781),
    "vashi": (19.0771, 72.9986),
    "colaba": (18.9067, 72.8147),
    "marine lines": (18.9438, 72.8234),
    "worli": (19.0135, 72.8153),
}


async def search(
    query: str,
    bbox: Optional[Tuple[float, float, float, float]] = None,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """
    Forward geocode: text query → list of {display_name, lat, lon}.

    Parameters
    ----------
    query : str — search text like "Churchgate, Mumbai" or "Borivali East"
    bbox : Optional (south, west, north, east) — prefer results in area without hard boundary
    limit : int — max results

    Returns list of dicts sorted by relevance.
    """
    cache_key = f"search:{query}:{bbox}:{limit}"
    if cache_key in _cache:
        return _cache[cache_key]

    import httpx

    await _rate_limit()

    clean_query = query.strip()
    if "mumbai" not in clean_query.lower():
        clean_query = f"{clean_query}, Mumbai"

    params = {
        "q": clean_query,
        "format": "json",
        "limit": limit,
        "countrycodes": "in",  # restrict to India
        "addressdetails": 1,
    }
    # Soft bias via viewbox WITHOUT bounded=1 so results anywhere in Mumbai are found
    if bbox:
        south, west, north, east = bbox
        params["viewbox"] = f"{west},{north},{east},{south}"

    headers = {"User-Agent": "QIDRE-PROD/1.0 (student-project)"}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params=params,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()

        # If soft viewbox yielded nothing, retry unconstrained
        if not data and bbox:
            params.pop("viewbox", None)
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    "https://nominatim.openstreetmap.org/search",
                    params=params,
                    headers=headers,
                )
                resp.raise_for_status()
                data = resp.json()

        results = [
            {
                "display_name": item.get("display_name", ""),
                "lat": float(item["lat"]),
                "lon": float(item["lon"]),
                "type": item.get("type", ""),
                "importance": item.get("importance", 0),
            }
            for item in data
        ]

        if not results:
            # Fallback to local landmark database
            q_norm = query.lower().replace(", mumbai", "").strip()
            for key, (f_lat, f_lon) in _MUMBAI_FALLBACK_COORDS.items():
                if key in q_norm or q_norm in key:
                    results = [{
                        "display_name": f"{key.title()}, Mumbai, Maharashtra, India",
                        "lat": f_lat,
                        "lon": f_lon,
                        "type": "city_district",
                        "importance": 0.8,
                    }]
                    logger.info("Local fallback matched '%s' -> (%.4f, %.4f)", query, f_lat, f_lon)
                    break

        _cache[cache_key] = results
        logger.info("Geocode search '%s' → %d results", query, len(results))
        return results

    except Exception as e:
        logger.warning("Geocode search failed for '%s': %s (checking local fallback)", query, e)
        q_norm = query.lower().replace(", mumbai", "").strip()
        for key, (f_lat, f_lon) in _MUMBAI_FALLBACK_COORDS.items():
            if key in q_norm or q_norm in key:
                results = [{
                    "display_name": f"{key.title()}, Mumbai, Maharashtra, India",
                    "lat": f_lat,
                    "lon": f_lon,
                    "type": "city_district",
                    "importance": 0.8,
                }]
                return results
        return []


async def reverse(lat: float, lon: float) -> Optional[Dict[str, Any]]:
    """
    Reverse geocode: lat/lon → display name.
    """
    cache_key = f"reverse:{lat:.6f}:{lon:.6f}"
    if cache_key in _cache:
        return _cache[cache_key][0] if _cache[cache_key] else None

    import httpx

    await _rate_limit()

    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "zoom": 16,
    }
    headers = {"User-Agent": "QIDRE-PROD/1.0 (student-project)"}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params=params,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()

        result = {
            "display_name": data.get("display_name", ""),
            "lat": float(data.get("lat", lat)),
            "lon": float(data.get("lon", lon)),
        }
        _cache[cache_key] = [result]
        return result

    except Exception as e:
        logger.warning("Reverse geocode failed for (%.6f, %.6f): %s", lat, lon, e)
        return None
