#!/bin/bash
set -euxo pipefail

yarn run e2e $1 --headless --production --record --group=$1
