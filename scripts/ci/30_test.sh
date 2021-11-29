#!/bin/bash
set -euxo pipefail

yarn run test "${APP}" --runInBand --codeCoverage
