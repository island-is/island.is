#!/bin/bash

set -euo pipefail

# This is a script to re-tag a Docker image without pulling the pushing the image but rather directly in the registry.

# Make sure our docker registry string ens with "/" so it works with the registry string that we use in other places
if [[ "$DOCKER_REGISTRY" != */ ]]; then
    DOCKER_REGISTRY="${DOCKER_REGISTRY}/"
fi

manifest=$(curl -s \
    -H "Authorization: Basic $TOKEN" \
    -H 'accept: application/vnd.docker.distribution.manifest.v2+json' \
    "https://${DOCKER_REGISTRY}v2/$IMAGE/manifests/$LAST_GOOD_BUILD_DOCKER_TAG" \
)

status_code=$(curl -s -XPUT \
    -H "Authorization: Basic $TOKEN" \
    -H 'content-type: application/vnd.docker.distribution.manifest.v2+json' \
    "https://${DOCKER_REGISTRY}v2/$IMAGE/manifests/$DOCKER_TAG" \
    -d @<(echo $manifest) \
    -o /dev/stderr \
    -w "%{http_code}" \
)

if [ $status_code -gt 399  ]; then
    echo "Status code when retagging $IMAGE was $status_code, exiting"
    exit 1
fi
