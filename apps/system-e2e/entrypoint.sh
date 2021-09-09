#!/usr/bin/env bash

set -euo pipefail

jq --arg testFiles "$TEST_FILES" '. + {testFiles: ($testFiles | split(",") | map(. + ".spec.ts"))}' < cypress.json > cypress.json.tmp
mv cypress.json.tmp cypress.json

echo "Using this configuration:"
cat cypress.json

cypress run "$@"