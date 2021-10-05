#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/../.."
export PATH=$ROOT/node_modules/.bin:$PATH

case "$1" in
    "islandis" | "judicial-system" | "air-discount-scheme")
        ENVS=("dev" "staging" "prod")
        for env in "${ENVS[@]}"; do
          ts-node --dir "$ROOT" "$ROOT"/src/cli/cli render-env --chart="$1" --env="${env}" | diff "$ROOT"/../charts/"$1"/values."${env}".yaml -
        done
        ;;
    *)
        echo "No diffing support for $1 yet or ever"
        ;;
esac
