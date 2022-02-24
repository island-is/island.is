#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/../.."

tempRepo=$(mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
cp -r "$ROOT"/. "$tempRepo"

LAST_GOOD_BUILD=$(DEBUG="*" REPO_ROOT="$tempRepo" node $DIR/../../.github/actions/dist-v2/index.js)
rm -rf $tempRepo
LAST_GOOD_BUILD_SHA=$(echo "$LAST_GOOD_BUILD" | jq -r '.sha')
LAST_GOOD_BUILD_BRANCH=$(echo "$LAST_GOOD_BUILD" | jq -r '.branch')
LAST_GOOD_BUILD_RUN_NUMBER=$(echo "$LAST_GOOD_BUILD" | jq -r '.run_number')
>&2 echo "Last successful build is with SHA '$LAST_GOOD_BUILD_SHA', branch '$LAST_GOOD_BUILD_BRANCH' and number '$LAST_GOOD_BUILD_RUN_NUMBER'"
LAST_GOOD_BUILD_DOCKER_BRANCH_TAG=$(echo "${LAST_GOOD_BUILD_BRANCH}" | tr "/." "-" )
export LAST_GOOD_BUILD_DOCKER_TAG=${LAST_GOOD_BUILD_RUN_NUMBER}_${LAST_GOOD_BUILD_DOCKER_BRANCH_TAG}_${LAST_GOOD_BUILD_SHA:0:7}
if [[ "$LAST_GOOD_BUILD_SHA" == "null" ]]; then
    BASE=$(git rev-list --max-parents=0 HEAD)
else
    BASE="$LAST_GOOD_BUILD_SHA"
fi
export BASE
>&2 echo "Last successful docker tag '$LAST_GOOD_BUILD_DOCKER_TAG'"

