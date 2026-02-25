#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh

# Building Docker images for ExpressJS-based apps with yarn (PREBUILT)
# Uses the same Dockerfile but targets output-express-yarn-prebuilt
exec "$DIR"/_docker.sh Dockerfile output-express-yarn-prebuilt
