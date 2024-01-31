#!/bin/bash

set -euo pipefail

GIT_ROOT=$(git rev-parse --show-toplevel)
cat "${GIT_ROOT}/package.json" | jq '{resolutions,dependencies,devDependencies}' | sha1sum -t | cut -f1 -d" "
