#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

# Check if CHUNKS_DEBUG is set and non-empty
# Used to debug services, e.g. '["services-user-notification", "auth-api"]'
if [[ -n "${CHUNKS_DEBUG:-}" ]]; then
  echo "$CHUNKS_DEBUG"
  exit 0
fi

BRANCH=${BRANCH:-$GITHUB_HEAD_REF}
SKIP_TESTS_ON_BRANCH=${SKIP_TESTS_ON_BRANCH:-}
if [[ "$SKIP_TESTS_ON_BRANCH" == "7913-$BRANCH" ]] || [[ "${SKIP_TESTS:-}" == true ]]; then
  #Skipping tests
  echo "[]"
elif [[ "${CI_DEBUG:-}" == true ]]; then
  echo '["web","air-discount-scheme-api,air-discount-scheme-backend,air-discount-scheme-web","license-api","system-e2e","island-ui-storybook"]'
else
  PROJECTS=$("$PROJECT_ROOT"/scripts/ci/_nx-affected-targets.sh "$1")
  >&2 echo "Projects: ${PROJECTS}"
  CHUNKS=$(node "$PROJECT_ROOT"/scripts/ci/_chunk.js "${PROJECTS}")
  >&2 echo "Chunks: $CHUNKS"
  echo "$CHUNKS"
fi
