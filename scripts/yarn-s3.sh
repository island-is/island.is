#!/bin/bash

set -euox pipefail

YARN_LOCK_SHA=$1
CACHE_DIR=/mnt/cache

export YARN_ENABLE_HARDENED_MODE=0
export YARN_CACHE_FOLDER=${CACHE_DIR}/.yarn/cache
export NODE_PATH=${CACHE_DIR}/${YARN_LOCK_SHA}/node_modules/

mkdir -p "$YARN_CACHE_FOLDER"
mkdir -p "$NODE_PATH"

echo "NODE_PATH=$NODE_PATH" >>"$GITHUB_ENV"
yarn install --immutable
