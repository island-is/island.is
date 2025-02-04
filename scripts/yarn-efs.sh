#!/bin/bash

YARN_LOCK_SHA=$1
export NODE_PATH=/home/runner/${YARN_LOCK_SHA}/node_modules/
echo "NODE_PATH=$NODE_PATH" >>"$GITHUB_ENV"
yarn install --cached
