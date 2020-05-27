#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export BRANCH=${BRANCH:-}
export LATEST_MASTER_TAG=latest_master
export LATEST_BRANCH_TAG=latest_${BRANCH}
export DEPS_TAG=${LATEST_BRANCH_TAG}_deps
export SRC_TAG=${LATEST_BRANCH_TAG}_src
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
export PUBLISH=${PUBLISH:-false}
export DOCKER_BUILDKIT=1 
export PROJECT_ROOT=$DIR/..