#!/bin/bash
set -euo pipefail

# Log function for standardized logging
log() {
  local level="$1"
  local message="$2"
  echo "$(date +"%Y-%m-%d %H:%M:%S") - ${level}: ${message}"
}

: "${CHECK_INTERVAL:=0.2}"
: "${CHECK_TIMEOUT:=30}"
: "${CHECK_ENDPOINT:=readiness}"
: "${PORT:=4200}"
: "${SLEEP_TIME:=5}"

# Ensure APP is provided
: "${APP:=${1:-}}"
if [[ -z "${APP}" ]]; then
  log "ERROR" "Usage: $0 <APP>"
  exit 1
fi

# Get the project directory using Nx
log "INFO" "Retrieving project directory for app '${APP}'..."
PROJECT_DIR=$(npx nx show project "${APP}" | jq -r '.root')
if [[ -z "${PROJECT_DIR}" ]]; then
  log "ERROR" "Failed to determine project directory for app: ${APP}"
  exit 1
fi
DIST_PATH="dist/${PROJECT_DIR}"

# Build the app
log "INFO" "Building app '${APP}'..."
yarn build "${APP}"

# Navigate to the build output directory
cd "${DIST_PATH}"

# Start the application
log "INFO" "Starting app in production mode..."
NODE_ENV=production node main &
APP_PID=$!
log "INFO" "App started with PID: ${APP_PID}"

# Wait for readiness check
log "INFO" "Waiting for app readiness at http://localhost:${PORT}/${CHECK_ENDPOINT}..."
SECONDS=0
while ! curl -sf "http://localhost:${PORT}/${CHECK_ENDPOINT}" | grep -q "ready"; do
  if ((SECONDS >= CHECK_TIMEOUT)); then
    log "ERROR" "Readiness check timed out after ${CHECK_TIMEOUT} seconds."
    kill -TERM "${APP_PID}" || true
    exit 1
  fi
  sleep "${CHECK_INTERVAL}"
done
log "INFO" "App is ready."

# Additional sleep time after readiness
log "INFO" "Sleeping for ${SLEEP_TIME} seconds to allow full initialization..."
sleep "${SLEEP_TIME}"

# Send SIGTERM to the app
log "INFO" "Sending SIGTERM to the app..."
kill -TERM "${APP_PID}"
log "INFO" "SIGTERM sent."

# Wait and confirm the app is terminated
if wait "${APP_PID}"; then
  log "INFO" "App terminated successfully."
else
  log "ERROR" "App did not terminate cleanly."
fi
