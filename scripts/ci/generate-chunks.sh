#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

PROJECTS=$("$PROJECT_ROOT"/scripts/ci/_nx-affected-targets.sh "$1")
>&2 echo "Projects: ${PROJECTS}"
CHUNKS=$(node "$PROJECT_ROOT"/scripts/ci/_chunk.js "${PROJECTS}")
>&2 echo "Chunks: $CHUNKS"
echo "$CHUNKS"
