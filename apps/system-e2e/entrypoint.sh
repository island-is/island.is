#!/usr/bin/env bash

set -euo pipefail

: "${TEST_ENVIRONMENT:=local}"
: "${TEST_PROJECT:=everything}"
: "${TEST_RESULTS_S3:=}"
: "${TEST_TYPE:=smoke}"

: "${DD_API_KEY:=}"
: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_CIVISIBILITY_MANUAL_API_ENABLED:=1}"
: "${DD_ENV:=local}"
: "${DD_GIT_REPOSITORY_URL:="https://github.com/island-is/island.is"}"
: "${DD_SERVICE:=system-tests}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_TRACE_DEBUG:=true}"

export DD_API_KEY DD_CIVISIBILITY_AGENTLESS_ENABLED DD_CIVISIBILITY_MANUAL_API_ENABLED DD_ENV DD_GIT_REPOSITORY_URL DD_SERVICE DD_SITE DD_TRACE_DEBUG NODE_OPTIONS NODE_OPTIONS

if [[ -z "$DD_API_KEY" ]]; then
  echo "DD_API_KEY is empty!!!"
else
  echo "sha256sum(DD_API_KEY): $(echo -n "$DD_API_KEY" | sha256sum)"
fi

if [[ "$*" =~ --project ]]; then
  TEST_PROJECT="$(echo "$*" | grep -oP -- '--project[= ](\S+)')"
  TEST_PROJECT="${TEST_PROJECT##--project?}"
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
echo "Playwright project: $TEST_PROJECT"
echo "Playwright version: $(yarn playwright --version)"

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
