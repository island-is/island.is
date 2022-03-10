#!/usr/bin/env bash
### Use for local testing - this will run tests for all the charts sequentially
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT=$DIR/../../..

for chart in $(cd "$ROOT" ; python -c 'import os, json; print(" ".join([os.path.splitext(f)[0] for f in os.listdir("infra/src/uber-charts/")]))'); do
    "$DIR"/diff-chart-values.sh "$chart"
done