#!/bin/bash
set -euxo pipefail

SERVERSIDE_FEATURES_ON=\"\" NODE_OPTIONS="--max-old-space-size=4096 --unhandled-rejections=warn" yarn run test "${APP}" --codeCoverage --verbose --runInBand "$@"
