#!/bin/bash

set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT="$DIR/../.."
: "${HEAD_REF:="$GITHUB_HEAD_REF"}"
: "${BASE_REF:="$GITHUB_BASE_REF"}"
: "${PR_REF:="$GITHUB_SHA"}"
: "${SHELL:=/usr/bin/bash}"
: "${WORKFLOW_ID:=pullrequest}"
export HEAD_REF BASE_REF PR_REF SHELL WORKFLOW_ID

tempRepo=$(mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
cp -r "$ROOT/.github/actions/dist/." "$tempRepo"

LAST_GOOD_BUILD=$(DEBUG="*,-simple-git" REPO_ROOT="$ROOT" node "$tempRepo/main.js")
echo >&2 "Stickman done"
LAST_GOOD_BUILD_SHA=$(echo "$LAST_GOOD_BUILD" | jq -r '.sha')
LAST_GOOD_BUILD_BRANCH=$(echo "$LAST_GOOD_BUILD" | jq -r '.branch')
LAST_GOOD_BUILD_RUN_NUMBER=$(echo "$LAST_GOOD_BUILD" | jq -r '.run_number')
BUILD_REF=$(echo "$LAST_GOOD_BUILD" | jq -r '.ref')
echo >&2 "Last successful build is with SHA '$LAST_GOOD_BUILD_SHA', branch '$LAST_GOOD_BUILD_BRANCH' and number '$LAST_GOOD_BUILD_RUN_NUMBER'"
if [[ "$BUILD_REF" != "$LAST_GOOD_BUILD_SHA" ]]; then
  echo >&2 "This will be an incremental build from a previous successful run in this PR. See parents of the commit below."
  git log -1 "$BUILD_REF"
fi
LAST_GOOD_BUILD_DOCKER_BRANCH_TAG=$(echo "${LAST_GOOD_BUILD_BRANCH}" | tr "/." "-")
export LAST_GOOD_BUILD_DOCKER_TAG=${LAST_GOOD_BUILD_DOCKER_BRANCH_TAG:0:45}_${LAST_GOOD_BUILD_SHA:0:7}_${LAST_GOOD_BUILD_RUN_NUMBER}
if [[ "$BUILD_REF" == "null" || "$BUILD_REF" == "" ]]; then
  curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"Change detection failed for $HTML_URL\"}" "$ISSUE_REPORTING_SLACK_WEBHOOK_URL"
  exit 1
else
  BASE="$BUILD_REF"
fi

export HEAD BASE
echo >&2 "Last successful docker tag '$LAST_GOOD_BUILD_DOCKER_TAG'"
echo "HEAD=$GITHUB_SHA" >>"$GITHUB_ENV"
echo "BASE=$BASE" >>"$GITHUB_ENV"
