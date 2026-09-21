#!/bin/bash

# Helpers about the jobs of this attempt of the workflow run, for "Re-run failed jobs":
# GitHub only re-runs the jobs that failed (and the ones that need them), so an attempt can
# have the main job without some of the agents, or agents without the main job.
#
# ATTEMPT_TOKEN: token with `actions: read`

MAIN_JOB_NAME="Nx main job"
AGENT_JOB_PREFIX="Nx agent"

# The jobs of this attempt. A job that was not re-run is in the list as well, as it ended before
attempt_jobs() {
  curl -fsSL \
    -H "Authorization: Bearer $ATTEMPT_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/attempts/$GITHUB_RUN_ATTEMPT/jobs?per_page=100"
}

# Number of agents that run in this attempt. Agents wait for the main job, so the ones from this
# attempt can't be completed when it asks
live_agents() {
  attempt_jobs | jq --arg prefix "$AGENT_JOB_PREFIX" \
    '[.jobs[] | select(.name | startswith($prefix)) | select(.status != "completed")] | length'
}

# Names of the agents of this attempt that failed. During a run that is an agent that was lost,
# e.g. with its runner: agents only fail with the run after it has ended (see `start-agent.sh`)
lost_agents() {
  attempt_jobs | jq -r --arg prefix "$AGENT_JOB_PREFIX" \
    '[.jobs[] | select(.name | startswith($prefix)) | select(.conclusion == "failure" or .conclusion == "cancelled") | .name] | join(", ")'
}

# live: runs in this attempt, failed: has a failed step (the job itself is not done at that point,
# its last step ends the distributed run, which is what makes the agents exit), otherwise ok
main_job_state() {
  attempt_jobs | jq -r --arg name "$MAIN_JOB_NAME" '
    [.jobs[] | select(.name == $name)][0]
    | if . == null then "missing"
      elif ([.steps[]? | select(.conclusion == "failure")] | length) > 0 or .conclusion == "failure" then "failed"
      elif .status != "completed" then "live"
      else "ok" end'
}
