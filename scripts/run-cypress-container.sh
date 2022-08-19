#!/bin/bash

###########################################################################
# Local dev script for testing cypress e2e tests in container with Podman #
###########################################################################

set -eoux pipefail

function builder() {
  if type podman >/dev/null 2>&1; then
    podman run --privileged --security-opt label=disable "$@"
  else
      docker run "$@"
  fi
}

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
DOCKER_TAG="$(git rev-parse --short HEAD)"
ENV_FILE=".env.secret.docker"
app=$1
spec=$2

TMP_DIR="${PROJECT_ROOT}/tmp"
APP_HOME=$(jq ".projects[\"$app\"]" -r < "$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)
APP_SPEC=$(jq ".targets[\"$spec\"].options.spec" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)

export DOCKER_TAG="${DOCKER_TAG}"
mkdir -p "${TMP_DIR}"

# prepare .env file for docker
awk '{sub("export ","")}1' .env.secret > ${ENV_FILE}

builder \
  -v "${TMP_DIR}":/out \
  --env-file "${PROJECT_ROOT}/${ENV_FILE}" \
  -it "localhost/system-e2e:${DOCKER_TAG}" -P "/${APP_DIST_HOME}" -s "/${APP_DIST_HOME}/${APP_SPEC}" -C "/${APP_DIST_HOME}/cypress.config.js"

