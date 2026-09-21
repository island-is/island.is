#!/bin/bash
set -euo pipefail

# Starts an Nx Cloud agent that executes tasks handed out by the main job.
#
# An agent runs every kind of target, so environment that used to live on a
# dedicated job (tests, e2e, ...) is scoped per target here using the `.env.<target>`
# files Nx loads for each task. Process env wins over these files, so anything set
# here must not be exported in the agent's own environment.
#
# This matters for more than tidiness: e.g. `API_MOCKS` is compiled into Next.js
# and Vite builds, so leaking it to `build` tasks would put mocked builds in the
# shared Nx cache.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# NODE_OPTIONS from the job, e.g. what Datadog's test visibility action configured
JOB_NODE_OPTIONS="${NODE_OPTIONS:-}"

# Same as `30_test.sh`
cat >.env.test <<EOF
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --trace-warnings --require=dd-trace/ci/init ${JOB_NODE_OPTIONS}"
DD_CIVISIBILITY_AGENTLESS_ENABLED=${DD_CIVISIBILITY_AGENTLESS_ENABLED:-true}
DD_SITE=${DD_SITE:-datadoghq.eu}
DD_ENV=${DD_ENV:-ci}
EOF

# Same as the e2e job in `e2e.yml`
cat >.env.e2e <<EOF
NODE_OPTIONS="--max-old-space-size=4096"
API_MOCKS=true
EOF

# Same as the build in a Docker build (`scripts/ci/Dockerfile`). The builds here and there have the
# same hash, so an image can be made from what was built (and cached) here
cat >.env.build <<EOF
NODE_OPTIONS="--max-old-space-size=8192"
NODE_ENV=production
EOF
cp .env.build .env.build-custom-server

# What the linting and typecheck jobs had before Nx Agents
echo 'NODE_OPTIONS="--max-old-space-size=4096"' | tee .env.lint >.env.typecheck

# Set Datadog config per-project
GRAPH_FILE="$(mktemp -d)/graph.json"
NX_DAEMON=false yarn nx graph --file="$GRAPH_FILE" >/dev/null
jq -r '.graph.nodes | to_entries[] | "\(.value.data.root)\t\(.key)"' "$GRAPH_FILE" |
  while IFS=$'\t' read -r root name; do
    echo "DD_SERVICE=$name" >>"$root/.env"
  done

unset NODE_OPTIONS DD_SERVICE API_MOCKS
export NX_LOAD_DOT_ENV_FILES=true

exec npx nx-cloud start-agent
