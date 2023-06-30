#!/bin/bash

set -eoux pipefail

npx --project "@nrwl/nx-cloud@${NX_CLOUD_VERSION}" --project dotenv nx-cloud "$@"