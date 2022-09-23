#!/usr/bin/env bash

set -uo pipefail

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
export PATH=./node_modules/.bin:$PATH
playwright test -c src "$@"
TEST_EXIT_CODE=$?
set -e
zip -r -0 test-results playwright-report
aws s3 cp test-results.zip $TEST_RESULTS_S3
exit $TEST_EXIT_CODE
