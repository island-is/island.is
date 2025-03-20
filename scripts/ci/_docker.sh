#!/bin/bash
set -euox pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_DIST_HOME="dist/${APP_HOME}"
DOCKERFILE=${1:-Dockerfile}
TARGET=${TARGET:-${2:-'<You need to set a target (e.g. output-jest)>'}}
ACTION=${3:-docker_build}
PLAYWRIGHT_VERSION="$(yarn info --json @playwright/test | jq -r '.children.Version')"
CONTAINER_BUILDER=${CONTAINER_BUILDER:-docker}
DOCKER_LOCAL_CACHE="${DOCKER_LOCAL_CACHE:-true}"
UPLOAD_ARTIFACT_DOCKER="${UPLOAD_ARTIFACT_DOCKER:-false}"

BUILD_ARGS=()

mkargs() {
  BUILD_ARGS=(
    --context="$PROJECT_ROOT"
    --dockerfile="${DIR}/$DOCKERFILE"
    --target="$TARGET"
    --context="$PROJECT_ROOT"
    --build-arg="APP=${APP}"
    --build-arg="APP_HOME=${APP_HOME}"
    --build-arg="APP_DIST_HOME=${APP_DIST_HOME}"
    --build-arg="NX_CLOUD_ACCESS_TOKEN=$(cat nx_cloud_access_token.txt)"
    --destination "${DOCKER_REGISTRY}/${APP}:${DOCKER_TAG}"
    --build-arg="PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}"
    --cache=true
    --cache-run-layers=true
    --cache-repo="${DOCKER_REGISTRY}/docker-cache"
  )
  for extra_arg in ${EXTRA_DOCKER_BUILD_ARGS:-}; do
    BUILD_ARGS+=("$extra_arg")
  done
  echo "${BUILD_ARGS[@]}"
}

container_build() {
  /kaniko/executor "${BUILD_ARGS[@]}"
}

docker_build() {
  mkargs
  container_build
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
    IMAGE_NAME="$APP" APP_NAME="$APP" TARGET="$TARGET" node "$DIR/docker/write-build-data.mjs"
    ;;
  false) ;;
  esac
}

_set_publish
main "$@"
# _upload_artifact
