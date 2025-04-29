#!/bin/bash
set -euxo pipefail

: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_ENV:=ci}"
: "${DD_API_KEY:='<set-api-key>'}"
: "${NODE_OPTIONS:=}"
: "${FLAKY_TEST_RETRIES:=3}"
: "${NX_PARALLEL:=2}"

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
  DD_API_KEY \
  NODE_OPTIONS \
  SERVERSIDE_FEATURES_ON=\"\" # disable server-side features
unset DD_SERVICE

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

# Set Datadog config per-project
jq -n --arg p "${AFFECTED_PROJECTS}" '$p | split(",") | .[]' | xargs -I% yarn nx show project --json % | jq -re '"echo DD_SERVICE=\(.name) >> \(.root)/.env"' | xargs -I% sh -c '%'

yarn nx run-many \
  --projects "${AFFECTED_PROJECTS}" \
  --target test \
  --parallel="${NX_PARALLEL}" \
  --no-watchman \
  --ci \
  --detectLeaks=false \
  --passWithNoTests \
  --exclude="${services_to_skip[*]}" \
  "$@"
