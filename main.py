import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from api import app
from fastapi import Request
from fastapi.responses import JSONResponse

# Strip /api prefix so Vercel routing matches FastAPI routes
app.root_path = ""

# Middleware to rewrite /api/xyz → /xyz
@app.middleware("http")
async def strip_api_prefix(request: Request, call_next):
    if request.url.path.startswith("/api/"):
        scope = request.scope
        scope["path"] = scope["path"][len("/api"):]
        scope["raw_path"] = scope["raw_path"][len(b"/api"):]
    return await call_next(request)
