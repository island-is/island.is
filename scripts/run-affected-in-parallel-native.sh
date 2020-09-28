#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# This is a helper script to run NX targets in parallel inside the same container

APP=nx-runner
# Build NX runner image if does not exist
docker image inspect ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} -f ' ' || \
  docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src=$PROJECT_ROOT/cache \
  -f ${DIR}/Dockerfile \
  --target=nx-runner --load \
  -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
  $PROJECT_ROOT

MAX_JOBS=${MAX_JOBS:-2}

AFFECTED_PROJECTS=`$DIR/_nx-affected-targets.sh $1 | tr -d '\n[:space:]'`
if [ ! -z "$AFFECTED_PROJECTS" ]
then
  echo "Affected projects for target $1 are '$AFFECTED_PROJECTS'"

  exec docker run \
    --rm \
    ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
    nx run-many --target=$1 --projects="$AFFECTED_PROJECTS" --parallel --maxParallel=$MAX_JOBS
else
  echo "No affected projects for target $1"
fi
