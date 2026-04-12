#!/bin/bash

# Vela Causal Reasoning Platform - Setup Script
# This script sets up the development environment

echo "Setting up Vela Platform..."

# Install Backend Dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Install Frontend Dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Check Ollama Installation
echo "Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    echo "Ollama is installed"
    echo "Pulling llama3 model..."
    ollama pull llama3
else
    echo "Ollama is not installed. Please install from https://ollama.ai/download"
fi

echo "Setup complete!"
echo "Run './scripts/start.sh' to start the platform"
