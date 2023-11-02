#!/bin/bash

echo "Image to check: $IMAGE"

set -euo pipefail

# This is a script to re-tag a Docker image without pulling or pushing the image but rather add the new
# docker tag to it directly in the registry.
MANIFEST=$(aws ecr batch-get-image --repository-name "$IMAGE" --image-ids imageTag="$LAST_GOOD_BUILD_DOCKER_TAG" --query 'images[].imageManifest' --output text)

if [[ -z $MANIFEST ]]; then
  echo "Image not found: $IMAGE"
  exit 255
fi

#now checking if tag already exits by picking up the version number from the response
EXISTING_TAG=$(aws ecr batch-get-image --repository-name "$IMAGE" --image-ids imageTag="$DOCKER_TAG" --query 'images[].imageManifest' --output text | jq -r '.schemaVersion')

if [[ "$EXISTING_TAG" != "2" ]]; then
  echo "Tag $DOCKER_TAG not found on $IMAGE, retagging now..."
  aws ecr put-image --repository-name "$IMAGE" --image-tag "$DOCKER_TAG" --image-manifest "$MANIFEST"
else
  echo "Tag $DOCKER_TAG already existed for image $IMAGE. Hopefully this is a re-run in which case it should be ok."
fi
