#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/_common.sh

PROJECTS=`$PROJECT_ROOT/scripts/nx-affected-targets.sh $1`
>&2 echo "Projects: ${PROJECTS}"
export CHUNKS=$(node $PROJECT_ROOT/scripts/_chunk.js "${PROJECTS}")
>&2 echo "Chunks: $CHUNKS"
echo $CHUNKS
