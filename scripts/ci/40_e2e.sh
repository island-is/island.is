#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# FIXME: use proper feature flag
if [[ -n "$USE_NX_CLOUD" ]]; then
  source "$DIR"/patch-nx-json.sh
  yarn run nx affected --target=e2e-ci --parallel=3
else
  yarn nx run "$1":e2e-ci
fi

