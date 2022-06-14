#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CYPRESS_BIN=$(realpath "${DIR}/../node_modules/.bin/cypress")
ENV_FILE="$(realpath "$DIR"/../.env.secret)"

# shellcheck disable=SC1091,SC1090
source "$ENV_FILE"

function run() {
  local service
  service="${1:-}"
  [ -z "$*" ] && "${CYPRESS_BIN}" open -P apps/system-e2e/
  "${CYPRESS_BIN}" run -P apps/system-e2e --spec apps/system-e2e/src/integration/"${service}".spec.ts --headed --no-exit
}

usage() {
  echo "Usage: $(basename "$0") <menu|service-name>" 2>&1
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