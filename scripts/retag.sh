#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

TOKEN=$(aws ecr get-authorization-token --region eu-west-1 --output text --query 'authorizationData[].authorizationToken')

REGISTRY="553296336529.dkr.ecr.eu-west-1.amazonaws.com"
EXISTING="569_master_41f30b7"
NEW="586_master_223226d"
IMAGE="web"
curl -H "Authorization: Basic $TOKEN" "https://$REGISTRY/v2/$IMAGE/manifests/$EXISTING" \
-H 'accept: application/vnd.docker.distribution.manifest.v2+json' \
| \
curl -XPUT -H "Authorization: Basic $TOKEN" "https://$REGISTRY/v2/$IMAGE/manifests/$NEW" \
-H 'content-type: application/vnd.docker.distribution.manifest.v2+json' \
-d @-
