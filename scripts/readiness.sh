#!/bin/bash
: "${READINESS_URL:=${1:-http://localhost:4200/readiness}}"
while true; do
  if curl -sf "${READINESS_URL}" | grep -q "ready"; then
    echo "Ready"
  else
    echo "Not ready"
  fi
  sleep 1
done
