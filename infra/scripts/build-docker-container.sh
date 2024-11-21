#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

DOCKER_REGISTRY=${DOCKER_REGISTRY:-821090935708.dkr.ecr.eu-west-1.amazonaws.com/}
PUBLISH=${PUBLISH:-false}
DOCKER_IMAGE="${DOCKER_REGISTRY}helm-config"
DOCKER_TAG=$1

# shellcheck disable=SC2086
CI=true docker build --load -f "$DIR"/Dockerfile ${EXTRA_DOCKER_BUILD_ARGS:-} -t "$DOCKER_IMAGE":"${DOCKER_TAG}" --target="${BUILD_TARGET:-runner}" "$DIR"/../..

if [[ "true" = "$PUBLISH" ]]; then
  docker push "$DOCKER_IMAGE":"${DOCKER_TAG}"
fi

echo "Successfully built docker image '$DOCKER_IMAGE:${DOCKER_TAG}'"
