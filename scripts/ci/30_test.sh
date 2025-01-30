#!/bin/bash
set -euxo pipefail

: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_ENV:=ci}"
: "${DD_SERVICE:=unit-test}"
: "${DD_API_KEY:='<set-api-key>'}"
: "${NODE_OPTIONS:=}"
: "${FLAKY_TEST_RETRIES:=3}"

# Default to big old-space, and more options for testing, but allow overriding
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --trace-warnings --require=dd-trace/ci/init ${NODE_OPTIONS:-}"
EXTRA_OPTS=""

projects_uncollectible_coverage=(
  "application-templates-no-debt-certificate"
  "api-domains-email-signup"
  "skilavottord-web"
  "shared-babel"
  "portals-my-pages-core"
)

# Array of services to skip during testing
services_to_skip=(
  "services-user-notification"
)

export DD_CIVISIBILITY_AGENTLESS_ENABLED \
  DD_SITE \
  DD_ENV \
  DD_SERVICE \
  DD_API_KEY \
  NODE_OPTIONS \
  SERVERSIDE_FEATURES_ON=\"\" # disable server-side features

# Determine if any project requires code coverage
requires_code_coverage() {
  IFS=',' read -ra PROJECTS <<<"$AFFECTED_PROJECTS"
  for project in "${PROJECTS[@]}"; do
    if [[ ! " ${projects_uncollectible_coverage[*]} " =~ \ ${project}\  ]]; then
      return 0
    fi
  done
  return 1
}

# Set code coverage if required
if requires_code_coverage; then
  EXTRA_OPTS="--codeCoverage"
fi

echo $EXTRA_OPTS

yarn nx run-many \
  --projects "${AFFECTED_PROJECTS}" \
  --target test \
  --parallel="${NX_PARALLEL}" \
  --verbose \
  --no-watchman \
  --debug \
  --ci \
  --detectLeaks=false \
  --passWithNoTests \
  --exclude="${services_to_skip[*]}" \
  "$@"
