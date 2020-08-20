#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export BRANCH=${BRANCH:-}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export PUBLISH=${PUBLISH:-false}
export DOCKER_BUILDKIT=1 
export PROJECT_ROOT=$DIR/..