#!/bin/bash

YARN_LOCK_SHA=$1
BASE_DIR=/home/runner

export YARN_ENABLE_HARDENED_MODE=0
export YARN_CACHE_FOLDER=${BASE_DIR}/.yarn/cache
export NODE_PATH=${BASE_DIR}/${YARN_LOCK_SHA}/node_modules/
echo "NODE_PATH=$NODE_PATH" >>"$GITHUB_ENV"
yarn install --immutable
