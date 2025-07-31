#!/bin/bash
set -euxo pipefail

FEATURE_NAME=$1
DOCKER_TAG=$2
IMAGE=$3
DOCKER_REGISTRY=$4

GIT_ROOT="$(git rev-parse --show-toplevel)"
INFRA_ROOT="${GIT_ROOT}/infra"
FEATURE_DIR="${GIT_ROOT}/charts/features/deployments"
ECR_REPO="${DOCKER_REGISTRY}/helm-config"
mkdir -p "$FEATURE_DIR/$FEATURE_NAME"

cd "$INFRA_ROOT"

yarn feature-env \
  jobs \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --chart islandis \
  --jobImage "${ECR_REPO}:${DOCKER_TAG}" \
  --writeDest "${FEATURE_DIR}/${FEATURE_NAME}"

yarn feature-env \
  values \
  --skipAppName true \
  --disableNsGrants true \
  --chart islandis \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --dockertag "$DOCKER_TAG" \
  --writeDest "${FEATURE_DIR}/${FEATURE_NAME}"

yarn feature-env \
  cleanup \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --chart islandis \
  --cleanupImage "${ECR_REPO}:${DOCKER_TAG}" \
  --writeDest "${FEATURE_DIR}/${FEATURE_NAME}"
