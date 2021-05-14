#!/usr/bin/env bash
### Use for local testing - this will run tests for all the charts sequentially
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT=$DIR/../..

for chart in $(ls $ROOT/charts); do
    $DIR/test-chart.sh $chart
done