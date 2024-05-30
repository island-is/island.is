#!/bin/bash
set -euo pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
. "${DIR}"/_common.sh

DOCKERFILE="${1:-Dockerfile}"
TARGET="${2:-${TARGET:-'<You need to set a target (e.g. output-local, output-jest)>'}}"
ACTION="${3:-docker_build}"

APP_HOME="$(yarn nx show project "${APP}" | jq ".root" -r)"
APP_DIST_HOME="$(yarn nx show project "${APP}" | jq ".targets.build.options | .outputPath // .outputDir" -r)"
PLAYWRIGHT_VERSION="$(yarn info --json @playwright/test | jq -r '.children.Version')"
: "${CONTAINER_BUILDER:-docker}"
: "${DOCKER_LOCAL_CACHE:-true}"
: "${LOCAL_CACHE:=true}"

BUILD_ARGS=()

set-containerer-args() {
  BUILD_ARGS=(
    --platform=linux/amd64
    --file="${DIR}/${DOCKERFILE}"
    --target="${TARGET}"
    "${PUBLISH_TO_REGISTRY[@]}"
    --build-arg="APP=${APP}"
    --build-arg="APP_HOME=${APP_HOME}"
    --build-arg="APP_DIST_HOME=${APP_DIST_HOME}"
    -t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}"
    --build-arg="PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}"
  )
  for extra_arg in ${EXTRA_DOCKER_BUILD_ARGS:-}; do
    BUILD_ARGS+=("${extra_arg}")
  done
  if [[ "${LOCAL_CACHE}" == true ]]; then
    BUILD_ARGS+=(--cache-from="type=local,src=${PROJECT_ROOT}/cache")
    BUILD_ARGS+=(--cache-from="type=local,src=${PROJECT_ROOT}/cache_output")
  fi
}

container_build() {
  "${1:-CONTAINER_BUILDER}" buildx build "${BUILD_ARGS[@]}" "${PROJECT_ROOT}"
}

docker_build() {
  set-containerer-args local-cache=true
  container_build docker
}

_set_publish() {
  case "${PUBLISH}" in
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
  "${ACTION}"
}

# Set podman-specific config
if (
  # `docker` is missing, but `podman` is present
  (! command -v docker >/dev/null && command -v podman >/dev/null) ||
    # `docker` _is_ `podman`
    docker version | grep -qi 'podman'
); then
  # podman doesn't support key-value in `--cache-*`
  export CONTAINER_BUILDER=podman LOCAL_CACHE=false
fi

_set_publish
set-containerer-args
main "${@}"
