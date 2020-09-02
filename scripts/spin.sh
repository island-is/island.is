#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

SERVICE=$1

declare -A tokens

tokens[islandis]=$SPINNAKER_WEBHOOK_ISLANDIS_TOKEN
tokens[gjafakort]=$SPINNAKER_WEBHOOK_GJAFAKORT_TOKEN
tokens[air-discount-scheme]=$SPINNAKER_WEBHOOK_AIR_DISCOUNT_SCHEME_TOKEN

TOKEN=${tokens[$SERVICE]}

HELM_VERSION=$(cat $DIR/../HELM_VERSION | tr -d '\n')

HELM_SHA1=$(echo $HELM_VERSION | cut -d"_" -f3)

curl -v https://spinnaker-gate.shared.devland.is/webhooks/webhook/$SERVICE -H "content-type: application/json" --data-binary @- <<BODY
{
"token": "$TOKEN",
"branch": "$GIT_BRANCH",
"parameters": { "docker_tag": "$DOCKER_TAG" },
"artifacts": [
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.dev.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.dev.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.staging.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.staging.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.prod.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/$SERVICE/values.prod.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "name": "$SERVICE",
    "type": "helm/chart",
    "version": "$HELM_VERSION"
  }
]
}
BODY
