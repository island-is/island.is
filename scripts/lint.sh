#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

exec yarn run \
  lint ${APP}

# Docker based run, not used at the moment due to severe speed penalty
# exec docker buildx build \
#   --platform=linux/amd64 \
#   --cache-from=type=local,src=$PROJECT_ROOT/cache \
#   -f ${DIR}/Dockerfile \
#   --target=linter \
#   --build-arg BUILDKIT_INLINE_CACHE=1 \
#   --build-arg APP=${APP} \
#   $PROJECT_ROOT