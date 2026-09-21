#!/bin/bash

set -euox pipefail

BUILDKIT_DRIVER_NAME=${BUILDKIT_DRIVER_NAME:-actions-builder}

# BUILDKIT_DRIVER_REUSE: keep the builder, and with it the layers of earlier builds on this machine
if [[ "${BUILDKIT_DRIVER_REUSE:-}" == "true" ]] && docker buildx inspect "$BUILDKIT_DRIVER_NAME" >/dev/null 2>&1; then
  docker buildx use "$BUILDKIT_DRIVER_NAME"
else
  docker buildx rm "$BUILDKIT_DRIVER_NAME" || true
  docker buildx create --name "$BUILDKIT_DRIVER_NAME" --driver docker-container --use --driver-opt image="${DOCKER_REGISTRY}/moby/buildkit:buildx-stable-1"
fi
