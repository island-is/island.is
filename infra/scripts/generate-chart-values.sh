#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/.."

export PATH=$ROOT/node_modules/.bin:$PATH

render() {
    APP=$1
    ENVS=("dev" "staging" "prod")
    for env in "${ENVS[@]}"; do
        # avoid clearing values file if render-env fails
        tmp_file=$(mktemp)
        ts-node --dir "$ROOT" "$ROOT"/src/render-env --chart="$APP" --env="${env}" > "$tmp_file"
        mv "$tmp_file" "$ROOT"/../charts/"$APP"/values."${env}".yaml
    done
}

APPS=("islandis" "judicial-system" "air-discount-scheme")

echo "$1"
case "$1" in
    "all" )
        for app in "${APPS[@]}"; do
            render "$app"
        done
        ;;
    *)
        render "$1"
        ;;
esac