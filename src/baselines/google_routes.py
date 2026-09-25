"""
src/baselines/google_routes.py
──────────────────────────────
Phase 7: Google Routes API benchmark (Optional).
Can be used to compare QIDRE's OSM-based QPSO performance against
commercial proprietary solvers.
"""

import os
import logging
import requests

logger = logging.getLogger(__name__)

def query_google_routes_api(origins, destinations, api_key=None):
    """
    Query the Google Routes API to get distance and duration matrix.
    Note: Requires GOOGLE_MAPS_API_KEY environment variable.
    """
    api_key = api_key or os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        logger.warning("GOOGLE_MAPS_API_KEY not found. Skipping Google Routes benchmark.")
        return None
        
    logger.info(f"Querying Google Routes API for {len(origins)}x{len(destinations)} matrix...")
    
    # Normally we would build a payload and POST to https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix
    # For now, this is a placeholder indicating readiness.
    return {"status": "NOT_IMPLEMENTED"}
