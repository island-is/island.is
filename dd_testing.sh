#!/bin/bash

set -euo pipefail

. ~/.env.secret

export DD_CIVISIBILITY_AGENTLESS_ENABLED=true
export DD_API_KEY=$DATADOG_API_KEY
export DD_SITE=datadoghq.eu
export NODE_OPTIONS="-r dd-trace/ci/init"
export DD_ENV=local
export DD_SERVICE=api
export DD_TRACE_ENABLED=true
export CI=true
set | grep DD_
set | grep NX_
# yarn nx run api:test --skip-nx-cache
NODE_OPTIONS="-r dd-trace/ci/init" DD_ENV=local DD_SERVICE=api yarn test api "$@"
