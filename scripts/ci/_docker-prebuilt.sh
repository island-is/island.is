#!/bin/bash
# ------------------------------------------------
# _docker-prebuilt.sh
#
# Docker build script for PRE-BUILT apps.
# Expects NX build to have already run on the runner.
# Uses Dockerfile.prebuilt which copies dist/ assets instead of building.
# ------------------------------------------------
set -euox pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh
# shellcheck source-path=SCRIPTDIR
source "$DIR"/09_load-buildkit-driver.sh

APP_DIST_HOME="dist/${APP_HOME}"
DOCKERFILE=${1:-Dockerfile.prebuilt}
TARGET=${TARGET:-${2:-'<You need to set a target (e.g. output-jest)>'}}
ACTION=${3:-docker_build}
PLAYWRIGHT_VERSION="$(yarn info --json @playwright/test | jq -r '.children.Version')"
CONTAINER_BUILDER=${CONTAINER_BUILDER:-docker}
DOCKER_LOCAL_CACHE="${DOCKER_LOCAL_CACHE:-true}"
UPLOAD_ARTIFACT_DOCKER="${UPLOAD_ARTIFACT_DOCKER:-false}"

# Verify that pre-built assets exist
if [[ ! -d "${PROJECT_ROOT}/${APP_DIST_HOME}" ]]; then
  echo "ERROR: Pre-built assets not found at ${PROJECT_ROOT}/${APP_DIST_HOME}"
  echo "Make sure to run 'yarn nx build ${APP} --prod' before calling this script."
  exit 1
fi

echo "=== Using pre-built assets from ${APP_DIST_HOME} ==="

BUILD_ARGS=()

mkargs() {
  BUILD_ARGS=(
    --platform=linux/amd64
    --file="${DIR}/$DOCKERFILE"
    --target="$TARGET"
    "${PUBLISH_TO_REGISTRY[@]}"
    --build-arg="APP=${APP}"
    --build-arg="APP_HOME=${APP_HOME}"
    --build-arg="APP_DIST_HOME=${APP_DIST_HOME}"
    -t "${DOCKER_REGISTRY}/${APP}:${DOCKER_TAG}"
    --build-arg="PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}"
    --cache-from="type=s3,region=eu-west-1,bucket=${S3_DOCKER_CACHE_BUCKET},name=deps-cache"
  )
  for extra_arg in ${EXTRA_DOCKER_BUILD_ARGS:-}; do
    BUILD_ARGS+=("$extra_arg")
  done
  echo "${BUILD_ARGS[@]}"
}

container_build() {
  $CONTAINER_BUILDER buildx build "${BUILD_ARGS[@]}" "$PROJECT_ROOT"
}

docker_build() {
  mkargs local-cache=true
  container_build docker
}

_set_publish() {
  case $PUBLISH in
  true)
    PUBLISH_TO_REGISTRY=(--push)
    ;;
  local)
    PUBLISH_TO_REGISTRY=(--load)
    ;;
  *)
    # Just build the container but do not publish it to the registry
    PUBLISH_TO_REGISTRY=()
    ;;
  esac
}

main() {
  # Support overriding docker_build
  eval "${ACTION}"
}

_upload_artifact() {
  case $UPLOAD_ARTIFACT_DOCKER in
  true)
    IMAGE_NAME="$APP" APP_NAME="$APP" TARGET="$TARGET"  node "$DIR/docker/write-build-data.mjs"
    ;;
  false)
    ;;
  esac
}

_set_publish
main "$@"
_upload_artifact
