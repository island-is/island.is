#!/bin/bash
set -euo pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
. "$DIR"/_common.sh

# Building Docker images for Cypress-based apps, pass extra args to use in docker cmds if needed
exec "$DIR"/_podman.sh Dockerfile output-playwright
