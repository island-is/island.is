#!/bin/bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)

function main {
  echo "Fetching secret environment variables for $1"
  dir="${0%/*}"
  env_secret_file="$dir/../.env.secret"
  touch "$env_secret_file"

  if [ "${2-}" == "--reset" ]; then
    : > "$env_secret_file"
  fi

  ts-node --dir "$ROOT"/infra "$ROOT"/infra/src/cli/cli render-secrets --service="$1" >> "$env_secret_file"

  echo "Done"
}

if [ -z "${1-}" ]; then
  echo "Usage:"
  echo "  yarn get-secrets <project> [--reset]"
  echo ""
  echo "Example:"
  echo "  yarn get-secrets gjafakort --reset"
  echo ""
  echo "Documentation:"
  echo "  docs.devland.is/handbook/repository/aws-secrets"
  echo ""
  exit 1
else
  main "$*"
fi
