#!/bin/bash

set -euo pipefail

GIT_DIR=$(git rev-parse --show-toplevel)
cat "${GIT_DIR}/.cache-generating-files" | xargs printf "'%s'," | sed 's/,$//'
