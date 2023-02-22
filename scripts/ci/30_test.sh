#!/bin/bash
set -euxo pipefail

EXTRA_OPTS=""

projects_uncollectible_coverage=("contentful-translation-extension" "application-templates-no-debt-certificate" "api-domains-email-signup" "skilavottord-web" "shared-babel")
# shellcheck disable=SC2076
if [[ ! " ${projects_uncollectible_coverage[*]} " =~ " ${APP} " ]]; then
  EXTRA_OPTS="--codeCoverage"
fi

SERVERSIDE_FEATURES_ON=\"\" NODE_OPTIONS="--max-old-space-size=4096 --unhandled-rejections=warn" yarn run test "${APP}" "${EXTRA_OPTS}" --verbose --no-watchman "$@"
