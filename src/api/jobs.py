"""
src/api/jobs.py
───────────────
Job store and SSE streaming logic.
"""

from typing import Dict, Any, AsyncGenerator
import asyncio
import uuid
import json

# In-memory job store
JOBS: Dict[str, Dict[str, Any]] = {}

def create_job() -> str:
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "status": "queued",
        "progress": [],
        "result": None,
        "error": None
    }
    return job_id

def update_job_progress(job_id: str, iteration: int, fitness: float, diversity: float):
    if job_id in JOBS:
        JOBS[job_id]["progress"].append({
            "iteration": iteration,
            "fitness": fitness,
            "diversity": diversity
        })

def complete_job(job_id: str, result: dict):
    if job_id in JOBS:
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["result"] = result

def fail_job(job_id: str, error: str):
    if job_id in JOBS:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = error

async def stream_job(job_id: str) -> AsyncGenerator[str, None]:
    if job_id not in JOBS:
        yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
        return
        
    job = JOBS[job_id]
    last_idx = 0
    
    while True:
        # Yield new progress
        while last_idx < len(job["progress"]):
            data = job["progress"][last_idx]
            yield f"data: {json.dumps(data)}\n\n"
            last_idx += 1
            
        if job["status"] == "completed":
            yield f"data: {json.dumps({'status': 'completed', 'result': job['result']})}\n\n"
            break
        elif job["status"] == "failed":
            yield f"data: {json.dumps({'status': 'failed', 'error': job['error']})}\n\n"
            break
            
        await asyncio.sleep(0.5)
