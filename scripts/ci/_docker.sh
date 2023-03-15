#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_HOME=$(jq ".projects[\"$APP\"]" -r < "$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)
DOCKERFILE=$1
TARGET=$2
ACTION=${3:-docker_build}
: "${PLAYWRIGHT_VERSION:=$(yarn info --json @playwright/test | jq -r '.children.Version')}"

function docker_build() {
  local build_args=(
    --platform=linux/amd64 \
    --file="${DIR}/$DOCKERFILE" \
    --target="$TARGET" \
    "${PUBLISH_TO_REGISTRY[@]}" \
    --build-arg="APP=${APP}" \
    --build-arg="APP_HOME=${APP_HOME}" \
    --build-arg="APP_DIST_HOME=${APP_DIST_HOME}" \
    -t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}" \
    --build-arg="PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}" \
  )
  for extra_arg in ${EXTRA_DOCKER_BUILD_ARGS:-}; do
    build_args+=("$extra_arg")
  done
  if ! docker --version | grep -q podman; then
    build_args+=(--cache-from="type=local,src=$PROJECT_ROOT/cache")
    build_args+=(--cache-from="type=local,src=$PROJECT_ROOT/cache_output")
  fi

  for arg in "${build_args[@]}"; do echo "BUILD_ARG: $arg"; done
  # shellcheck disable=SC2086
  docker buildx build "${build_args[@]}" \
    "$PROJECT_ROOT"
}

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

# Support overriding docker_build
eval "${ACTION}"
