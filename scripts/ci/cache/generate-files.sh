#!/bin/bash
set -euo pipefail

# shellcheck disable=SC2046
bash tar zcvf generated_files.tar.gz $(./scripts/ci/get-files-touched-by.sh yarn codegen --skip-cache | xargs realpath --relative-to $(pwd))