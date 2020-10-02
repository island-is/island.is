#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

export DOCKER_TAG=local
export PUBLISH=local

export APP=$1

# We can do this to find last good build. Needs a few env variables though.
# source $PROJECT_ROOT/scripts/00_prepare-base-tags.sh

# This is our CI process for a given app. Needs a bit more tweaking maybe, still represents the important steps in it.
$PROJECT_ROOT/scripts/10_prepare-deps.sh
$PROJECT_ROOT/scripts/20_lint.sh
$PROJECT_ROOT/scripts/20_check-formatting.sh
$PROJECT_ROOT/scripts/20_security-audit.sh
$PROJECT_ROOT/scripts/20_license-audit.sh
$PROJECT_ROOT/scripts/30_test.sh
$PROJECT_ROOT/scripts/90_docker-express.sh
# Alternatively build different type of containers
# $PROJECT_ROOT/scripts/90_docker-next.sh
# $PROJECT_ROOT/scripts/90_docker-static.sh
