#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CYPRESS_BIN=$(realpath "${DIR}/../node_modules/.bin/cypress")

"${CYPRESS_BIN}" open -P apps/system-e2e/
