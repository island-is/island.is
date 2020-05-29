#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# This is a helper script to find NX affected projects for a specific target

APP=nx-runner
docker image inspect ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} -f ' ' || docker buildx build --platform=linux/amd64 --cache-from=type=local,src=$PROJECT_ROOT/cache -f ${DIR}/Dockerfile --target=nx-runner --load --build-arg BUILDKIT_INLINE_CACHE=1 -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} $PROJECT_ROOT
exec docker run --rm ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} nx print-affected --target=$1 --select=tasks.target.project --head=$HEAD --base=$BASE
