#!/bin/bash
set -euo pipefail

# Runs the Nx command(s) planned by `plan.mjs` on the main job. With a distributed
# CI run started, the tasks are executed by the agents and this job only orchestrates.
#
# The quick workspace checks that need no agent run first. For a pull request, when one of them
# fails the job fails right away, instead of at the end of the distributed run.
#
# NX_AGENTS_ARGS: JSON list of args for `nx`: lint, typecheck, (build,) test and e2e
# NX_IMAGE_ARGS: JSON list of args for `nx`: the Docker images of a feature deployment. Runs at the
#   same time as the other command, and a failure of the checks does not stop it: whether a
#   feature is deployed depends on its images (the `images` output), like before Nx Agents
# UNICORN_PROJECTS: comma separated projects that must have tests
# GH_TOKEN: token with `actions: read`, to notice that an agent is lost
#
# Writes `failed-checks`, `failed-tasks`, `nx-cloud-url` and `images` (success/failure, with
# NX_IMAGE_ARGS) to $GITHUB_OUTPUT

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"
# shellcheck source-path=SCRIPTDIR
source "$DIR/_attempt.sh"

: "${NX_AGENTS_ARGS:=[]}"
: "${NX_IMAGE_ARGS:=[]}"
: "${UNICORN_PROJECTS:=}"
: "${GITHUB_OUTPUT:=/dev/null}"
LOG_DIR="${RUNNER_TEMP:-$(mktemp -d)}"

pids=()
names=()
failed=()

# Runs a command in the background, prefixing its output with a name
run_bg() {
  local name=$1
  shift
  (
    set -o pipefail
    "$@" 2>&1 | sed -u "s/^/[$name] /"
  ) &
  pids+=("$!")
  names+=("$name")
}

# Waits for the commands started with run_bg, the names of the ones that failed are added to `failed`
wait_all() {
  for i in "${!pids[@]}"; do
    if ! wait "${pids[$i]}"; then
      failed+=("${names[$i]}")
    fi
  done
  pids=()
  names=()
}

# Like wait_all, but fails when an agent is lost while waiting. Nx Cloud keeps waiting for the task
# such an agent was running, so without this the job hangs until it times out. Failing ends the
# run, and the agents that still have work fail with it, so "Re-run failed jobs" continues from here
wait_all_watching_agents() {
  local lost pid running
  while [[ -n "${GH_TOKEN:-}" ]]; do
    running=false
    for pid in "${pids[@]}"; do
      if kill -0 "$pid" 2>/dev/null; then running=true; fi
    done
    if [[ "$running" == "false" ]]; then break; fi
    lost=$(ATTEMPT_TOKEN="$GH_TOKEN" lost_agents || true)
    if [[ -n "$lost" ]]; then
      echo "::error title=Nx Agents::Lost: $lost. Nx Cloud does not give the task of a lost agent to another one, so the run ends here. Re-run the failed jobs to continue."
      for pid in "${pids[@]}"; do
        pkill -P "$pid" 2>/dev/null || true
        kill "$pid" 2>/dev/null || true
      done
      failed+=("agents")
      break
    fi
    sleep "${AGENT_WATCH_INTERVAL:-30}"
  done
  wait_all
}

# Runs `nx` with a JSON list of args, the output is also written to a file
run_nx() {
  local args log=$2
  mapfile -t args < <(jq -r '.[]' <<<"$1")
  yarn nx "${args[@]}" 2>&1 | tee "$log"
}

has_args() {
  [[ "$(jq 'length' <<<"$1")" != "0" ]]
}

run_bg check-tags ./scripts/ci/20_lint-workspace.sh
run_bg license-audit ./scripts/ci/20_license-audit.sh
if [[ -n "$UNICORN_PROJECTS" ]]; then
  run_bg unicorn-tests "$DIR/check-unicorn-tests.sh"
fi
wait_all

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "failed-checks=${failed[*]}" >>"$GITHUB_OUTPUT"
  if ! has_args "$NX_IMAGE_ARGS"; then
    echo "::error title=Nx Agents::Failed: ${failed[*]}. The Nx tasks were not run."
    exit 1
  fi
fi

# Without agents the tasks run here. Agents get this from the `.env.<target>` files of `start-agent.sh`
if [[ "${NX_CLOUD_DISTRIBUTED_EXECUTION_AGENT_COUNT:-0}" == "0" ]]; then
  export NODE_OPTIONS="--max-old-space-size=4096"
fi

if has_args "$NX_AGENTS_ARGS"; then
  run_bg checks run_nx "$NX_AGENTS_ARGS" "$LOG_DIR/nx-checks.log"
fi
if has_args "$NX_IMAGE_ARGS"; then
  run_bg images run_nx "$NX_IMAGE_ARGS" "$LOG_DIR/nx-images.log"
fi
if [[ ${#pids[@]} -eq 0 ]]; then
  echo "No Nx tasks to run"
fi
wait_all_watching_agents

touch "$LOG_DIR/nx-checks.log" "$LOG_DIR/nx-images.log"
cat "$LOG_DIR/nx-checks.log" "$LOG_DIR/nx-images.log" >"$LOG_DIR/nx-agents-output.log"
{
  echo "failed-tasks=$(node "$DIR/failed-tasks.mjs" "$LOG_DIR/nx-agents-output.log")"
  echo "nx-cloud-url=$(grep -oE 'https://cloud\.nx\.app/runs/[A-Za-z0-9]+' "$LOG_DIR/nx-agents-output.log" | tail -1 || true)"
  if has_args "$NX_IMAGE_ARGS"; then
    if [[ " ${failed[*]} " == *" images "* ]]; then
      echo "images=failure"
    else
      echo "images=success"
    fi
  fi
} >>"$GITHUB_OUTPUT"

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "::error title=Nx Agents::Failed: ${failed[*]}"
  exit 1
fi
