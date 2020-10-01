#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

MERGE_BASE=$(git merge-base origin/master HEAD)
LAST_GOOD_BUILD=`git log --format=%H $MERGE_BASE~20..HEAD | node .github/actions/dist/index.js`
LAST_GOOD_BUILD_SHA=`echo $LAST_GOOD_BUILD | jq -r '.sha'`
LAST_GOOD_BUILD_BRANCH=`echo $LAST_GOOD_BUILD | jq -r '.branch'`
LAST_GOOD_BUILD_RUN_NUMBER=`echo $LAST_GOOD_BUILD | jq -r '.run_number'`
echo "Last successful build is with SHA '$LAST_GOOD_BUILD_SHA', branch '$LAST_GOOD_BUILD_BRANCH' and number '$LAST_GOOD_BUILD_RUN_NUMBER'"
LAST_GOOD_BUILD_DOCKER_BRANCH_TAG=$(echo ${LAST_GOOD_BUILD_BRANCH} | tr "/." "-" )
export LAST_GOOD_BUILD_DOCKER_TAG=${LAST_GOOD_BUILD_RUN_NUMBER}_${LAST_GOOD_BUILD_DOCKER_BRANCH_TAG}_${LAST_GOOD_BUILD_SHA:0:7}
export BASE="$LAST_GOOD_BUILD_SHA"
echo "Last successful docker tag '$LAST_GOOD_BUILD_DOCKER_TAG'"

