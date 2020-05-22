#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# docker build -f ${DIR}/Dockerfile --target=output-express --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${DEPS_TAG} . 
# docker build -f ${DIR}/Dockerfile --target=tests --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg APP=${APP} -t tests .
# docker-compose -f ${DIR}/../apps/${APP}/docker-compose.yml

# docker images | grep ${APP}