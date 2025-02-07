#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

mkdir -p "$PROJECT_ROOT"/cache

NODE_IMAGE_VERSION=${NODE_IMAGE_VERSION:-20}

docker buildx create --driver docker-container --use || true

# Build and push deps layer to S3
echo "Building and pushing deps layer to S3..."
docker buildx build \
  --platform=linux/amd64 \
  --cache-to="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=cache,mode=max" \
  --build-arg NODE_IMAGE_VERSION="$NODE_IMAGE_VERSION" \
  -f "${DIR}"/Dockerfile \
  --target=deps \
  "$PROJECT_ROOT"

echo "Build complete!"
