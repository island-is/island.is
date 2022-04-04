#!/bin/bash

set -euo pipefail

# This is a script to re-tag a Docker image without pulling the pushing the image but rather directly in the registry.

MANIFEST=$(aws ecr batch-get-image --repository-name "$IMAGE" --image-ids imageTag="$LAST_GOOD_BUILD_DOCKER_TAG" --query 'images[].imageManifest' --output text)
#now checking if tag already exits by picking up the version number from the response
EXISTING_TAG=$(aws ecr batch-get-image --repository-name "$IMAGE" --image-ids imageTag="$DOCKER_TAG" --query 'images[].imageManifest' --output text | jq -r '.schemaVersion')
if [[ "$EXISTING_TAG" != "2" ]]; then
  aws ecr put-image --repository-name "$IMAGE" --image-tag "$DOCKER_TAG" --image-manifest "$MANIFEST"
else
  echo "Tag $DOCKER_TAG already existed for image $IMAGE. Hopefully this is a re-run in which case it should be ok."
fi
