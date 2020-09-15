#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export BRANCH=${BRANCH:-}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export CACHE_REGISTRY_REPO=${CACHE_REGISTRY_REPO:-}
export PUBLISH=${PUBLISH:-false}
export CACHE_PUBLISH=${CACHE_PUBLISH:-false}
export DOCKER_BUILDKIT=1 
export PROJECT_ROOT=$DIR/..