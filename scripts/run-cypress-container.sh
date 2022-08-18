#!/bin/bash

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
  --env-file "${PROJECT_ROOT}/.env.secret.docker" \
  --privileged \
  -it "localhost/system-e2e:23e77d0674" -P "/${APP_DIST_HOME}" -s "/${APP_DIST_HOME}/${APP_SPEC}" -C "/${APP_DIST_HOME}/cypress.config.js"

  # -it "localhost/system-e2e:$DOCKER_TAG" -P apps/system-e2e --spec "apps/${APP}-e2e/src/integration/service-portal/smoketest/homepage.spec.ts"

