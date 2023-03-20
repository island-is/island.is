#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_HOME=$(jq ".projects[\"$APP\"]" -r <"$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r <"$PROJECT_ROOT"/"$APP_HOME"/project.json)
DOCKERFILE=${1:-DockerFile}
TARGET=${2:-unset_target}
ACTION=${3:-docker_build}
PLAYWRIGHT_VERSION="$(yarn info --json @playwright/test | jq -r '.children.Version')"

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
  if [[ "${local_cache}" =~ local-cache=(yes|y|true) ]]; then
    BUILD_ARGS+=(--cache-from="type=local,src=$PROJECT_ROOT/cache")
    BUILD_ARGS+=(--cache-from="type=local,src=$PROJECT_ROOT/cache_output")
  fi
}

builder_build() {
  local builder="${1:-docker}"
  $builder buildx build "${BUILD_ARGS[@]}" "$PROJECT_ROOT"
}

docker_build() {
  mkargs local-cache=true
  builder_build docker
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
