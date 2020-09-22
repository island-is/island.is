#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
marker=$(mktemp)
touch $marker -r ${BASH_SOURCE[0]}

CMD=$1
shift

$CMD "$@" 1>&2

find $DIR/apps -type f -newer $marker