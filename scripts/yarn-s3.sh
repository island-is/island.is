#!/bin/bash

set -euox pipefail

CACHE_MOUNT=/mnt/cache

export YARN_ENABLE_HARDENED_MODE=0
export S3_YARN_CACHE="${CACHE_MOUNT}/.yarn/cache"

mkdir -p .yarn/cache
if [ -f "${CACHE_MOUNT}/.yarn/install-state.gz" ]; then
  cp "${CACHE_MOUNT}/.yarn/install-state.gz" .yarn/
fi

rsync -ah --delete "${S3_YARN_CACHE}/" .yarn/cache/ || true

yarn install --immutable

mkdir -p "${CACHE_MOUNT}/.yarn/cache"
cp .yarn/install-state.gz "${CACHE_MOUNT}/.yarn/" || true
rsync -ah --delete .yarn/cache/ "${S3_YARN_CACHE}/"
