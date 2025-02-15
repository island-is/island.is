#!/bin/bash
set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "usage: $0 <image>"
  echo ""
  echo "  Retag an upstream image from docker.io to our ECR registry."
  echo "  Set UPSTREAM_REGISTRY and PUSH_REGISTRY environment variables if you want to use different registries."
  echo ""
  echo "example:"
  echo "  export UPSTREAM_REGISTRY=docker.io PUSH_REGISTRY=quay.io"
  echo "  $0 docker/whalesay"
  exit 1
fi

: "${IMAGE:=${1}}"
: "${UPSTREAM_REGISTRY:=docker.io}"
: "${PUSH_REGISTRY:=$(aws configure get sso_account_id).dkr.ecr.eu-west-1.amazonaws.com}"

set -x
docker pull "${UPSTREAM_REGISTRY}/${IMAGE}"
docker tag "${UPSTREAM_REGISTRY}/${IMAGE}" "${PUSH_REGISTRY}/${IMAGE}"
docker push "${PUSH_REGISTRY}/${IMAGE}"
set +x

echo "DONE"
