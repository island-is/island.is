#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# shellcheck disable=SC1091
source "$DIR"/_common.sh

export DOCKER_TAG=$(git rev-parse --short HEAD)

DOCKERFILE=$1
# TARGET="${2}"
APP="${3}"

# pass remaining args as docker cmd args
shift 3


APP_HOME=$(jq ".projects[\"$APP\"]" -r < "$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)


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
# shellcheck disable=SC2086
podman build \
  -f "${DIR}"/"$DOCKERFILE" \
  "${PUBLISH_TO_REGISTRY[@]}" \
  ${EXTRA_DOCKER_BUILD_ARGS:-} \
  --build-arg APP="${APP}" \
  --build-arg APP_HOME="${APP_HOME}" \
  --build-arg APP_DIST_HOME="${APP_DIST_HOME}" \
  -t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}" "$PROJECT_ROOT" "${@}"
