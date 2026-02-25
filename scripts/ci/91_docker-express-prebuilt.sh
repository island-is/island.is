#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh

# Building Docker images for ExpressJS-based apps (PREBUILT)
exec "$DIR"/_docker-prebuilt.sh Dockerfile.prebuilt output-express
