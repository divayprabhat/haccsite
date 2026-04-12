import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from api import app
from fastapi import Request

@app.middleware("http")
async def strip_api_prefix(request: Request, call_next):
    if request.scope["path"].startswith("/api/"):
        request.scope["path"] = request.scope["path"][len("/api"):]
        request.scope["raw_path"] = request.scope["raw_path"][len(b"/api"):]
    return await call_next(request)
