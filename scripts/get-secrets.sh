#!/bin/bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
env_secret_file="$ROOT/.env.secret"

function show-help() {
  echo "Usage:"
  echo "  yarn get-secrets [--reset|-r] <project>..."
  echo ""
  echo "Example:"
  echo "  yarn get-secrets --reset api web"
  echo ""
  echo "Documentation:"
  echo "  docs.devland.is/handbook/repository/aws-secrets"
  echo ""
}

function get-secrets {
  echo "Fetching secret environment variables for '$*'"

  pre=$(wc -l "$env_secret_file")
  ts-node --dir "$ROOT"/infra "$ROOT"/infra/src/cli/cli render-secrets --service="$*" >>"$env_secret_file"
  post=$(wc -l "$env_secret_file")

  if [ "$pre" == "$post" ]; then
    echo "No secrets found for project '$*'"
  fi
}

function is-reset() {
  for arg in "$@"; do
    case $arg in '-r' | '--reset')
      return 0
      ;;
    esac
  done
  return 1
}

function main {
  if is-reset "$@"; then
    echo "Resetting your .env.secret file"
    : >"$env_secret_file"
  fi

  pre_total=$(wc -l <"$env_secret_file")
  for project in "$@"; do
    case "$project" in
    '-r' | '--reset')
      continue
      ;;
    '-h' | '--help')
      show-help
      exit 0
      ;;
    *)
      get-secrets "$project"
      ;;
    esac
    shift
  done
  post_total=$(wc -l <"$env_secret_file")
  echo "Got $((post_total - pre_total)) total new secret lines (now total of $(wc -l <"$env_secret_file"))"
}

if [ -z "${1-}" ]; then
  show-help
  exit 1
else
  touch "$env_secret_file"
  main "$@"
fi
