#!/bin/bash
set -euxo pipefail

CHART=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT=$DIR/../..



renderChartWithValuesPostfix() {
    file_overrides=""
    for values_postfix in "$@"
    do
        file_overrides="$file_overrides -f $ROOT/charts/$CHART/values.$values_postfix.yaml"
    done
    helm template $ROOT/charts/$CHART $file_overrides --set global.image.tag=latest
}

helm dep build $ROOT/charts/$CHART

case $CHART in

  internal-services)
    renderChartWithValuesPostfix shared
    ;;

  github-oidc)
    renderChartWithValuesPostfix dev
    ;;

  identity-server)
    renderChartWithValuesPostfix auth-api.dev ids.dev
    renderChartWithValuesPostfix auth-api.staging ids.staging
    renderChartWithValuesPostfix auth-api.prod ids.prod
    ;;

  *)
    renderChartWithValuesPostfix dev
    renderChartWithValuesPostfix staging
    renderChartWithValuesPostfix prod
    ;;
esac
