#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

target=$1
shift

# shellcheck disable=SC1091
source "$DIR"/_common.sh
MAX_JOBS=${MAX_JOBS:-2}
AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr -d '\n[:space:]')
echo "Running '$AFFECTED_PROJECTS' in parallel of ${MAX_JOBS} for target $target"

if [ -n "$AFFECTED_PROJECTS" ]
then
  echo "Affected projects for target $target are '$AFFECTED_PROJECTS'"
  yarn run nx run-many --target="$target" --projects="$AFFECTED_PROJECTS" --parallel --maxParallel="$MAX_JOBS" "$@"
else
  echo "No affected projects for target $target"
fi
