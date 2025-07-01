#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh

# Build Docker images for Next.js-based apps
exec "$DIR"/_docker.sh Dockerfile output-next
