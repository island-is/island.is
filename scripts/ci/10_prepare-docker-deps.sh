#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

mkdir -p "$PROJECT_ROOT"/cache

NODE_IMAGE_VERSION=${NODE_IMAGE_VERSION:-20}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-821090935708.dkr.ecr.eu-west-1.amazonaws.com}

docker buildx rm actions_builder || true
docker buildx create --name actions_builder --driver docker-container --use --driver-opt image="${DOCKER_REGISTRY}/moby/buildkit:buildx-stable-1"

LAYERS=("base" "deps")

# Build and push deps layer to S3
for LAYER in "${LAYERS[@]}"; do
  echo "Building and pushing ${LAYER} layer to S3..."
  docker buildx build \
    --platform=linux/amd64 \
    --cache-from="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=cache-${LAYER}" \
    --cache-to="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=cache-${LAYER},mode=max" \
    --build-arg NODE_IMAGE_VERSION="$NODE_IMAGE_VERSION" \
    -f "${DIR}"/Dockerfile \
    --target="${LAYER}" \
    "$PROJECT_ROOT"
done

echo "Build complete!"
