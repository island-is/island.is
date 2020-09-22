#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/_common.sh

if [ ! -f libs/api/schema/src/lib/schema.d.ts ]; then
  echo "Creating libs/api/schema/src/lib/schema.d.ts file..."
  echo 'export default () => {}' >> libs/api/schema/src/lib/schema.d.ts
fi

APP=nx-runner
MAX_JOBS=${MAX_JOBS:-5}

echo "Building nx runner image..."

# Build NX runner image if does not exist
docker image inspect ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} -f ' ' || \
  docker buildx build \
  --platform=linux/amd64 \
  --cache-from=type=local,src=$PROJECT_ROOT/cache \
  -f ${DIR}/Dockerfile \
  --target=nx-runner --load \
  -t ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
  $PROJECT_ROOT

echo "Running affected:schemas..."
exec docker run \
  --rm \
  ${DOCKER_REGISTRY}${APP}:${DOCKER_TAG} \
  nx affected --target=init-schema --parallel --maxParallel=$MAX_JOBS
