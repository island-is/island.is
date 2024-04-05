#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

# Building Docker images for ExpressJS-based apps
if ! command -v docker &>/dev/null && command -v podman &>/dev/null; then
  # Use podan only if docker is missing and is present
  exec "$DIR"/_podman.sh Dockerfile output-express
fi
# Optimistically assume docker is installed
exec "$DIR"/_docker.sh Dockerfile output-express
