#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh
AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr -d '\n[:space:]')
echo "Running '$AFFECTED_PROJECTS' in parallel of ${NX_PARALLEL} for target $1"

if [ -n "$AFFECTED_PROJECTS" ]; then
  echo "Affected projects for target $1 are '$AFFECTED_PROJECTS'"
  yarn nx run-many --target="$1" --projects="$AFFECTED_PROJECTS" --parallel="${NX_PARALLEL:-6}" --maxParallel="$NX_MAX_PARALLEL"
else
  echo "No affected projects for target $1"
fi
