#!/bin/bash

set -euox pipefail

CACHE_DIR=/mnt/cache

export YARN_ENABLE_HARDENED_MODE=0
export YARN_CACHE_FOLDER=${CACHE_DIR}/.yarn/cache

mkdir -p "$YARN_CACHE_FOLDER"

rsync -ah --delete "${YARN_CACHE_FOLDER}/" .yarn/cache/ || true
yarn install --immutable
rsync -ah --delete .yarn/cache/ "${YARN_CACHE_FOLDER}/"
