#!/bin/bash
set -euo pipefail

export NODE_OPTIONS=--max-old-space-size=4096
# shellcheck disable=SC2046
tar zcvf generated_files.tar.gz $(./scripts/ci/get-files-touched-by.sh yarn codegen | xargs realpath --relative-to $(pwd))
