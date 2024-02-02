#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

AFFECTED_PROJECTS=$(./scripts/ci/generate-chunks.sh test)

# Parse the JSON array to get a space-separated list of project names
AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | jq -r '.[]' | tr ',' '\n')

echo "Running '$AFFECTED_PROJECTS' in parallel of ${MAX_JOBS} for target $1"

# Now AFFECTED_PROJECTS should be a clean, space-separated list of project names
echo "$AFFECTED_PROJECTS" | parallel --halt soon,fail=1 --lb -j "$MAX_JOBS" APP={} "$DIR"/"$1".sh
