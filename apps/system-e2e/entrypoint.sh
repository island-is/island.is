#!/usr/bin/env bash

set -euo pipefail

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Cypress args: $*"
cypress run "$@"
