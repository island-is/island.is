#!/bin/bash

set -euo pipefail

./scripts/run-es-proxy.sh "$@" &
./scripts/run-soffia-proxy.sh "$@" &
./scripts/run-xroad-proxy.sh "$@" &

wait
