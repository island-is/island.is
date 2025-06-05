#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh

# Building Docker images for Cypress-based apps, pass extra args to use in docker cmds if needed
exec "$DIR"/_docker.sh Dockerfile output-playwright
