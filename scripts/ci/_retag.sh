#!/bin/bash

set -euo pipefail

# This is a script to re-tag a Docker image without pulling the pushing the image but rather directly in the registry.

MANIFEST=$(aws ecr batch-get-image --repository-name "$IMAGE" --image-ids imageTag="$LAST_GOOD_BUILD_DOCKER_TAG" --query 'images[].imageManifest' --output text)
aws ecr put-image --repository-name "$IMAGE" --image-tag "$DOCKER_TAG" --image-manifest "$MANIFEST"
