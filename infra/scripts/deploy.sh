#!/bin/bash
set -e

echo "--- Starting MyKasbai Deployment ---"

# --- Navigate to App Directory ---
# Assuming the script is run from the repo root, e.g., /opt/mykasbai
APP_DIR=$(pwd)
echo "Deploying from directory: $APP_DIR"

# --- Pull Latest Changes ---
echo "Pulling latest changes from git..."
git pull

# --- Environment Check ---
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found. Please create it from the examples."
    exit 1
fi

# --- Build and Start Services ---
echo "Building and starting Docker containers..."
docker compose up -d --build --force-recreate

# --- Run Database Migrations ---
echo "Waiting for database to be ready..."
sleep 10 # Simple wait, a more robust solution would check DB health
echo "Running database migrations..."
docker compose exec api pnpm prisma migrate deploy

# --- Health Check ---
echo "Performing health checks..."
sleep 5 # Give services a moment to initialize

echo "Checking Web (should return 301 or 200/404 on https):"
curl -I http://127.0.0.1:3000/

echo "Checking API HealthZ:"
curl -sS http://127.0.0.1:3001/app/api/healthz | cat # Using cat to avoid exit on error

echo "--- Deployment Complete ---"
echo "Application should be available at https://mykasbai.ir/app"
echo "Don't forget to reload Nginx if you changed its config: sudo systemctl reload nginx"
