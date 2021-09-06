#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

AFFECTED_PROJECTS=$("$DIR"/_nx-affected-targets.sh "$1" | tr '\n,' ' ')
echo "Affected projects for target $1 are '$AFFECTED_PROJECTS'"

# This is a helper script to run in parallel affected projects for a specific target
exec parallel --halt soon,fail=1 --lb -j "$MAX_JOBS" APP={} "$DIR"/"$1".sh ::: "$AFFECTED_PROJECTS"
