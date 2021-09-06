#!/bin/bash
set -euxo pipefail

MERGE_BASE=$(git merge-base origin/main HEAD)
LAST_GOOD_BUILD=$(git log --format=%H "$MERGE_BASE"~20..HEAD | node .github/actions/dist/index.js)
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

