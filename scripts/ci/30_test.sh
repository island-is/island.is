#!/bin/bash
set -euxo pipefail

: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_ENV:=ci}"
# DD_SERVICE is never used as-is, but initializes the variable, and makes easy
# debugging for when the environment variable isn't successfully set in earlier CI steps
: "${DD_SERVICE:=${APP:-"unit-test"}}"
: "${DD_API_KEY:='<set-api-key>'}"
: "${NODE_OPTIONS:=}"

# Default to big old-space, and more options for testing, but allow overriding
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --require=dd-trace/ci/init ${NODE_OPTIONS:-}"
EXTRA_OPTS=""

projects_uncollectible_coverage=(
  "contentful-translation-extension"
  "application-templates-no-debt-certificate"
  "api-domains-email-signup"
  "skilavottord-web"
  "shared-babel"
)
# shellcheck disable=SC2076
if [[ ! " ${projects_uncollectible_coverage[*]} " =~ " ${APP} " ]]; then
  EXTRA_OPTS="--codeCoverage"
fi

export DD_CIVISIBILITY_AGENTLESS_ENABLED \
  DD_SITE \
  DD_ENV \
  DD_SERVICE \
  DD_API_KEY \
  NODE_OPTIONS \
  SERVERSIDE_FEATURES_ON=\"\" # disable server-side features

yarn run test \
  "${APP}" \
  ${EXTRA_OPTS} \
  --verbose \
  --no-watchman \
  "$@"
