#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/_common.sh

map='{}'
for target in "$@"
do
    affected=$($PROJECT_ROOT/scripts/ci/_nx-affected-targets.sh $target)
    if [[ "$affected" != "" ]]; then
        map=$(echo $map | jq -cM --arg target "$affected" '. + {"'$target'": $target}')
    fi
done

>&2 echo "Map: ${map}"
echo $map
