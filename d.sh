#!/bin/bash

args=(
  --build-arg="NODE_IMAGE_VERSION=20"
  --build-arg="PLAYWRIGHT_IMAGE_TAG=v1.48.2-focal"
  --build-arg="DOCKER_IMAGE_REGISTRY=821090935708.dkr.ecr.eu-west-1.amazonaws.com/ecr-public"
  # --cache-from="type=registry,ref=821090935708.dkr.ecr.eu-west-1.amazonaws.com/docker-cache:cache"
  # --cache-to="mode=max,image-manifest=true,oci-mediatypes=true,type=registry,ref=821090935708.dkr.ecr.eu-west-1.amazonaws.com/docker-cache:cache"
  --cache-from="type=registry,ref=821090935708.dkr.ecr.eu-west-1.amazonaws.com/docker-cache"
  --cache-to="mode=max,image-manifest=true,oci-mediatypes=true,type=registry,ref=821090935708.dkr.ecr.eu-west-1.amazonaws.com/docker-cache"
  --file="scripts/ci/Dockerfile"
  # --iidfile /home/runner/_work/_temp/docker-actions-toolkit-oOw0A5/build-iidfile-847a6c5154.txt
  # --attest="type=provenance,mode=max,builder-id=https://github.com/island-is/island.is/actions/runs/13177967466/attempts/1"
  --target="deps"
  # --metadata-file /home/runner/_work/_temp/docker-actions-toolkit-oOw0A5/build-metadata-5b35bf3eb1.json
)

set -x
docker buildx build "${args[@]}" .
