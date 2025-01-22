#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT="$DIR/../.."

# Copy the built action to a temp directory
tempRepo=$(mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
cp -r "$ROOT/.github/actions/dist/." "$tempRepo"

# Get last good build via GitHub API, forcing full rebuild if it fails
if ! LAST_GOOD_BUILD=$(DEBUG="*,-simple-git" REPO_ROOT="$ROOT" node "$tempRepo/main.js"); then
  >&2 echo "Stickman failed 😢, continuing with full rebuild"
  LAST_GOOD_BUILD="full_rebuild_needed"
fi
>&2 echo "Stickman done"

# Check if the script failed or if a full rebuild is needed
if echo "$LAST_GOOD_BUILD" | grep -q 'full_rebuild_needed'; then
  >&2 echo "No last good build found"
  export NX_AFFECTED_ALL=true
  echo "NX_AFFECTED_ALL=$NX_AFFECTED_ALL" >>"$GITHUB_ENV"
  exit 0
fi

# Extract details from the last good build
LAST_GOOD_BUILD_SHA=$(echo "$LAST_GOOD_BUILD" | jq -r '.sha')
LAST_GOOD_BUILD_BRANCH=$(echo "$LAST_GOOD_BUILD" | jq -r '.branch')
LAST_GOOD_BUILD_RUN_NUMBER=$(echo "$LAST_GOOD_BUILD" | jq -r '.run_number')
BUILD_REF=$(echo "$LAST_GOOD_BUILD" | jq -r '.ref')
>&2 echo "Last successful build is with SHA '$LAST_GOOD_BUILD_SHA', branch '$LAST_GOOD_BUILD_BRANCH' and number '$LAST_GOOD_BUILD_RUN_NUMBER'"

# Log commits between the last good build and the current build
if [[ "$BUILD_REF" != "$LAST_GOOD_BUILD_SHA" ]]; then
  echo "This will be an incremental build from a previous successful run in this PR. See parents of the commit below."
  git log -1 "$BUILD_REF"
fi

# Generate a Docker tag based on the last good build details
LAST_GOOD_BUILD_DOCKER_BRANCH_TAG=$(echo "${LAST_GOOD_BUILD_BRANCH}" | tr "/." "-")
export LAST_GOOD_BUILD_DOCKER_TAG=${LAST_GOOD_BUILD_DOCKER_BRANCH_TAG:0:45}_${LAST_GOOD_BUILD_SHA:0:10}_${LAST_GOOD_BUILD_RUN_NUMBER}

# If the build reference is invalid, report an error to Slack
if [[ "$BUILD_REF" == "null" || "$BUILD_REF" == "" ]]; then
  curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"Change detection failed for $HTML_URL\"}" "$ISSUE_REPORTING_SLACK_WEBHOOK_URL"
  exit 1
fi
export BASE="$BUILD_REF"

# Log the Docker tag of the last successful build
>&2 echo "Last successful docker tag '$LAST_GOOD_BUILD_DOCKER_TAG'"
