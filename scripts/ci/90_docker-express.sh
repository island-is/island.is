#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

# Building Docker images for ExpressJS-based apps
APP_HOME=`cat $PROJECT_ROOT/workspace.json | jq ".projects[\"$APP\"].root" -r`
APP_DIST_HOME=`cat $PROJECT_ROOT/workspace.json | jq ".projects[\"$APP\"].architect.build.options.outputPath" -r`
SUFFIX="${RANDOM}"
docker build \
  --platform=linux/amd64 \
  -f ${DIR}/Dockerfile \
  --target=builder \
  --tag=builder-$SUFFIX \
  $PROJECT_ROOT

docker run --name=builder-$SUFFIX -v $PROJECT_ROOT/cache:/usr/local/share/.cache builder-$SUFFIX
mkdir -p cache-build-$SUFFIX/apps cache-build-$SUFFIX/dist/apps
# docker cp builder:/build/${APP_HOME} ./build/${APP_HOME}
docker cp builder-$SUFFIX:/build/${APP_DIST_HOME} ./cache-build-$SUFFIX/${APP_DIST_HOME}
docker rm builder-$SUFFIX

docker build \
  --platform=linux/amd64 \
  -f ${DIR}/Dockerfile \
  --target=output-express \
  --tag=output-express-$SUFFIX \
  $PROJECT_ROOT
# docker rm -f output-express || true
docker create --name=output-express-$SUFFIX -v $PROJECT_ROOT/cache:/usr/local/share/.cache output-express-$SUFFIX
docker cp ./build/${APP_DIST_HOME} output-express-$SUFFIX:/webapp/
docker commit output-express-$SUFFIX ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG}
# exec $DIR/_docker.sh output-express