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

# Set Datadog config per-project. `.dockerignore` keeps these files out of the Docker builds
GRAPH_FILE="$(mktemp -d)/graph.json"
NX_DAEMON=false yarn nx graph --file="$GRAPH_FILE" >/dev/null
jq -r '.graph.nodes | to_entries[] | "\(.value.data.root)\t\(.key)"' "$GRAPH_FILE" |
  while IFS=$'\t' read -r root name; do
    echo "DD_SERVICE=$name" >>"$root/.env"
  done

unset NODE_OPTIONS DD_SERVICE API_MOCKS
export NX_LOAD_DOT_ENV_FILES=true

# The rest is about "Re-run failed jobs", which only re-runs the jobs that failed. GH_TOKEN is for
# that and not something for the tasks, so it is not in the environment of the agent
ATTEMPT_TOKEN="${GH_TOKEN:-}"
unset GH_TOKEN
# shellcheck source-path=SCRIPTDIR
source "$DIR/_attempt.sh"

# An agent that was lost is re-run on its own when the main job went on without it and succeeded.
# Nobody starts a distributed run in that attempt, so there is nothing to wait for
if [[ -n "$ATTEMPT_TOKEN" && "${GITHUB_RUN_ATTEMPT:-1}" -gt 1 ]]; then
  state=$(main_job_state || echo unknown)
  if [[ "$state" == "ok" || "$state" == "missing" ]]; then
    echo "The main job is not part of this attempt (it is done), so there are no tasks for this agent"
    exit 0
  fi
fi

AGENT_LOG="$(mktemp)"
status=0
npx nx-cloud start-agent 2>&1 | tee "$AGENT_LOG" || status=$?

# An agent exits when there are no tasks left for it, or when the run ends. In the second case it
# may still have had work. If the run failed, fail this job too: then "Re-run failed jobs" re-runs
# the main job together with every agent that is needed for what is left (all of them when the
# run failed early, e.g. because a runner was lost)
if [[ $status -eq 0 && -n "$ATTEMPT_TOKEN" ]] && ! grep -q "no further tasks for this agent" "$AGENT_LOG"; then
  for _ in 1 2 3 4 5 6; do
    state=$(main_job_state || echo unknown)
    [[ "$state" != "live" ]] && break
    # The main job is still at the step that ends the run, its failed step shows up in a moment
    sleep 5
  done
  if [[ "$state" == "failed" ]]; then
    echo "::error title=Nx Agents::The distributed run failed while this agent was part of it. This job fails with it so that \"Re-run failed jobs\" re-runs this agent too."
    exit 1
  fi
fi
exit "$status"
