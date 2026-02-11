#!/bin/bash

echo "=========================================="
echo "   Starting YellowShield with Docker..."
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

echo "[+] Building and Starting Containers..."
docker-compose up --build -d

echo ""
echo "=========================================="
echo "   YellowShield is Live!"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:5000"
echo "=========================================="
echo "To stop the app, run: docker-compose down"
