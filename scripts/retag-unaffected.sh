#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# This script re-tags all unaffected Docker images with the newest tag.
export TOKEN=$(aws ecr get-authorization-token --region eu-west-1 --output text --query 'authorizationData[].authorizationToken')
echo $1 | tr ' ' '\n' | xargs -I {} bash -c "IMAGE={} $DIR/_retag.sh || exit 255" # exit code 255 makes xargs fail fast