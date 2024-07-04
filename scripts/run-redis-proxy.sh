#!/bin/bash
set -euo pipefail
# This scripts sets up a local proxy for ElastSearch running in our Dev env
./scripts/run-proxies.sh redis "$@"
