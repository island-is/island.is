#!/bin/bash
set -euo pipefail

# Fails when no agent job is part of this attempt of the workflow run.
#
# "Re-run failed jobs" only re-runs the main job, since the agents of a failed run
# succeed. Without agents the distributed run would sit idle until the job times out.
#
# GH_TOKEN: token with `actions: read`

jobs=$(curl -fsSL \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/attempts/$GITHUB_RUN_ATTEMPT/jobs?per_page=100")

# Agents wait for the main job, so the ones from this attempt can't be completed yet
live_agents=$(jq '[.jobs[] | select(.name | startswith("Nx agent")) | select(.status != "completed")] | length' <<<"$jobs")
echo "Agents in attempt $GITHUB_RUN_ATTEMPT: $live_agents"

if [[ "$live_agents" == "0" ]]; then
  echo "::error title=Nx Agents::No agents are running in this attempt. Use \"Re-run all jobs\" instead of \"Re-run failed jobs\"."
  exit 1
fi
