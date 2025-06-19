#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh
export HEAD=${HEAD:-HEAD}
export BASE=${BASE:-main}
SKIP_JUDICIAL=${SKIP_JUDICIAL:-false}
NX_AFFECTED_ALL=${NX_AFFECTED_ALL:-}
TEST_EVERYTHING=${TEST_EVERYTHING:-}
# This is a helper script to find NX affected projects for a specific target

AFFECTED_ALL=${AFFECTED_ALL:-} # Could be used for forcing all projects to be affected (set or create `secret` in GitHub with the name of this variable set to the name of the branch that should be affected, prefixed with the magic string `7913-`)
BRANCH=${BRANCH:-$GITHUB_HEAD_REF}

LAST_COMMIT_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD)
if echo "$LAST_COMMIT_FILES" | grep -q ".github/actions/force-build.mjs"; then
  export TEST_EVERYTHING=true
fi

if [[ (-n "$BRANCH" && -n "$AFFECTED_ALL" && "$AFFECTED_ALL" == "7913-$BRANCH") || (-n "$NX_AFFECTED_ALL" && "$NX_AFFECTED_ALL" == "true") || (-n "$TEST_EVERYTHING" && "$TEST_EVERYTHING" == "true") ]]; then
  EXTRA_ARGS=""
else
  EXTRA_ARGS=(--affected --base "$BASE" --head "$HEAD")
fi

if [[ "$SKIP_JUDICIAL" == "true" ]]; then
  npx nx show projects --withTarget="$1" "${EXTRA_ARGS[@]}" --json | jq -r '[ .[] | select(startswith("judicial-") | not) ] | join(", ")'
else
  npx nx show projects --withTarget="$1" "${EXTRA_ARGS[@]}" --json | jq -r 'join(", ")'
fi

