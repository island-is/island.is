#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

# This is a helper script to run in parallel affected projects for a specific target
exec parallel --lb -j $MAX_JOBS APP={} $DIR/$1.sh ::: `$DIR/_nx-affected-targets.sh $1 | tr '\n,' ' '`