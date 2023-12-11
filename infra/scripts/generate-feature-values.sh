#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/.."

export PATH=$ROOT/node_modules/.bin:$PATH

cd "$ROOT"
node -r esbuild-register "$ROOT"/src/feature-env.ts "$@"
