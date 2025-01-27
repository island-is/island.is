#!/bin/env bash

set -euo pipefail

show_help() {
  cat <<EOF >&2
Usage: $0 <app>

EOF

}

if [[ $# -ne 1 ]]; then
  show_help
  exit 1
fi

set -x

APP="$1"
APP_HOME="$(yarn nx show project "$APP" | jq -r '.root')"

opts=(
  "--file=$PWD/scripts/ci/Dockerfile"
  "--target=output-$(grep -oP '(?<="docker-)\w+(?=")' "$APP_HOME/project.json")"
  "--load"
  "--build-arg=APP=$APP"
  "--build-arg=APP_HOME=$APP_HOME"
  "--build-arg=APP_DIST_HOME=dist/$APP_HOME"
  "--tag=$APP:local"
  "--build-arg=NODE_IMAGE_TAG=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)-alpine"
)

docker buildx build "${opts[@]}" "$PWD"
yarn infra render-local-env "$APP"
docker run --rm -it --env-file=".env.$APP" "$APP:local"
