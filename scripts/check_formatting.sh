#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

exec yarn run \
  format:check --all

# Docker based run, not used at the moment due to severe speed penalty
# exec docker buildx build --platform=linux/amd64 \
#  --cache-from=type=local,src=$PROJECT_ROOT/cache \
#  -f ${DIR}/Dockerfile \
#  --target=formatting \
#  --build-arg BUILDKIT_INLINE_CACHE=1 \
#  $PROJECT_ROOT