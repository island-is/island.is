#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

mkdir -p "$PROJECT_ROOT"/cache
docker buildx create --driver docker-container --use || true

docker buildx build \
  --platform=linux/amd64 \
  --cache-to=type=local,dest="$PROJECT_ROOT"/cache \
  -f "${DIR}"/Dockerfile \
  --progress=plain \
  --target=deps \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --build-arg AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  "$PROJECT_ROOT"

docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src="$PROJECT_ROOT"/cache \
  --cache-to=type=local,dest="$PROJECT_ROOT"/cache_output \
  -f "${DIR}"/Dockerfile \
  --progress=plain \
  --target=output-base \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --build-arg AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  "$PROJECT_ROOT"
