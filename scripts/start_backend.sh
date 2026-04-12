#!/usr/bin/env bash
# Start the Vela backend (FastAPI + Uvicorn)
# Requires: pip install -r requirements.txt
# Requires: Ollama running with llama3 pulled (ollama pull llama3)

set -e
cd "$(dirname "$0")/backend"

echo "Starting Vela backend on http://localhost:8000"
uvicorn api:app --reload --host 0.0.0.0 --port 8000
