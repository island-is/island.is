#!/bin/bash
set -euo pipefail

# The `docker-build` target (see `tools/nx-plugins/docker-build.js`): builds and pushes the
# Docker image of a project, with the same scripts as the pipelines that don't use agents.
#
# APP, APP_HOME, DOCKER_TYPE: from the target
# DOCKER_TAG, DOCKER_REGISTRY, PUBLISH, EXTRA_DOCKER_BUILD_ARGS, ...: the environment of the agent,
# see the `docker-agents` job in `.github/workflows/push.yml`

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

IMAGE="${DOCKER_REGISTRY}/${APP}:${DOCKER_TAG}"
DATA_DIR="dist/docker-build-data"

write_build_data() {
  mkdir -p "$DATA_DIR"
  jq -n \
    --arg project "$APP" \
    --arg target "output-${DOCKER_TYPE#docker-}" \
    --arg imageTag "$DOCKER_TAG" \
    '{value: "build", project: $project, target: $target, imageName: $project, imageTag: $imageTag}' \
    >"$DATA_DIR/$APP.json"
}

# The tag is the same for every attempt of a workflow run, and this task is not cached by Nx.
# So when jobs are re-run, this is what keeps the images that are already there from being built again
if [[ "${PUBLISH:-}" == "true" ]] && docker manifest inspect "$IMAGE" >/dev/null 2>&1; then
  echo "$IMAGE is already in the registry"
  write_build_data
  exit 0
fi

# One build at a time on an agent, so the builder (and the layers it has) can be kept for the next one
export BUILDKIT_DRIVER_REUSE=true

build() {
  "$PROJECT_ROOT/scripts/ci/90_${DOCKER_TYPE}.sh"
}
if ! build; then
  echo "::warning title=Docker build::Building $APP failed, trying once more"
  build
fi
write_build_data
