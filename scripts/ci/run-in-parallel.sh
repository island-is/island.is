#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr '\n,' ' ')
echo "Running '$AFFECTED_PROJECTS' in parallel of ${MAX_JOBS} for target $1"

IFS=" " read -ra AFFECTED_PROJECTS <<< "$AFFECTED_PROJECTS"

# This is a helper script to run in parallel a list of provided projects for a specific target
exec parallel --halt soon,fail=1 --lb -j "$MAX_JOBS" APP={} "$DIR"/"$1".sh ::: "${AFFECTED_PROJECTS[@]}"
