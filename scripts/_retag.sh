#!/bin/bash

set -euxo pipefail

# This is a script to re-tag a Docker image without pulling the pushing the image but rather directly in the registry.

# Make sure our docker registry string ens with "/" so it works with the registry string that we use in other places
if [[ "$DOCKER_REGISTRY" != */ ]]; then
    DOCKER_REGISTRY="${DOCKER_REGISTRY}/" 
fi

TOKEN=$(aws ecr get-authorization-token --region eu-west-1 --output text --query 'authorizationData[].authorizationToken')

curl -H "Authorization: Basic $TOKEN" "https://${DOCKER_REGISTRY}v2/$IMAGE/manifests/$LAST_GOOD_BUILD_DOCKER_TAG" \
-H 'accept: application/vnd.docker.distribution.manifest.v2+json' \
| \
curl -XPUT -H "Authorization: Basic $TOKEN" "https://${DOCKER_REGISTRY}v2/$IMAGE/manifests/$DOCKER_TAG" \
-H 'content-type: application/vnd.docker.distribution.manifest.v2+json' \
-d @-
