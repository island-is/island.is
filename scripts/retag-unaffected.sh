#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# This script re-tags all unaffected Docker images with the newest tag.

AFFECTED_EXPRESS=`$DIR/_nx-affected-targets.sh docker-express | tr -d '\n'`
AFFECTED_NEXT=`$DIR/_nx-affected-targets.sh docker-next | tr -d '\n'`
ALL_EXPRESS=`AFFECTED_ALL=${BRANCH} $DIR/_nx-affected-targets.sh docker-express | tr -d '\n'`
ALL_NEXT=`AFFECTED_ALL=${BRANCH} $DIR/_nx-affected-targets.sh docker-next | tr -d '\n'`


UNAFFECTED_DOCKER_IMAGES=`node << EOM
    const affectedProjects = "$AFFECTED_EXPRESS".split(",").concat("$AFFECTED_NEXT".split(",")).map(e => e.trim()).filter(e => e.length > 0)
    const allProjects = "$ALL_EXPRESS".split(",").concat("$ALL_NEXT".split(",")).map(e => e.trim()).filter(e => e.length > 0)
    console.error('All Docker targets: [' + allProjects + ']')
    console.error('Affected Docker targets: [' + affectedProjects + ']')
    for (const affected of affectedProjects) {
        const idx = allProjects.indexOf(affected);
        if (idx > -1) allProjects.splice(idx, 1)
    }
    console.log(allProjects.join(' '))
EOM
`

echo $UNAFFECTED_DOCKER_IMAGES | tr ' ' '\n' | xargs -I {} bash -c "IMAGE={} $DIR/retag.sh || exit 255" # exit code 255 makes xargs fail fast