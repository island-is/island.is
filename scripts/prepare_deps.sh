#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# Build the node_modules as well as the base image for the final outputs and store it in the shared cache so it can be reused later

mkdir -p $PROJECT_ROOT/cache
# docker buildx create --driver docker-container --use || true

$CACHE_PUBLISH && (docker pull ${CACHE_REGISTRY_REPO}deps:${DEPS} || true)
docker image inspect ${CACHE_REGISTRY_REPO}deps:${DEPS} -f ' ' > /dev/null  2>&1 || ( \
docker build \
  -f ${DIR}/Dockerfile \
  --target deps \
  -t ${CACHE_REGISTRY_REPO}deps:${DEPS} \
  $PROJECT_ROOT ; \
\
docker build \
  -f ${DIR}/Dockerfile \
  --target output-base \
  --cache-from ${CACHE_REGISTRY_REPO}deps:${DEPS} \
  -t ${CACHE_REGISTRY_REPO}output-base:${DEPS} \
  $PROJECT_ROOT \
  ; \
  $CACHE_PUBLISH && docker push ${CACHE_REGISTRY_REPO}deps:${DEPS} \
  ; \
  $CACHE_PUBLISH && docker push ${CACHE_REGISTRY_REPO}output-base:${DEPS} \

)
