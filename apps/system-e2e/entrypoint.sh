#!/usr/bin/env bash

set -euo pipefail

: "${TEST_RESULTS_S3:=}"
: "${TEST_ENVIRONMENT:=local}"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
export PATH=./node_modules/.bin:$PATH

playwright test -c src "$@" || TEST_EXIT_CODE=$?
TEST_EXIT_CODE=$?

if [ "$TEST_EXIT_CODE" != "0" ] ; then
  echo "Notifying due to test failure"
  node "$DIR/src/notifications/notify.js"
  echo "Notified :)"
fi

ls -lah . /dist
zip -r test-results.zip playwright-report src/test-results
if [ -n "$TEST_RESULTS_S3" ]; then
  aws s3 cp test-results.zip "$TEST_RESULTS_S3"
fi
echo ""
echo "To access the detailed report (with any failure traces), download it from the command line like this: \"aws s3 cp $TEST_RESULTS_S3 .\". Unzip the file and open the file 'index.html' in the playwright-report folder."
echo ""
echo "Additionally a web-based overview (experimental) can be found at https://www.tesults.com/digital-iceland/monorepo"

exit $TEST_EXIT_CODE
