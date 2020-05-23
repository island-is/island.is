#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

exec docker build -f ${DIR}/Dockerfile --target=linter --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg APP=${APP} . 
