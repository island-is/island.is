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

## Docker images of feature deployments

`.github/workflows/push.yml` builds the images of a feature deployment the same way: `prepare`
plans (`plan-docker.mjs`), `docker-agents` are the agents and `docker-main` runs one
`nx run-many -t docker-build`. Everything else in that workflow (pre-releases) still builds the
images in a matrix.

- `docker-build` is a target that `tools/nx-plugins/docker-build.js` infers for every project with
  a `docker-*` marker target. It runs `docker-build.sh`, which calls the same `scripts/ci/90_*.sh`
  as the matrix does.
- The target is not cached, so an agent builds one image at a time. It keeps its Docker builder
  between builds, so the layers the images share are built once per agent.
- An image that is already in the registry is not built again. The tag is the same for every
  attempt of a workflow run, so this is what makes re-running jobs cheap.
- Each task writes what it built to `dist/docker-build-data/`, the agent uploads that as an
  artifact and `deploy-feature` merges it (`merge-docker-build-data.mjs`).

The build in a Docker build (`nx build` in `scripts/ci/Dockerfile`) is meant to have the same hash
as the same build on an agent of the pull request pipeline, so it is a cache hit when the pull
request was built first. For that the inputs of a build must be the same in both places: the
node version (`setup-yarn` reads it from package.json), `force-build.mjs` (kept in the build
context by `.dockerignore`), `CI_CONFIG_HASH` (a build arg) and no files that `.dockerignore`
leaves out (see `production` in nx.json).

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

Use "Re-run all jobs". "Re-run failed jobs" only re-runs the main job and the agents
that were lost, and a run without all of its agents can wait forever (e.g. for a
judicial agent), so `check-agents.sh` fails the job right away.

One lost agent (e.g. a runner that is shut down) fails the whole distributed run.
