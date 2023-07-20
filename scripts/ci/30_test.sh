#!/bin/bash
set -euxo pipefail

: "${NODE_OPTIONS:=--max-old-space-size=8192}"
: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_ENV:=dev}"
: "${DD_SERVICE:=unit-test-action}"
: "${DD_API_KEY:='<set-api-key>'}"

# Default to big old-space, and more options for testing, but allow overriding
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --require=dd-trace/ci/init ${NODE_OPTIONS:-}"
SERVERSIDE_FEATURES_ON=\"\"
EXTRA_OPTS=""

projects_uncollectible_coverage=("contentful-translation-extension" "application-templates-no-debt-certificate" "api-domains-email-signup" "skilavottord-web" "shared-babel")
# shellcheck disable=SC2076
if [[ ! " ${projects_uncollectible_coverage[*]} " =~ " ${APP} " ]]; then
  EXTRA_OPTS="--codeCoverage"
fi

yarn run test \
  "${APP}" \
  ${EXTRA_OPTS} \
  --verbose \
  --no-watchman \
  "$@"
