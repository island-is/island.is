#!/bin/bash

set -euoxo pipefail

LATEST_TAG=latest
CURRENT_TAG=latest
LAST_DEPS_TAG=${LATEST_TAG}_deps
DEPS_TAG=${CURRENT_TAG}_deps
SRC_TAG=${CURRENT_TAG}_src
DOCKER_REGISTRY=
docker build -f apps/${APP}/Dockerfile --target=deps --cache-from=${DOCKER_REGISTRY}${APP}:${LAST_DEPS_TAG} --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${DEPS_TAG} . 
docker build -f apps/${APP}/Dockerfile --target=src --cache-from=${DOCKER_REGISTRY}${APP}:${DEPS_TAG} --build-arg APP=${APP} -t ${DOCKER_REGISTRY}${APP}:${SRC_TAG} . 
# docker push ${DOCKER_REGISTRY}${APP}:${DEPS_TAG}
docker build -f apps/${APP}/Dockerfile --target=linter --cache-from=${DOCKER_REGISTRY}${APP}:${SRC_TAG} --build-arg APP=${APP} . 
docker build -f apps/${APP}/Dockerfile --target=tests --cache-from=${DOCKER_REGISTRY}${APP}:${SRC_TAG} --build-arg APP=${APP} .

docker images | grep ${APP}