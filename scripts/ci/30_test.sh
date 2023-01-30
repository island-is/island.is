#!/bin/bash
set -euxo pipefail

SERVERSIDE_FEATURES_ON=\"\" yarn run test "${APP}" --codeCoverage --verbose --maxWorkers=2
