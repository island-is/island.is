#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_HOME=$(jq ".projects[\"$APP\"].root" -r < "$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".projects[\"$APP\"].architect.build.options.outputPath" -r < "$PROJECT_ROOT"/workspace.json)
DOCKERFILE=$1
TARGET=$2

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

docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src="$PROJECT_ROOT"/cache \
  --cache-from=type=local,src="$PROJECT_ROOT"/cache_output \
  -f "${DIR}"/"$DOCKERFILE" \
  --target="$TARGET" \
  "${PUBLISH_TO_REGISTRY[@]}" \
  --build-arg APP="${APP}" \
  --build-arg APP_HOME="${APP_HOME}" \
  --build-arg APP_DIST_HOME="${APP_DIST_HOME}" \
  -t "${DOCKER_REGISTRY}""${APP}":"${DOCKER_TAG}" \
  "$PROJECT_ROOT"
