#!/bin/bash
set -euo pipefail

# Fails when not every agent job is part of this attempt of the workflow run.
#
# "Re-run failed jobs" only re-runs the jobs that failed: the main job, and the agents that
# were lost (the other agents of a failed run succeed). A distributed run with some of its
# agents is not good enough, e.g. without the judicial agents nothing can run the judicial
# tasks and the run waits for them until the job times out.
#
# GH_TOKEN: token with `actions: read`
# EXPECTED_AGENTS: number of agents, see `plan.mjs`

jobs=$(curl -fsSL \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/attempts/$GITHUB_RUN_ATTEMPT/jobs?per_page=100")

# Agents wait for the main job, so the ones from this attempt can't be completed yet
live_agents=$(jq '[.jobs[] | select(.name | startswith("Nx agent")) | select(.status != "completed")] | length' <<<"$jobs")
echo "Agents in attempt $GITHUB_RUN_ATTEMPT: $live_agents of $EXPECTED_AGENTS"

if [[ "$live_agents" -lt "$EXPECTED_AGENTS" ]]; then
  echo "::error title=Nx Agents::Only $live_agents of $EXPECTED_AGENTS agents are running in this attempt. Use \"Re-run all jobs\" instead of \"Re-run failed jobs\"."
  exit 1
fi
