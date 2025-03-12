#!/usr/bin/env bash
set -euxo pipefail

# Run code tests
GIT_ROOT=$(git rev-parse --show-toplevel)
INFRA_DIR="infra"

"${GIT_ROOT}/${INFRA_DIR}/node_modules/.bin/jest"
