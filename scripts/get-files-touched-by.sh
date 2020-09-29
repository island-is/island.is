#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
marker=$(mktemp)
touch $marker -r ${BASH_SOURCE[0]}

CMD=$1
shift

$CMD "$@" 1>&2

# Find all the files paths that are generated out of the yarn schemas script
find $DIR/apps $DIR/libs -type f -newer $marker
