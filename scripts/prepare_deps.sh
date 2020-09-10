#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# Build the node_modules as well as the base image for the final outputs and store it in the shared cache so it can be reused later

mkdir -p $PROJECT_ROOT/cache
docker buildx create --driver docker-container --use || true
exec docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src=$PROJECT_ROOT/cache \
  --cache-to=type=local,dest=$PROJECT_ROOT/cache \
  -f ${DIR}/Dockerfile \
  --target=output-base \
  $PROJECT_ROOT
