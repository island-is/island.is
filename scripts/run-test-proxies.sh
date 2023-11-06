#!/bin/bash

set -euo pipefail

RESTART_INTERVAL_TIME=3
for proxy in es soffia xroad redis; do
  echo "Starting $proxy proxy"
  (
    while true; do
      code=0
      ./scripts/run-$proxy-proxy.sh "$@" || code=$?
      echo "Exit code for $proxy proxy: $code"
      if [ $code -eq 1 ]; then exit 1; fi
      echo "Restarting $proxy proxy in $RESTART_INTERVAL_TIME seconds..."
      sleep $RESTART_INTERVAL_TIME
    done
  ) &
done

wait
