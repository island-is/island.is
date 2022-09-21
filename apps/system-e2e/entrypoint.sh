#!/usr/bin/env bash

set -euo pipefail

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
export PATH=./node_modules/.bin:$PATH
playwright test -c src "$@"
