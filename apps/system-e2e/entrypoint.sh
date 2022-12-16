#!/usr/bin/env bash

set -uo pipefail

: ${TEST_ENVIRONMENT:=local}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export PATH=./node_modules/.bin:$PATH

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
echo "DIR: $DIR"
echo "PATH: $PATH"

echo "Various tool locations:"
which yarn node npm npx nx playwright
find / -name playwright 2>/dev/null || echo "No playwright found"

yarn playwright test -c src "$@"
TEST_EXIT_CODE=$?

set -e
zip -r -0 test-results playwright-report src/test-results
aws s3 cp test-results.zip $TEST_RESULTS_S3
if [ "$TEST_EXIT_CODE" != "0" ] ; then
  node $DIR/src/notifications/notify.js
fi
echo ""
echo "To access the detailed report (with any failure traces), download it from the command line like this: \"aws s3 cp $TEST_RESULTS_S3 .\". Unzip the file and open the file 'index.html' in the playwright-report folder."
echo ""
echo "Additionally a web-based overview (experimental) can be found at https://www.tesults.com/digital-iceland/monorepo"

exit $TEST_EXIT_CODE
