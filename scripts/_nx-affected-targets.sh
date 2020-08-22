#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh
export HEAD=${HEAD:-HEAD}
export BASE=${BASE:-master}
# This is a helper script to find NX affected projects for a specific target

APP=nx-runner

AFFECTED_ALL=${AFFECTED_ALL:-} # Could be used for forcing all projects to be affected (set or create `secret` in GitHub with the name of this variable set to the name of the branch that should be affected, prefixed with the magic string `7913-`)
if [[ ! -z "$BRANCH" && ! -z "$AFFECTED_ALL" && "$AFFECTED_ALL" == "7913-$BRANCH" ]] 
then
  AFFECTED_FLAGS=" --all "
else
  AFFECTED_FLAGS=" --head=$HEAD --base=$BASE "
fi
# Build NX runner image if does not exist
docker image inspect ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} -f ' ' || \
  docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src=$PROJECT_ROOT/cache \
  -f ${DIR}/Dockerfile \
  --target=nx-runner --load \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
  $PROJECT_ROOT

exec npx \
  nx print-affected --target=$1 --select=tasks.target.project $AFFECTED_FLAGS

exec docker run \
  --rm \
  ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
  nx print-affected --target=$1 --select=tasks.target.project $AFFECTED_FLAGS
