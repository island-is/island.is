#!/bin/bash
set -euo pipefail
PROJECT_DIR=$(git rev-parse --show-toplevel)
CYPRESS_BIN="$PROJECT_DIR/node_modules/.bin/cypress"
ENV_FILE="$PROJECT_DIR/.env.secret"

# shellcheck disable=SC1091,SC1090
source "$ENV_FILE"

function run() {
  local integration test_type target
  integration="${1:-}"
  test_type="${2:-}"
  target="${3:-}"

  [ -z "$*" ] && "${CYPRESS_BIN}" open -P dist/apps/system-e2e
  "${CYPRESS_BIN}" run -P dist/apps/system-e2e --spec dist/apps/system-e2e/integration/"${integration}/${test_type}/${target}".spec.ts --headed --no-exit
}

usage() {
  echo "Usage: $(basename "$0") <menu|service-name>" 2>&1
  echo "menu          opens cypress spec menu" 2>&1
  echo "test          service-portal smoketest homepage" 2>&1


  exit 1
}

if [[ ${#} -eq 0 ]]; then
  usage
fi

option=$1

case $option in
  menu) run ;;
  test) run "${@:2}" ;;
  *)
    echo "Invalid argument: ${option}."
    usage
    ;;
esac