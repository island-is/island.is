#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

SERVICE=$1

declare -A tokens

tokens[islandis]=$SPINNAKER_WEBHOOK_ISLANDIS_TOKEN
tokens[gjafakort]=$SPINNAKER_WEBHOOK_GJAFAKORT_TOKEN
tokens[air-discount-scheme]=$SPINNAKER_WEBHOOK_AIR_DISCOUNT_SCHEME_TOKEN

HELM_SHA1=$(echo $HELM_VERSION | cut -d"_" -f3)

curl -v $https://spinnaker-gate.shared.devland.is/webhooks/webhook/${{matrix.service}} -X POST -H "content-type: application/json" --data-binary @- <<BODY
{
"token": "${tokens[SERVICE]}",
"branch": "$GIT_BRANCH",
"parameters": { "docker_tag": "$DOCKER_TAG" },
"artifacts": [
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.dev.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.dev.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.staging.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.staging.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "type": "github/file",
    "name": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.prod.yaml",
    "reference": "https://api.github.com/repos/island-is/helm/contents/charts/${{matrix.service}}/values.prod.yaml",
    "version": "$HELM_SHA1"
  },
  {
    "name": "islandis",
    "type": "helm/chart",
    "version": "$HELM_VERSION"
  }
]
}
BODY