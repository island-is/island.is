#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# docker buildx create --driver docker-container --use || true

docker build \
  -f ${DIR}/Dockerfile \
  --target=deps \
  --tag=deps \
  $PROJECT_ROOT

docker run --rm -v $PROJECT_ROOT/cache:/usr/local/share/.cache deps 

# store $PROJECT_ROOT/cache 