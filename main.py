import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from api import app
from fastapi import Request
from fastapi.routing import APIRoute

# Strip /api prefix so routes match FastAPI's /train, /query etc.
app.root_path = "/api"
