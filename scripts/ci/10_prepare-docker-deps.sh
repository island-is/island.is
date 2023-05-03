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
  --target=deps \
  --build-arg NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN \
  "$PROJECT_ROOT"

docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src="$PROJECT_ROOT"/cache \
  --cache-to=type=local,dest="$PROJECT_ROOT"/cache_output \
  -f "${DIR}"/Dockerfile \
  --target=output-base \
  --build-arg NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN \
  "$PROJECT_ROOT"
