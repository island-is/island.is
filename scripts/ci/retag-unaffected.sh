#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# This script re-tags all unaffected Docker images with the newest tag.
echo "$1" | tr ' ' '\n' | xargs -P 8 -n 1 -I {} bash -c "IMAGE={} $DIR/_retag.sh" # exit code 255 makes xargs fail fast
