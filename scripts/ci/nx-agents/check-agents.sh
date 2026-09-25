#!/bin/bash
set -euo pipefail

# For the main job of an attempt after the first one: checks which agents are part of the attempt.
#
# "Re-run failed jobs" re-runs the main job with the agents that failed. Those are the agents
# that still had work when the run failed (see `start-agent.sh`), so the run continues with them:
# what was done before is a cache hit. Without any agent there is nobody to run the tasks.
#
# GH_TOKEN: token with `actions: read`
# EXPECTED_AGENTS: number of agents, see `plan.mjs`

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ATTEMPT_TOKEN="$GH_TOKEN"
# shellcheck source-path=SCRIPTDIR
source "$DIR/_attempt.sh"

agents=$(live_agents)
echo "Agents in attempt $GITHUB_RUN_ATTEMPT: $agents of $EXPECTED_AGENTS"

if [[ "$agents" == "0" ]]; then
  echo "::error title=Nx Agents::No agents are running in this attempt. Use \"Re-run all jobs\" instead of \"Re-run failed jobs\"."
  exit 1
fi

if [[ "$agents" -lt "$EXPECTED_AGENTS" ]]; then
  echo "::notice title=Nx Agents::Continuing with the $agents agent(s) that were re-run. Use \"Re-run all jobs\" if that is too few for what is left."
  # What Nx Cloud waits for before it starts handing out tasks
  echo "NX_CLOUD_DISTRIBUTED_EXECUTION_AGENT_COUNT=$agents" >>"$GITHUB_ENV"
fi
