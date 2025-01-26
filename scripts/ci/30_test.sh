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
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --require=dd-trace/ci/init ${NODE_OPTIONS:-}"
EXTRA_OPTS=""

FLAKY_TESTS=(
  "services-auth-delegation-api"
  "services-auth-personal-representative"
)

# projects_uncollectible_coverage=(
#   "application-templates-no-debt-certificate"
#   "api-domains-email-signup"
#   "skilavottord-web"
#   "shared-babel"
#   "portals-my-pages-core"
# )

export DD_CIVISIBILITY_AGENTLESS_ENABLED \
  DD_SITE \
  DD_ENV \
  DD_SERVICE \
  DD_API_KEY \
  NODE_OPTIONS \
  SERVERSIDE_FEATURES_ON=\"\" # disable server-side features

# Function to check if any project in AFFECTED_PROJECTS is a flaky test
is_any_project_flaky() {
  IFS=',' read -ra PROJECTS <<<"$AFFECTED_PROJECTS"
  for project in "${PROJECTS[@]}"; do
    if [[ " ${FLAKY_TESTS[*]} " == *" ${project} "* ]]; then
      return 0
    fi
  done
  return 1
}

# Determine if any project requires code coverage
# requires_code_coverage() {
#   IFS=',' read -ra PROJECTS <<<"$AFFECTED_PROJECTS"
#   for project in "${PROJECTS[@]}"; do
#     if [[ ! " ${projects_uncollectible_coverage[*]} " =~ \ ${project}\  ]]; then
#       return 0
#     fi
#   done
#   return 1
# }

# Set code coverage if required
# if requires_code_coverage; then
#   EXTRA_OPTS="--codeCoverage"
# fi

# Determine number of retries
if is_any_project_flaky; then
  MAX_RETRIES=$FLAKY_TEST_RETRIES
else
  MAX_RETRIES=1
fi

# Run tests with retries
for ((i = 1; i <= MAX_RETRIES; i++)); do
  echo "Running tests for projects: ${AFFECTED_PROJECTS} (attempt: ${i}/${MAX_RETRIES})"
  if yarn nx run-many --projects "${AFFECTED_PROJECTS}" --target test --parallel="${NX_PARALLEL}" "${EXTRA_OPTS}" --verbose --no-watchman "$@"; then
    exit 0
  fi
done

exit 1
