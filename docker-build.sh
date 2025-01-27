#!/bin/bash

set -euo pipefail

APP=$1
APP_HOME="apps/${APP}"
APP_DIST_HOME="dist/${APP_HOME}"
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 821090935708.dkr.ecr.eu-west-1.amazonaws.com/ecr-public/docker/library/node:20-alpine3.20

# docker buildx build \
#   --platform=linux/amd64 \
#   --file=./scripts/ci/Dockerfile \
#   --target=output-playwright \
#   --build-arg=APP=system-e2e \
#   --build-arg=APP_HOME=apps/system-e2e \
#   --build-arg=APP_DIST_HOME=dist/apps/system-e2e \
#   -t 821090935708.dkr.ecr.eu-west-1.amazonaws.com/system-e2e:main_f4563acb95_116625 \
#   --build-arg=PLAYWRIGHT_VERSION=1.48.2 \
#   --build-arg=DOCKER_IMAGE_REGISTRY=821090935708.dkr.ecr.eu-west-1.amazonaws.com/ecr-public \
#   --build-arg=NODE_IMAGE_TAG=20-alpine3.20 \
#   --build-arg=GIT_BRANCH=main \
#   --build-arg=GIT_COMMIT_SHA=f4563acb95282c9c245987b40b1444a8a74de95f \
#   --build-arg=GIT_REPOSITORY_URL=github.com/island-is/island.is .
#
docker buildx build \
  --platform=linux/amd64 \
  --file=./scripts/ci/Dockerfile \
  --target=output-express \
  --build-arg=APP="${APP}" \
  --build-arg=APP_HOME="${APP_HOME}" \
  --build-arg=APP_DIST_HOME="${APP_DIST_HOME}" \
  -t 821090935708.dkr.ecr.eu-west-1.amazonaws.com/api:foo \
  --build-arg=PLAYWRIGHT_VERSION=1.48.2 \
  --build-arg=DOCKER_IMAGE_REGISTRY=821090935708.dkr.ecr.eu-west-1.amazonaws.com/ecr-public \
  --build-arg=NODE_IMAGE_TAG=20-alpine3.20 \
  --build-arg=GIT_BRANCH=main \
  --build-arg=GIT_COMMIT_SHA=f4563acb95282c9c245987b40b1444a8a74de95f \
  --build-arg=GIT_REPOSITORY_URL=github.com/island-is/island.is .
