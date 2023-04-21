#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ -n "$USE_NX_CLOUD" ];
then
  echo "USE_NX_CLOUD enabled, patching nx.json to use nx cloud runner ..."
  tmp=$(mktemp)
  jq '.tasksRunnerOptions.default.runner = "@nrwl/nx-cloud"' nx.json > "$tmp" && mv "$tmp" nx.json
fi
target=$1
shift # remove target from remaining args

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
