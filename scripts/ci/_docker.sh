#!/bin/bash
set -euo pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_HOME=$(yarn nx show project $APP | jq ".root" -r)
APP_DIST_HOME=$(yarn nx show project $APP | jq ".targets.build.options | .outputPath // .outputDir" -r)
DOCKERFILE=${1:-Dockerfile}
TARGET=${TARGET:-${2:-'<You need to set a target (e.g. output-local, output-jest)>'}}
ACTION=${3:-docker_build}
PLAYWRIGHT_VERSION="$(yarn info --json @playwright/test | jq -r '.children.Version')"
CONTAINER_BUILDER=${CONTAINER_BUILDER:-docker}
DOCKER_LOCAL_CACHE="${DOCKER_LOCAL_CACHE:-true}"

BUILD_ARGS=()

mkargs() {
  local local_cache="${1:-local-cache=yes}"
  BUILD_ARGS=(
    --platform=linux/amd64
    --file="${DIR}/$DOCKERFILE"
    --target="$TARGET"
    "${PUBLISH_TO_REGISTRY[@]}"
    --build-arg="APP=${APP}"
    --build-arg="APP_HOME=${APP_HOME}"
    --build-arg="APP_DIST_HOME=${APP_DIST_HOME}"
    -t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}"
    --build-arg="PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}"
  )
  for extra_arg in ${EXTRA_DOCKER_BUILD_ARGS:-}; do
    BUILD_ARGS+=("$extra_arg")
  done
  if [[ "${local_cache}" =~ local-cache=(yes|y|true) ]] && [[ "${DOCKER_LOCAL_CACHE}" == true ]]; then
    BUILD_ARGS+=(--cache-from="type=local,src=$PROJECT_ROOT/cache")
    BUILD_ARGS+=(--cache-from="type=local,src=$PROJECT_ROOT/cache_output")
  fi
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

# Exit if not directly run
return 2>/dev/null || true
_set_publish
main "$@"
