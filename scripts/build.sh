#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

exec docker buildx build --platform=linux/amd64 --cache-from=type=local,src=$PROJECT_ROOT/cache -f ${DIR}/Dockerfile --target=output-express --push --build-arg BUILDKIT_INLINE_CACHE=1  --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} $PROJECT_ROOT

# docker pull ${DOCKER_REGISTRY}${APP}:${DEPS_TAG} || true
# docker build -f ${DIR}/Dockerfile --target=output-express --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg BUILDKIT_INLINE_CACHE=1 --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} . 
# $PUBLISH || echo "Not publishing ${DEPS_TAG}"
# $PUBLISH && docker push ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG}