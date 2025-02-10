#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

BRANCH=${BRANCH:-$(git branch --show-current)}
export MAX_JOBS=${MAX_JOBS:-2}
export NX_PARALLEL=${NX_PARALLEL:-6}
export NX_MAX_PARALLEL=${NX_MAX_PARALLEL:-10}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export PUBLISH=${PUBLISH:-false}
export DOCKER_BUILDKIT=1
export CHUNK_SIZE=${CHUNK_SIZE:-2}
export NODE_OPTIONS="--max-old-space-size=8192"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
export PROJECT_ROOT BRANCH
