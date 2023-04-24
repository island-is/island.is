#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ -z "$USE_NX_CLOUD" ]]; then
  echo "USE_NX_CLOUD env var is missing, exiting now ..."
  exit 0
fi

target=$1

shift # remove target from args

source "$DIR"/_common.sh
source "$DIR"/patch-nx-json.sh

MAX_JOBS=${MAX_JOBS:-2}
YARN_BIN=$(which yarn)
echo "$YARN_BIN"
$YARN_BIN dlx -p  @nrwl/nx-cloud@v13.3.1 -- "$YARN_BIN" run nx affected --base="$BASE" --head="$HEAD" --target="$target" --parallel="$MAX_JOBS" "$@"
