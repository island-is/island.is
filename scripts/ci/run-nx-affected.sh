#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

shift # remove target from args

# shellcheck disable=1091
source "$DIR"/_common.sh

MAX_JOBS=${MAX_JOBS:-2}

pids=()

for target in "$@"
do
  npx nx affected --base="$BASE" --head="$HEAD" --target="$target" --parallel="$MAX_JOBS" &
  pids+=($!)
done

# shellcheck disable=SC2048
for pid in ${pids[*]}; do
  if ! wait "$pid"; then
    exit 1
  fi
done

exit 0
