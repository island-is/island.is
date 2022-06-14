#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/.."

cd "$ROOT"
node -r esbuild-register "$ROOT"/src/process.ts
cd -
