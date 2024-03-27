#!/bin/bash

#
# This script is used to build the system-e2e app using esbuild.
# Playwright requieres special handling with esbuild, which is why it can't use
# the "normal" build process.
#

set -euo pipefail

APP_ROOT="apps/system-e2e"
DIST_ROOT="dist/$APP_ROOT"

echo "Configuring esbuild entrypoints"
entryPoints=()
readarray -t entryPoints < <(
  find "$APP_ROOT" \
    -name '*.ts' \
    -not -path '*/node_modules/*'
)

echo "Configuring esbuild external dependencies"
externalDependencies=()
readarray -t externalDependencies < <(
  jq -r '.dependencies|keys[]|(""+.)' package.json
)
# Known additional external dependencies that don't appear in package.json
externalDependencies+=(
  @angular-devkit
  @nestjs/microservices
  @nestjs/websockets
  @nx/playwright
  @swc-node/core
  @swc-node/register
  aws-sdk
  canvas
  class-transformer
  fsevents
  node_modules
  playwright
  ts-node/esm
)

echo "Processing external dependencies (prefixing with '--external:')"
processedDependencies=()
for dep in "${externalDependencies[@]}"; do
  # Append dependencies
  processedDependencies+=(
    "--external:$dep"
  )
done

echo "Building $APP_ROOT using esbuild"
esbuild \
  --bundle \
  "${entryPoints[@]}" \
  --outdir="$DIST_ROOT" \
  --tsconfig=$APP_ROOT/tsconfig.json \
  --platform=node \
  "${processedDependencies[@]}"

# https://stackoverflow.com/questions/31034746/how-do-i-update-a-single-value-in-a-json-document-using-jq
# jq '.foo.bar = "new value"' file.json
echo "Generating minimal package.json"
jq ".scripts = {} | .devDependencies = {}" package.json >"$DIST_ROOT/package.json"
