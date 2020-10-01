#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

export DOCKER_TAG=local
export PUBLISH=local
source $PROJECT_ROOT/scripts/prepare-base-tags.sh
$PROJECT_ROOT/scripts/prepare_deps.sh
# APP=api $PROJECT_ROOT/scripts/lint.sh
APP=api $PROJECT_ROOT/scripts/test.sh
APP=api $PROJECT_ROOT/scripts/docker-express.sh
