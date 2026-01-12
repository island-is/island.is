#!/bin/bash

set -euox pipefail

BUILDKIT_DRIVER_NAME=${BUILDKIT_DRIVER_NAME:-actions-builder}

docker buildx rm "$BUILDKIT_DRIVER_NAME" || true
docker buildx create --name "$BUILDKIT_DRIVER_NAME" --driver docker-container --use --driver-opt image="${DOCKER_REGISTRY}/moby/buildkit:buildx-stable-1"
