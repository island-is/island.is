#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

set -x
FEATURE_NAME=$1
echo "Deleting secrets for feature $FEATURE_NAME"

sleep 10

if command -v yarn >/dev/null 2>&1; then
  # Use the package.json “secrets” script
  yarn secrets delete -- "/k8s/feature-${FEATURE_NAME}"
else
  # Fallback directly to the CLI entrypoint
  node -r esbuild-register infra/src/secrets.ts delete -- "/k8s/feature-${FEATURE_NAME}"
fi
