#!/bin/bash

set -eoux pipefail

yarn dlx -p @nrwl/workspace -p dotenv -p "@nrwl/nx-cloud@${NX_CLOUD_VERSION}" nx-cloud "$@"