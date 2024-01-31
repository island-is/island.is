#!/bin/bash

set -euo pipefail

GIT_ROOT=$(git rev-parse --show-toplevel)
cat "${GIT_ROOT}/.cache-generating-files" | xargs printf "'%s'," | sed 's/,$//'
