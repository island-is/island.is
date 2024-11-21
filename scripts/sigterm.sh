#!/bin/bash
set -euo pipefail

: "${CHECK_INTERVAL:=0.2}"
: "${CHECK_ENDPOINT:=/readiness}"
: "${PORT:=4200}"
# Default sleep time
: "${SLEEP_TIME:=5}"
# Ensure APP is provided
: "${APP:=${1:-}}"
if [[ -z "${APP}" ]]; then
  echo "Usage: $0 <APP>"
  exit 1
fi

# Get the project directory using Nx
PROJECT_DIR=$(npx nx show project "${APP}" | jq -r '.root')
if [[ -z "${PROJECT_DIR}" ]]; then
  echo "Failed to determine project directory for app: ${APP}"
  exit 1
fi
DIST_PATH="dist/${PROJECT_DIR}"

# Build the app
yarn build "${APP}"

# Navigate to the build output directory
cd "${DIST_PATH}"

# Start the application
NODE_ENV=production node main &
APP_PID=$!
echo "App started with PID: ${APP_PID}"

# Wait for readiness check
echo "Waiting for app to become ready on /${CHECK_ENDPOINT}..."
while curl -s "http://localhost:${PORT}/${CHECK_ENDPOINT}" | grep --invert-match "ready"; do
  sleep "${CHECK_INTERVAL}"
done
echo "App is ready."

# Additional sleep time after readiness
echo "Sleeping for ${SLEEP_TIME} seconds to allow full initialization..."
sleep "${SLEEP_TIME}"

# Check the port the app is using
PORT=$(lsof -Pan -p "${APP_PID}" -i 4tcp | awk 'NR==2 {print $9}' | cut -d':' -f2)
if [[ -z "${PORT}" ]]; then
  echo "Failed to detect the port. Ensure the application is running."
  kill -TERM "${APP_PID}"
  exit 1
fi
echo "App is running on port: ${PORT}"

# Send SIGTERM to the app
kill -TERM "${APP_PID}"
echo "SIGTERM sent to the app."

# Wait and confirm the app is terminated
wait "${APP_PID}" || echo "App terminated successfully."
