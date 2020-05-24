#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# docker pull ${DOCKER_REGISTRY}${APP}:${DEPS_TAG} || true
docker buildx build --platform=linux/amd64 --cache-from=type=local,src=$PROJECT_ROOT/cache --cache-to=type=local,dest=$PROJECT_ROOT/cache -f ${DIR}/Dockerfile --target=formatting --build-arg APP=${APP} . 
# $PUBLISH || echo "Not publishing ${DEPS_TAG}"
# $PUBLISH && docker push ${DOCKER_REGISTRY}${APP}:${DEPS_TAG}