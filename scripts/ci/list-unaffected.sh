#!/bin/bash

set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# This script re-tags all unaffected Docker images with the newest tag.

UNAFFECTED=""

for TARGET in "$@"
do
    AFFECTED=$("$DIR"/_nx-affected-targets.sh $TARGET | tr -d '\n')
    ALL=$(AFFECTED_ALL=7913-${BRANCH} "$DIR"/_nx-affected-targets.sh $TARGET | tr -d '\n')

    UNAFFECTED_ADD=$(node << EOM
        const affectedProjects = "$AFFECTED".split(",").map(e => e.trim()).filter(e => e.length > 0)
        const allProjects = "$ALL".split(",").map(e => e.trim()).filter(e => e.length > 0)
        console.error('All projects: [' + allProjects + ']')
        console.error('Affected projects: [' + affectedProjects + ']')
        const unaffected = allProjects.filter(proj => !affectedProjects.includes(proj))
        if (unaffected.length === 0) console.error('Everything is affected')
        console.log(unaffected.join(' '))
EOM
)
    if [[ -n $UNAFFECTED_ADD ]] ; then
      UNAFFECTED="$UNAFFECTED $UNAFFECTED_ADD"
    fi
done

>&2 echo "Unaffected Docker images: ${UNAFFECTED}"
echo "$UNAFFECTED"
