#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr -d '\n[:space:]')
echo "Running '$AFFECTED_PROJECTS' in parallel of ${MAX_JOBS} for target $1"

if [ -n "$AFFECTED_PROJECTS" ]
then
  echo "Affected projects for target $1 are '$AFFECTED_PROJECTS'"
  yarn run nx run-many --target="$1" --projects="$AFFECTED_PROJECTS" --parallel --maxParallel="$MAX_JOBS"
else
  echo "No affected projects for target $1"
fi
