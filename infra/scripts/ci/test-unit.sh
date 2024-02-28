#!/usr/bin/env bash
set -euxo pipefail

# Run code tests

ROOT="$(git rev-parse --show-toplevel)"
export PATH="$ROOT/node_modules/.bin:$PATH"

(
  cd "$ROOT/infra"
  jest
)
