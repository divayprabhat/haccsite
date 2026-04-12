#!/bin/bash

# Vela Causal Reasoning Platform - Startup Script
# This script starts both backend and frontend services

echo "Starting Vela Platform..."

# Check if Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    echo "Warning: Ollama is not running. LLM features will be disabled."
    echo "To start Ollama: ollama serve"
fi

# Start Backend
echo "Starting backend server..."
cd backend
python api.py &
BACKEND_PID=$!

# Start Frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend running on: http://localhost:8000"
echo "Frontend running on: http://localhost:3000"
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt signal
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
