# Nx Agents pull request pipeline

`.github/workflows/pullrequest.yml` runs the pull request checks as a single
distributed Nx Cloud CI run, on our own runners (`--distribute-on="manual"`).

| Job       | What it does                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`    | `plan.mjs`: resolves labels to one `nx affected`/`run-many` command and sizes the agent pools                                                |
| `agents`  | `start-agent.sh`: a matrix of agents that execute whatever tasks Nx Cloud hands them                                                         |
| `main`    | `run.sh`: the quick workspace checks, then the one Nx command for lint, typecheck, build, test and e2e                                       |
| `autofix` | Shellcheck, then `lint --fix` and `format:write` which are pushed to the pull request as one commit. Needs no other job, so it reports early |
| `success` | Collects the result and comments it on the pull request. This is the required status check, and how `ci-io.ts` finds the last good run       |

If the pipeline itself is broken, revert the change that broke it: a pull request
runs the workflow of its own branch, so the revert is checked by the pipeline it restores.

## Failing early

`run.sh` starts with the checks that take seconds and need no agent (`check-tags`,
the license audit and `check-unicorn-tests.sh`). If one of them fails the main job
fails right away and the agents are stopped, instead of reporting it when the
distributed run is done.

## Comments on the pull request

`pr-comment.mjs` keeps two comments up to date, instead of adding new ones:

- The result: set to running by `plan`, and to the result by `success`. On a failure
  it lists the failed checks of `run.sh` and the failed Nx tasks (`failed-tasks.mjs`
  finds them in the output of the Nx command).
- What `autofix` pushed, if anything: the commit and the files changed by lint and format.

## Agent types and count

There are two types of agents, see `assignment-rules.yaml`:

- `judicial` agents only run tasks of judicial projects (`*judicial*`), 0 to
  `MAX_JUDICIAL_AGENTS`
- `shared` agents run every other task, 0 to `MAX_AGENTS`

An agent gets its type from `NX_AGENT_LAUNCH_TEMPLATE`, and each type can have its
own runner label (`SHARED_RUNNER`, `JUDICIAL_RUNNER`).

`plan.mjs` asks Nx for every task of the command (`--graph`), weighs them
(`TARGET_WEIGHTS`) per agent type and starts one agent per `capacity` units of the type.
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
