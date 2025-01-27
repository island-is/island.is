#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

AFFECTED_PROJECTS=$(echo "${AFFECTED_PROJECTS}" | tr '\n,' ' ')
echo "Running '$AFFECTED_PROJECTS' with concurrency of ${MAX_JOBS} and  for target $1"

IFS=" " read -ra AFFECTED_PROJECTS <<<"$AFFECTED_PROJECTS"

# Run parallel execution
parallel --keep-order --lb -j "$MAX_JOBS" APP={} "$DIR"/"$1".sh ::: "${AFFECTED_PROJECTS[@]}"
PARALLEL_EXIT_STATUS=$?

# Check the exit status of parallel
if [ $PARALLEL_EXIT_STATUS -eq 0 ]; then
  echo "All test suites passed or had no tests"
  exit 0
else
  echo "One or more test suites failed"
  exit 1
fi
