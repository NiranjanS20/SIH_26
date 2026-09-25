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


async def search(
    query: str,
    bbox: Optional[Tuple[float, float, float, float]] = None,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """
    Forward geocode: text query → list of {display_name, lat, lon}.

    Parameters
    ----------
    query : str — search text like "Churchgate, Mumbai"
    bbox : Optional (south, west, north, east) — restrict results to area
    limit : int — max results

    Returns list of dicts sorted by relevance.
    """
    cache_key = f"search:{query}:{bbox}:{limit}"
    if cache_key in _cache:
        return _cache[cache_key]

    import httpx

    await _rate_limit()

    params = {
        "q": query,
        "format": "json",
        "limit": limit,
        "countrycodes": "in",  # restrict to India
        "addressdetails": 1,
    }
    if bbox:
        south, west, north, east = bbox
        params["viewbox"] = f"{west},{north},{east},{south}"
        params["bounded"] = 1

    headers = {"User-Agent": "QIDRE-SIH2026/1.0 (student-project)"}

    try:
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
        _cache[cache_key] = results
        logger.info("Geocode search '%s' → %d results", query, len(results))
        return results

    except Exception as e:
        logger.warning("Geocode search failed for '%s': %s", query, e)
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
    headers = {"User-Agent": "QIDRE-SIH2026/1.0 (student-project)"}

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
