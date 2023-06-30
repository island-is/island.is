#!/bin/bash

set -eou pipefail

node_version=$(node --version)
nx_version=$(nx --version)
yarn_version=$(yarn --version)
npm_version=$(npm --version)
npx_version=$(npx --version)

echo "node version: $node_version"
echo "nx version: $nx_version"
echo "yarn version: $yarn_version"
echo "npm version: $npm_version"
echo "npx version: $npx_version"

npx nx-cloud "$@"