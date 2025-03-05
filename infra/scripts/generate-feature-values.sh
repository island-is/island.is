#!/bin/bash
set -euxo pipefail

FEATURE_NAME=$1
DOCKER_TAG=$2
IMAGES=$3

GIT_ROOT="$(git rev-parse --show-toplevel)"
INFRA_ROOT="${GIT_ROOT}/infra"
ECR_REPO='821090935708.dkr.ecr.eu-west-1.amazonaws.com/helm-config'
FEATURE_DIR="${GIT_ROOT}/charts/features"
mkdir -p "$FEATURE_DIR"

cd "$INFRA_ROOT"

yarn feature-env \
  jobs \
  --feature "$FEATURE_NAME" \
  --images "$IMAGES" \
  --chart islandis \
  --jobImage "${ECR_REPO}:${DOCKER_TAG}" >"${FEATURE_DIR}/${FEATURE_NAME}-job-manifest.yaml"

yarn feature-env \
  values \
  --chart islandis \
  --feature "$FEATURE_NAME" \
  --images "$IMAGES" \
  --dockertag "$DOCKER_TAG" >"${FEATURE_DIR}/${FEATURE_NAME}.yaml"
