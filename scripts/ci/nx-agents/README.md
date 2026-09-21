# Nx Agents pull request pipeline

`.github/workflows/pullrequest.yml` runs the pull request checks as a single
distributed Nx Cloud CI run, on our own runners (`--distribute-on="manual"`).

| Job             | What it does                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`          | `plan.mjs`: resolves labels to one `nx affected`/`run-many` command and sizes the agent pools                                                  |
| `agents`        | `start-agent.sh`: a matrix of agents that execute whatever tasks Nx Cloud hands them                                                           |
| `main`          | `run.sh`: starts the CI run and runs the one Nx command for lint, typecheck, build, test and e2e. Also runs `check-tags` and the license audit |
| `unicorn-tests` | Verifies that the affected unicorn projects have tests                                                                                         |
| `success`       | Collects the result. This is the required status check                                                                                         |

`run-shellcheck`, `formatting` and `lintfix-changed-files` are not Nx tasks (or
push commits to the pull request), so they are regular jobs next to the
distributed run.

## Legacy pipeline

The pipeline from before Nx Agents is still in the workflow as the `legacy-*`
jobs. It runs instead of the distributed one for pull requests with the
`legacy-ci` label, and reports to the same `success` check. Labels are read when
a run is triggered, so push a commit (or close and reopen) after adding the label.

## Agent types and count

There are two types of agents, see `assignment-rules.yaml`:

- `judicial` agents only run tasks of judicial projects (`*judicial*`), 0 to
  `MAX_JUDICIAL_AGENTS`
- `shared` agents run every other task, 0 to `MAX_AGENTS`

An agent gets its type from `NX_AGENT_LAUNCH_TEMPLATE`, and each type can have its
own runner label (`SHARED_RUNNER`, `JUDICIAL_RUNNER`).

`plan.mjs` asks Nx for every task of the command (`--graph`), weighs them
(`TARGET_WEIGHTS`) per agent type and starts one agent per `AGENT_CAPACITY` units.
It counts tasks and not projects since a task without an agent of its type would
leave the run waiting, e.g. a judicial lib that is only built as a dependency.
The count is based on tasks in the run, not on cache misses, so tune the
weights/capacity from the Nx Cloud run data rather than guessing.

## Environment per target

Agents run every kind of target, so environment variables that belonged to one of
the old jobs are written to `.env.<target>` files at the workspace root by
`start-agent.sh` (Nx loads these per task). Do not move them to the job's `env`:
some, like `API_MOCKS`, are compiled into builds and would end up in the shared Nx
cache.

Test flags come from the `ci` configuration (`--configuration=ci`), since CLI args
would be passed to every target in the command.

## Re-running

Use "Re-run all jobs". "Re-run failed jobs" only re-runs the main job, which
would start a CI run without agents, so `check-agents.sh` fails the job right away.
