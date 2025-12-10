#!/bin/bash
set -euox pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh

AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr '\n,' ' ')
echo "Running '$AFFECTED_PROJECTS' with concurrency of ${MAX_JOBS} and  for target $1"

IFS=" " read -ra AFFECTED_PROJECTS <<<"$AFFECTED_PROJECTS"

# This is a helper script to run in parallel a list of provided projects for a specific target
exec parallel --halt never --lb -j "$MAX_JOBS" APP={} "$DIR"/"$1".sh ::: "${AFFECTED_PROJECTS[@]}"
