#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export BRANCH=${BRANCH:-`git branch --show-current`}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export PUBLISH=true
export DOCKER_BUILDKIT=1
export PROJECT_ROOT=$(readlink -m $DIR/../..)
export CHUNK_SIZE=${CHUNK_SIZE:-2}
