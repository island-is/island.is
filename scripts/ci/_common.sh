#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

BRANCH=${BRANCH:-$(git branch --show-current)}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export PUBLISH=${PUBLISH:-false}
export DOCKER_BUILDKIT=1
export CHUNK_SIZE=${CHUNK_SIZE:-2}

PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
export PROJECT_ROOT BRANCH