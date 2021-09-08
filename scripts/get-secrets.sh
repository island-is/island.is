#!/bin/bash
set -euo pipefail

function main {
  echo "Fetching secret environment variables for $1"
  dir="${0%/*}"
  env_secret_file="$dir/../.env.secret"
  touch "$env_secret_file"

  if [ "${2-}" == "--reset" ]; then
    : > "$env_secret_file"
  fi

  secrets=$(aws ssm --region eu-west-1 get-parameters-by-path \
    --path "/k8s/$1/" --with-decryption --recursive \
    --parameter-filters Key=Label,Option=Equals,Values=dev \
    | npx jq -r '.Parameters | map(.Name |= split("/")) | .[] | [.Name[-1], .Value] | join("=")')

  for secret in $secrets; do
    echo "export $secret" >> "$env_secret_file"
  done

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
