#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh
MAX_JOBS=${MAX_JOBS:-2}

# This is a helper script to find affected projects for a specific target
exec parallel --lb -j $MAX_JOBS APP={} $DIR/$1.sh ::: `$DIR/nx-affected-targets.sh $1 | tr '\n,' ' '`