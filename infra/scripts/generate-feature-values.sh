#!/bin/bash
set -euxo pipefail

FEATURE_NAME=$1
DOCKER_TAG=$2
IMAGE=$3
DOCKER_REGISTRY=$4
# "true" when the feature gets its own identity-server stack (the
# ids-deploy-feature PR label). Default: dev's IDS.
WITH_IDS=${5:-false}

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
  --ownIds "$WITH_IDS" \
  --jobImage "${ECR_REPO}:${DOCKER_TAG}" \
  --writeDest "${FEATURE_DIR}/${FEATURE_NAME}"

yarn feature-env \
  values \
  --skipAppName true \
  --disableNsGrants true \
  --chart islandis \
  --ownIds "$WITH_IDS" \
  --feature "$FEATURE_NAME" \
  --images "$IMAGE" \
  --dockertag "$DOCKER_TAG" \
  --writeDest "${FEATURE_DIR}/${FEATURE_NAME}"

if [ "$WITH_IDS" = "true" ]; then
  IDS_FEATURE_DIR="${GIT_ROOT}/charts/ids-features/deployments"
  mkdir -p "$IDS_FEATURE_DIR/$FEATURE_NAME"

  yarn feature-env \
    jobs \
    --feature "$FEATURE_NAME" \
    --images "*" \
    --chart identity-server \
    --ownIds true \
    --jobImage "${ECR_REPO}:${DOCKER_TAG}" \
    --writeDest "${IDS_FEATURE_DIR}/${FEATURE_NAME}"

  yarn feature-env \
    values \
    --skipAppName true \
    --disableNsGrants true \
    --chart identity-server \
    --ownIds true \
    --feature "$FEATURE_NAME" \
    --images "*" \
    --writeDest "${IDS_FEATURE_DIR}/${FEATURE_NAME}"
fi

# trigger ci

# yarn feature-env \
#   cleanup \
#   --feature "$FEATURE_NAME" \
#   --images "$IMAGE" \
