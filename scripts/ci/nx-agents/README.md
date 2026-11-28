# Nx Agents pull request pipeline

`.github/workflows/pullrequest.yml` runs the pull request checks as a single
distributed Nx Cloud CI run, on our own runners (`--distribute-on="manual"`).

| Job       | What it does                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`    | `plan.mjs`: resolves labels to one `nx affected`/`run-many` command and sizes the agent pools                                                |
| `agents`  | `start-agent.sh`: a matrix of agents that execute whatever tasks Nx Cloud hands them                                                         |
| `main`    | `run.sh`: the quick workspace checks, then the one Nx command for lint, typecheck, build, test and e2e                                       |
| `autofix` | Shellcheck, then `format:write` and `lint --fix`. Fixes are pushed to the pull request, format first since it takes seconds and a push restarts the pipeline. Needs no other job, so it reports early |
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

## Changes to the CI configuration

The CI configuration (`.github/workflows/`, `.github/actions/` and `scripts/ci/`) is not an
input of any Nx task, so changing it does not invalidate the Nx cache or make every app
affected on `main`.

A pull request that changes it sets `CI_CONFIG_HASH` (`../ci-config-hash.mjs`), which is an input of
every task (`sharedGlobals` in `nx.json`). `plan.mjs` then runs every task of every project, and with
hashes of their own they are not cache hits. That tests the change for real, and keeps the results
out of the cache of everything else in case the change breaks the environment the tasks run in.
Pushing again without changing the CI configuration gives the same hash, and cache hits.

The build and deploy pipeline does the same for feature deployments: every image is built, and
the hash is passed to the Nx build in the Docker build (`CI_CONFIG_HASH` build arg).

To rebuild everything everywhere, e.g. after changing the `Dockerfile`, change
`.github/actions/force-build.mjs`.

## Feature deployments

With the `deploy-feature` label the pull request pipeline only has its `autofix` and `success` jobs.
`.github/workflows/push.yml` deploys the feature and runs the checks, as one distributed run:
`prepare` plans (`plan.mjs` with `PLAN_MODE=deploy`), `docker-agents` are the agents and
`docker-main` runs two Nx commands at the same time (`run.sh`):

- lint, typecheck, test and e2e, like the pull request pipeline
- `docker-build` for the images, which depends on `build`

They are two commands because they need two configurations: `ci` for the tests, and `production`
for the builds (see below). The feature is only deployed when both succeed, and when one of them
fails the other one is stopped. Everything else in that workflow (pre-releases) still builds the
images in a matrix.

- `docker-build` is a target that `tools/nx-plugins/docker-build.js` infers for every project with
  a `docker-*` marker target. It runs `docker-build.sh`, which calls the same `scripts/ci/90_*.sh`
  as the matrix does.
- The target is not cached, so an agent builds one image at a time. It keeps its Docker builder
  between builds, so the layers the images share are built once per agent.
- An image that is already in the registry is not built again (`docker-build.sh`). Either with the
  tag of this run, which is the same for every attempt of a workflow run, so re-running jobs is
  cheap. Or with a tag from the hash of the task (`nx-<hash>`) from an earlier run: that image gets
  the tag of this run, which takes seconds. The services a feature deployment adds to what is
  affected rarely change, so they are rarely built. Such an image has the commit and branch it was
  built from in its environment (`GIT_COMMIT_SHA`, `DD_GIT_*`), everything else is the same.
- Each task writes what it built to `dist/docker-build-data/`, the agent uploads that as an
  artifact and `deploy-feature` merges it (`merge-docker-build-data.mjs`), which fails if an
  image is missing.

The build in a Docker build (`nx build <project> --prod` in `scripts/ci/Dockerfile`) has the same
hash as the build `docker-build` depends on, so in there it is a cache hit and the Docker build
only packages. For that the task and its inputs must be the same in both places: the `production`
configuration (the second command), the node version (`setup-yarn` reads it from package.json),
`force-build.mjs` (kept in the build context by `.dockerignore`), `CI_CONFIG_HASH` (a build arg)
and no files that `.dockerignore` leaves out (see `production` in nx.json).

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

"Re-run all jobs" always works, and is cheap: what was done is a cache hit.

"Re-run failed jobs" only re-runs the jobs that failed, which is handled like this:

- An agent that is still part of the run when it fails, fails with it (`start-agent.sh`). An agent
  that had no tasks left does not. So the failed jobs are the main job and the agents that are
  needed for what is left: all of them when the run failed early, a few when a test failed at the end.
- The main job continues with the agents that were re-run (`check-agents.sh`).
- An agent that is re-run without the main job (it was lost, but the run went on and succeeded)
  has nothing to do and exits.

`.github/workflows/retry-lost-runners.yml` re-runs a pipeline as a whole when a job was lost
with its runner.
