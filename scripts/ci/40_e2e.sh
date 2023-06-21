#!/bin/bash
set -euxo pipefail

if [[ -n "$USE_NX_CLOUD" ]]; then
  yarn run nx affected --target=e2e-ci --parallel="$MAX_JOBS"
else
  yarn nx run "$1":e2e-ci
fi

