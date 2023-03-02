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

function docker_build() {
  local build_args=()

  build_args+=(--platform=linux/amd64 )
  build_args+=(-f "${DIR}"/"$DOCKERFILE" )
  build_args+=(--target="$TARGET" )
  build_args+=("${PUBLISH_TO_REGISTRY[@]}" )
  build_args+=(--build-arg APP="${APP}" )
  build_args+=(--build-arg APP_HOME="${APP_HOME}" )
  build_args+=(--build-arg APP_DIST_HOME="${APP_DIST_HOME}" )
  build_args+=(${EXTRA_DOCKER_BUILD_ARGS:-} )
  build_args+=(-t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}" )

  if ! docker --version 2>/dev/null | grep -q podman >/dev/null; then
    build_args+=("--cache-from=type=local,src='$PROJECT_ROOT'/cache")
    build_args+=("--cache-from=type=local,src='$PROJECT_ROOT'/cache_output")
  fi

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
