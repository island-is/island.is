#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh
# shellcheck source-path=SCRIPTDIR
source "$DIR"/09_load-buildkit-driver.sh

mkdir -p "$PROJECT_ROOT"/cache

NODE_IMAGE_VERSION=${NODE_IMAGE_VERSION:-20}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-821090935708.dkr.ecr.eu-west-1.amazonaws.com}

# Build and push deps layer to S3
echo "Building and pushing deps layer to S3..."
docker buildx build \
  --platform=linux/amd64 \
  -f "${DIR}/Dockerfile" \
  --cache-from="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=deps-cache" \
  --cache-to="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=deps-cache,mode=max" \
  --target=deps \
  "$PROJECT_ROOT"

echo "Build complete!"
