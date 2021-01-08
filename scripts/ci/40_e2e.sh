#!/bin/bash
set -euxo pipefail

HOST="http://localhost:4200"

 yarn start-server-and-test "yarn start $(echo ${1%-*})" $HOST "yarn run e2e $1 --headless --production --record --group=$1 --base-url $HOST --devServerTarget '' "