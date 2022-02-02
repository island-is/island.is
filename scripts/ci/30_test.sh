#!/bin/bash
set -euxo pipefail

SERVERSIDE_FEATURES_ON=\"\" DD_SERVICE="${APP}" DD_ENV="ci" yarn run test "${APP}" --runInBand --codeCoverage
