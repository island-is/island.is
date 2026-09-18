#!/bin/bash
set -euo pipefail

# Runs the Nx command planned by `plan.mjs` on the main job. With a distributed
# CI run started, the tasks are executed by the agents and this job only
# orchestrates, so the workspace checks that need no agent run alongside.
#
# NX_AGENTS_ARGS: JSON list of args for `nx`, see `plan.mjs`

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT=$(git -C "$DIR" rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

: "${NX_AGENTS_ARGS:=[]}"

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

mapfile -t nx_args < <(jq -r '.[]' <<<"$NX_AGENTS_ARGS")
if [[ ${#nx_args[@]} -gt 0 ]]; then
  run_bg nx yarn nx "${nx_args[@]}"
fi

run_bg check-tags ./scripts/ci/20_lint-workspace.sh
run_bg license-audit ./scripts/ci/20_license-audit.sh

failed=()
for i in "${!pids[@]}"; do
  if ! wait "${pids[$i]}"; then
    failed+=("${names[$i]}")
  fi
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "::error title=Nx Agents::Failed: ${failed[*]}"
  exit 1
fi
echo "All commands succeeded: ${names[*]}"
