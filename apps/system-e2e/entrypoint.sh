#!/usr/bin/env bash

set -euo pipefail

# jq --arg testFiles "$TEST_FILES" '. + {testFiles: ($testFiles | split(",") | map(. + "/*.spec.ts"))}' < cypress.json > cypress.json.tmp
# mv cypress.json.tmp cypress.json

echo "Current test environment: ${TEST_ENVIRONMENT}"

# echo "Using this configuration:"
# cat cypress.config.ts

DEBUG="cypress:*"  cypress run "$@"
