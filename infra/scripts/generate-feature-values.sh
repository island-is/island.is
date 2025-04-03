#!/bin/bash
set -euxo pipefail

FEATURE_NAME=$1
DOCKER_TAG=$2
IMAGE=$3

GIT_ROOT="$(git rev-parse --show-toplevel)"
INFRA_ROOT="${GIT_ROOT}/infra"
FEATURE_DIR="${GIT_ROOT}/charts/features/deployments"
ECR_REPO='821090935708.dkr.ecr.eu-west-1.amazonaws.com/helm-config'
mkdir -p "$FEATURE_DIR/$FEATURE_NAME/$IMAGE"

cd "$INFRA_ROOT"

yarn feature-env \
  jobs \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --chart islandis \
  --jobImage "${ECR_REPO}:${DOCKER_TAG}" >"${FEATURE_DIR}/${FEATURE_NAME}/${IMAGE}/values-job-manifest.yaml"

yarn feature-env \
  values \
  --skipAppName true \
  --chart islandis \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --dockertag "$DOCKER_TAG" >"${FEATURE_DIR}/${FEATURE_NAME}/${IMAGE}/values.yaml"
