#!/bin/bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)

(cd "$ROOT"/infra && node -r esbuild-register src/cli/cli render-env-vars --service="$1")
