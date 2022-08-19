#!/bin/bash

###########################################################################
# Local dev script for testing cypress e2e tests in container with Podman #
###########################################################################

set -eoux pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
DOCKER_TAG="$(git rev-parse --short HEAD)"
app=$1
spec=$2

APP_HOME=$(jq ".projects[\"$app\"]" -r < "$PROJECT_ROOT"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)
APP_SPEC=$(jq ".targets[\"$spec\"].options.spec" -r < "$PROJECT_ROOT"/"$APP_HOME"/project.json)

export DOCKER_TAG="${DOCKER_TAG}"

podman run \
 -v ./.tmp:/out \
 --security-opt label=disable  \
--env-file "${PROJECT_ROOT}/.env.secret.docker" \
--privileged \
-it "localhost/system-e2e:${DOCKER_TAG}" -P "/${APP_DIST_HOME}" -s "/${APP_DIST_HOME}/${APP_SPEC}" -C "/${APP_DIST_HOME}/cypress.config.js"

