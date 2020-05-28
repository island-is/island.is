#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

RUNNER=test-runner
docker image inspect ${DOCKER_REGISTRY}${RUNNER}:${DOCKER_TAG} -f ' ' || docker buildx build --platform=linux/amd64 --cache-from=type=local,src=$PROJECT_ROOT/cache -f ${DIR}/Dockerfile --target=test --load --build-arg BUILDKIT_INLINE_CACHE=1 -t ${DOCKER_REGISTRY}${RUNNER}:${DOCKER_TAG} $PROJECT_ROOT
exec docker run --rm --net=host -e APPLICATION_DB_HOST -e APPLICATION_TEST_DB_USER -e APPLICATION_TEST_DB_PASS -e APPLICATION_TEST_DB_NAME -e APP=$APP ${DOCKER_REGISTRY}${RUNNER}:${DOCKER_TAG}
