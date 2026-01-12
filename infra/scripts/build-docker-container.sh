#!/bin/bash
set -euox pipefail
GIT_ROOT=$(git rev-parse --show-toplevel)
DOCKERFILE="${GIT_ROOT}/infra/scripts/Dockerfile"

DOCKER_REGISTRY=${DOCKER_REGISTRY:-821090935708.dkr.ecr.eu-west-1.amazonaws.com}
PUBLISH=${PUBLISH:-false}
DOCKER_IMAGE="${DOCKER_REGISTRY}/helm-config"
DOCKER_TAG=$1

# shellcheck disable=SC2086
docker build -f ${DOCKERFILE} ${EXTRA_DOCKER_BUILD_ARGS:-} -t "$DOCKER_IMAGE":"${DOCKER_TAG}" ${GIT_ROOT}

if [[ "true" = "$PUBLISH" ]]; then
  docker push "$DOCKER_IMAGE":"${DOCKER_TAG}"
fi
