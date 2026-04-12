#!/usr/bin/env bash
# Start the Vela frontend (Vite dev server)
# Requires: Node.js 18+
# Run: npm install  (first time only)

set -e
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Vela frontend on http://localhost:3000"
npm run dev
