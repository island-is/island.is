#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

COVERAGE_DIR=$(yarn nx show project $APP | jq '.targets.test.outputs[0] | sub("{workspaceRoot}/";"")' -r)
COVERAGE_FILE="$PROJECT_ROOT/$COVERAGE_DIR/coverage-final.json"

echo "Uploading coverage report $COVERAGE_FILE"

if [[ ! -f "$COVERAGE_FILE" ]]; then
  echo "Coverage report was not found"
  exit 0
fi

COVERAGE_CONTENT=$(jq "." -cr < $COVERAGE_FILE)
if [[ "$COVERAGE_CONTENT" == "{}" ]]; then
  echo "Coverage report is empty"
  exit 0
fi

NODE_OPTIONS="" codecov --token "$CODECOV_TOKEN" --flags "$APP" --file "$COVERAGE_FILE" --clean
