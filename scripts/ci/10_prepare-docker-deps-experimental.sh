#!/bin/bash

set -euxo pipefail

AWS_REGION="eu-west-1"
AWS_S3_BUCKET="docker-cache-experimental"
PROJECT_ROOT=$(git rev-parse --show-toplevel)

# shellcheck disable=SC1091
source "${PROJECT_ROOT}"/scripts/ci/_common.sh

DOCKERFILE="${PROJECT_ROOT}/scripts/ci/Dockerfile"

docker buildx create --driver docker-container --use || true

docker buildx build \
  --platform=linux/amd64 \
  -f "$DOCKERFILE" \
  --target deps \
  --cache-from type=s3,region=$AWS_REGION,bucket=$AWS_S3_BUCKET,name=${AWS_S3_BUCKET}-deps \
  --cache-to type=s3,region=$AWS_REGION,bucket=$AWS_S3_BUCKET,name=${AWS_S3_BUCKET}-deps,mode=max \
  "$PROJECT_ROOT"

docker buildx build \
  --platform=linux/amd64 \
  -f "$DOCKERFILE" \
  --target output-base \
  --cache-from type=s3,region=$AWS_REGION,bucket=$AWS_S3_BUCKET,name=${AWS_S3_BUCKET}-output-base \
  --cache-to type=s3,region=$AWS_REGION,bucket=$AWS_S3_BUCKET,name=${AWS_S3_BUCKET}-output-base,mode=max \
  "$PROJECT_ROOT"
