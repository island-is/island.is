#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

docker build -f ${DIR}/Dockerfile --target=output-express --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${DEPS_TAG} . 
$PUBLISH || echo "Not publishing ${DEPS_TAG}"
$PUBLISH && docker push ${DOCKER_REGISTRY}${APP}:${DEPS_TAG}