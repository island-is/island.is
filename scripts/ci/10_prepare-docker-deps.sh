#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

mkdir -p "$PROJECT_ROOT"/cache

NODE_IMAGE_TAG=${NODE_IMAGE_TAG:-$(./scripts/ci/get-node-version.mjs)}

echo "APP value: $APP"

if yq e "select(.$APP.armBetaEnrolled == true) | length > 0" charts/islandis/values.prod.yaml; then
  PLATFORM=linux/aarch64
else
  PLATFORM=linux/aarch64
fi

docker buildx create --driver docker-container --use || true

docker buildx build \
  --platform=$PLATFORM \
  --cache-to=type=local,dest="$PROJECT_ROOT"/cache \
  --build-arg NODE_IMAGE_TAG="$NODE_IMAGE_TAG" \
  -f "${DIR}"/Dockerfile \
  --target=deps \
  "$PROJECT_ROOT"

docker buildx build \
  --platform=$PLATFORM \
  --cache-from=type=local,src="$PROJECT_ROOT"/cache \
  --cache-to=type=local,dest="$PROJECT_ROOT"/cache_output \
  --build-arg NODE_IMAGE_TAG="$NODE_IMAGE_TAG" \
  -f "${DIR}"/Dockerfile \
  --target=output-base \
  "$PROJECT_ROOT"
