#!/bin/bash
set -euxo pipefail

SERVERSIDE_FEATURES_ON=\"\" NODE_OPTIONS="--max-old-space-size=4096" yarn run test "${APP}" --codeCoverage --verbose --maxWorkers=1 --runInBand "$@"
