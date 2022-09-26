#!/usr/bin/env bash

set -uxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
export PATH=./node_modules/.bin:$PATH
playwright test -c src "$@"
TEST_EXIT_CODE=$?
set -e
zip -r -0 test-results playwright-report src/test-results
aws s3 cp test-results.zip $TEST_RESULTS_S3
if [ "$TEST_EXIT_CODE" != "0" ] ; then
  node $DIR/src/notifications/notify.js
fi
echo
echo To access the report, you can download it from the command line like this: \"aws s3 cp $TEST_RESULTS_S3 .\". Unzip the file and open the file 'index.html' in the playwright-report folder.
echo
echo Additionally a web-based overview \(experimental\) can be found at https://www.tesults.com/results/rsp/view/status/project/ebbe1240-4ed6-420c-b4e0-ee0d808ebfad.

exit $TEST_EXIT_CODE
