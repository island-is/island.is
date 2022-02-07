#!/bin/bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

DOCKER_REGISTRY=${DOCKER_REGISTRY:-821090935708.dkr.ecr.eu-west-1.amazonaws.com/}
PUBLISH=${PUBLISH:-false}
DOCKER_IMAGE="${DOCKER_REGISTRY}helm-config"
DOCKER_TAG=$1
POLICY_TAG=$2

docker build -f "$DIR"/Dockerfile -t "$DOCKER_IMAGE":"${DOCKER_TAG}" -t "$DOCKER_IMAGE":${POLICY_TAG} "$DIR"/../..

if [[ "true" = "$PUBLISH" ]] ; then
    docker push "$DOCKER_IMAGE":"${DOCKER_TAG} --all-tags"
fi
