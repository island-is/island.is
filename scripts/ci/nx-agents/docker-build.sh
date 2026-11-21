#!/bin/bash
set -euo pipefail

# The `docker-build` target (see `tools/nx-plugins/docker-build.js`): builds and pushes the
# Docker image of a project, with the same scripts as the pipelines that don't use agents.
#
# An image is only built if it is not in the registry already:
# - With the tag of this run, which is the same for every attempt of a workflow run. This task
#   is not cached by Nx, so that is what keeps re-run jobs from building everything again.
# - With a tag from the hash of this task (`nx-<hash>`: the project and what it depends on, the
#   Dockerfiles, the node version, ...), from any earlier run. That image gets the tag of this run,
#   which is what a feature is deployed with. The services a feature deployment adds to what is
#   affected rarely change, so they are rarely built.
#   What is in such an image is the same, except for what the build wrote about itself: the
#   commit and branch (GIT_COMMIT_SHA, DD_GIT_*, ...) are the ones it was built from.
#
# APP, APP_HOME, DOCKER_TYPE: from the target
# DOCKER_TAG, DOCKER_REGISTRY, PUBLISH, EXTRA_DOCKER_BUILD_ARGS, ...: the environment of the agent,
# see the `docker-agents` job in `.github/workflows/push.yml`

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# The tests on the same agent want it with a slash at the end, the Docker scripts without
export DOCKER_REGISTRY="${DOCKER_REGISTRY%/}"
IMAGE="${DOCKER_REGISTRY}/${APP}:${DOCKER_TAG}"
CONTENT_IMAGE=""
if [[ -n "${NX_TASK_HASH:-}" ]]; then
  CONTENT_IMAGE="${DOCKER_REGISTRY}/${APP}:nx-${NX_TASK_HASH}"
fi
DATA_DIR="dist/docker-build-data"

# $1: built, reused (from an earlier run) or present (from an earlier attempt of this run)
finish() {
  mkdir -p "$DATA_DIR"
  jq -n \
    --arg project "$APP" \
    --arg target "output-${DOCKER_TYPE#docker-}" \
    --arg imageTag "$DOCKER_TAG" \
    '{value: "build", project: $project, target: $target, imageName: $project, imageTag: $imageTag}' \
    >"$DATA_DIR/$APP.json"
  echo "Docker image of $APP: $1 (${CONTENT_IMAGE:-no task hash})"
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    echo "- \`$APP\`: $1" >>"$GITHUB_STEP_SUMMARY"
  fi
}

in_registry() {
  docker manifest inspect "$1" >/dev/null 2>&1
}

# Gives an image in the registry another tag, without pulling or pushing it
tag_in_registry() {
  docker buildx imagetools create --tag "$2" "$1"
}

if [[ "${PUBLISH:-}" == "true" ]]; then
  if in_registry "$IMAGE"; then
    finish present
    exit 0
  fi
  if [[ -n "$CONTENT_IMAGE" ]] && in_registry "$CONTENT_IMAGE"; then
    if tag_in_registry "$CONTENT_IMAGE" "$IMAGE"; then
      finish reused
      exit 0
    fi
    echo "::warning title=Docker build::Could not tag $CONTENT_IMAGE as $IMAGE, building $APP instead"
  fi
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

# For the next run. Not something to fail for, the image of this run is there
if [[ "${PUBLISH:-}" == "true" && -n "$CONTENT_IMAGE" ]]; then
  tag_in_registry "$IMAGE" "$CONTENT_IMAGE" ||
    echo "::warning title=Docker build::Could not tag $IMAGE as $CONTENT_IMAGE"
fi
finish built
