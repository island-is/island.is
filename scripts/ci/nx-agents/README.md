# Nx Agents pull request pipeline

`.github/workflows/pullrequest-nx-agents.yml` runs the pull request checks as a
single distributed Nx Cloud CI run, on our own runners (`--distribute-on="manual"`).
It is opt-in with the `nx-agents` label while it runs next to `pullrequest.yml`.

| Job       | What it does                                                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`    | `plan.mjs`: resolves labels to one `nx affected`/`run-many` command and sizes the agent pool (1-10)                                            |
| `agents`  | `start-agent.sh`: a matrix of identical agents that execute whatever tasks Nx Cloud hands them                                                 |
| `main`    | `run.sh`: starts the CI run and runs the one Nx command for lint, typecheck, build, test and e2e. Also runs `check-tags` and the license audit |
| `success` | Collects the result                                                                                                                            |

## Agent count

`plan.mjs` counts the projects in the run per target, weighs them (`TARGET_WEIGHTS`)
and starts one agent per `AGENT_CAPACITY` units, clamped to `MIN_AGENTS`..`MAX_AGENTS`.
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

Use "Re-run all jobs". "Re-run failed jobs" on only the main job starts a CI run
without agents, which sits idle until the job times out.
