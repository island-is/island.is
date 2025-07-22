#!/usr/bin/env bash

set -euo pipefail

: "${TEST_ENVIRONMENT:=local}"
: "${TEST_TYPE:=smoke}"
: "${TEST_PROJECT:=everything}"
: "${TEST_RESULTS_S3:=}"
: "${TEST_FILTER:=$*}"
: "${DD_ENV:=ci}"
: "${DD_SERVICE:=system-e2e}"
NODE_OPTIONS="${NODE_OPTIONS:-} -r dd-trace/ci/init"

if [[ "$*" =~ --project ]]; then
  TEST_PROJECT="$(echo "$*" | grep -oP -- '--project[= ](\S+)')"
  TEST_PROJECT="${TEST_PROJECT##--project?}"
fi

export TEST_PROJECT TEST_ENVIRONMENT TEST_TYPE TEST_RESULTS_S3 TEST_FILTER DD_ENV DD_SERVICE NODE_OPTIONS

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
echo "Playwright project: $TEST_PROJECT"
echo "Playwright version: $(yarn playwright --version)"
echo "Node version: $(node --version)"
echo "Node options: $NODE_OPTIONS"

TEST_EXIT_CODE=0
yarn playwright test -c src --project="$TEST_PROJECT" "$@" || TEST_EXIT_CODE=$?

# Upload results
if [[ -n "$TEST_RESULTS_S3" ]]; then
  zip -r -0 test-results playwright-report src/test-results
  aws s3 cp test-results.zip "$TEST_RESULTS_S3"
fi
if [ "$TEST_EXIT_CODE" != "0" ]; then
  yarn node "$DIR/src/notifications/notify.js"
fi

cat <<EOF
To access the detailed report (with any failure traces), download it from the command
line like this, extract and open 'index.html':

  aws s3 cp ${TEST_RESULTS_S3:-'<s3-bucket-name>'} ./tesults-results.zip
  unzip ./tesults-results.zip
  firefox ./tesults-results/index.html

Additionally a web-based overview can be found at
  https://www.tesults.com/digital-iceland/monorepo
EOF

exit $TEST_EXIT_CODE
