#!/bin/bash
set -euox pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ -z "$USE_NX_CLOUD" ]]; then
  echo "USE_NX_CLOUD env var is missing, skipping parallel jobs ..."
  exit 0
fi

shift # remove target from args

source "$DIR"/_common.sh

MAX_JOBS=${MAX_JOBS:-2}

pids=()

for target in "$@"
do
  yarn dlx nx affected --base="$BASE" --head="$HEAD" --target="$target" --parallel="$MAX_JOBS"
  pids+=($!)
done

for pid in ${pids[*]}; do
  if ! wait "$pid"; then
    exit 1
  fi
done

exit 0


# # run all commands in parallel and bail if one of them fails
# for pid in "${pids[@]}"; do
#   if ! wait "$pid"; then
#     exit 1
#   fi
# done

