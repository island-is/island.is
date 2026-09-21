#!/bin/bash
set -euo pipefail

# Runs the Nx command planned by `plan.mjs` on the main job. With a distributed
# CI run started, the tasks are executed by the agents and this job only orchestrates.
#
# The quick workspace checks that need no agent run first. When one of them fails the
# job fails right away, instead of at the end of the distributed run.
#
# NX_AGENTS_ARGS: JSON list of args for `nx`, see `plan.mjs`
# UNICORN_PROJECTS: comma separated projects that must have tests, see `plan.mjs`
#
# Writes `failed-checks`, `failed-tasks` and `nx-cloud-url` to $GITHUB_OUTPUT, for the
# comment with the result on the pull request.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

: "${NX_AGENTS_ARGS:=[]}"
: "${UNICORN_PROJECTS:=}"
: "${GITHUB_OUTPUT:=/dev/null}"
NX_LOG="${RUNNER_TEMP:-$(mktemp -d)}/nx-agents-output.log"

pids=()
names=()

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

run_bg check-tags ./scripts/ci/20_lint-workspace.sh
run_bg license-audit ./scripts/ci/20_license-audit.sh
if [[ -n "$UNICORN_PROJECTS" ]]; then
  run_bg unicorn-tests "$DIR/check-unicorn-tests.sh"
fi

failed=()
for i in "${!pids[@]}"; do
  if ! wait "${pids[$i]}"; then
    failed+=("${names[$i]}")
  fi
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "failed-checks=${failed[*]}" >>"$GITHUB_OUTPUT"
  echo "::error title=Nx Agents::Failed: ${failed[*]}. The Nx tasks were not run."
  exit 1
fi
echo "All checks succeeded: ${names[*]}"

mapfile -t nx_args < <(jq -r '.[]' <<<"$NX_AGENTS_ARGS")
if [[ ${#nx_args[@]} -eq 0 ]]; then
  echo "No Nx tasks to run"
  exit 0
fi

# Without agents the tasks run here. Agents get this from the `.env.<target>` files of `start-agent.sh`
if [[ "${NX_CLOUD_DISTRIBUTED_EXECUTION_AGENT_COUNT:-0}" == "0" ]]; then
  export NODE_OPTIONS="--max-old-space-size=4096"
fi

status=0
yarn nx "${nx_args[@]}" 2>&1 | tee "$NX_LOG" || status=$?

{
  echo "failed-tasks=$(node "$DIR/failed-tasks.mjs" "$NX_LOG")"
  echo "nx-cloud-url=$(grep -oE 'https://cloud\.nx\.app/runs/[A-Za-z0-9]+' "$NX_LOG" | tail -1 || true)"
} >>"$GITHUB_OUTPUT"

if [[ $status -ne 0 ]]; then
  echo "::error title=Nx Agents::The Nx command failed"
fi
exit "$status"
