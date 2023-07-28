#!/bin/bash
set -euo pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
. "${DIR}/_docker.sh" "$@" || true

mkargs local-cache=false
CONTAINER_BUILDER=podman container_build
