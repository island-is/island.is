---
name: js-e2e-standalone
description: Run the judicial-system Playwright e2e suite locally against a production build, on its own backend, api and message handler started on free ports, after pulling, installing, migrating, generating and seeding the checkout, and diagnose failures from the traces. Use when the user asks for js-e2e-standalone, or for an e2e run that prepares the checkout itself or leaves a stack they already have running untouched. For a run against the stack the user already runs on the default ports, use js-e2e instead. Takes an optional spec path or filter as argument.
---

# Judicial-system e2e, standalone

This is the self-contained alternative to the `js-e2e` skill. `js-e2e` runs the
suite against the backend and api the user already has up on the default ports
and serves the web app on 4200. This skill prepares the checkout and starts a
stack of its own on free ports, so it can run beside the user's stack.

The suite lives in `apps/system-e2e/src/tests/judicial-system` and is timed for a
production build of the web app. Against a dev server Next compiles every route on
first visit, which blows the 15s request waits and makes the suite look flaky.
The Playwright config handles the production build itself - your job is the
preconditions, an up-to-date checkout, the services, the run, and reading the result honestly.

Each run gets its own backend, api, message handler and web app on ports you
pick, so
it tests this checkout's code and does not disturb a stack the user already
has on the default ports. The database, the SQS localstack and Redis are
shared docker containers and stay where they are.

## 1. Preconditions

Check all of these first. Fix what is fixable, report the rest.

- **Docker services up**: `docker ps` lists `db_judicial_system`, a localstack
  publishing 4566 and `redis_cluster`. If one is missing, tell the user which -
  `yarn dev-services judicial-system-backend` and
  `yarn dev-services judicial-system-message-handler` start them.
- **The database on 5432 is the local container**: `docker port db_judicial_system 5432/tcp`
  must report host port 5432. `sequelize.config.js` hardcodes `localhost:5432`
  for development, so whatever holds that port is what `db:migrate` and the
  seeders write to - and `yarn proxies db` forwards it to the dev cluster.
  Only one thing can bind the port, so the container publishing it is proof
  the local database is the target. If the command prints nothing or a
  different host port, stop and tell the user; never run `db:migrate` or
  `:seed` on a guess.

- **AWS credentials valid**: the backend signs every file upload with them,
  and without them S3 answers `403` and every test that uploads fails. They
  come from the `judicial-system-dev` profile in `~/.aws/config` (the dev
  account's `AWSPowerUserAccess` role), over the `island-is` SSO session. Check with
  `aws sts get-caller-identity --profile judicial-system-dev`. A session lasts a
  few hours, so check it again before a rerun later in the same session. If it fails,
  the session has expired: run `aws sso login --sso-session island-is` -
  inside Herdr in a pane named `aws-sso-login` - and tell the user a browser
  tab is waiting for their approval. Wait for it, then check again. If the
  profile itself is missing, stop and tell the user; do not invent one, and
  never guess at account ids or role names.

## 2. Update and prepare the checkout

Always do this before starting any service, in this order, from the repo root.
Each step must succeed before the next; if one fails, stop and report its
output - do not start services or run tests on a half-prepared checkout.

Inside Herdr (`$HC_TERMINAL_ID` is set) the user must be able to watch these
run: start each one in a pane named `e2e-prepare`, the same way the services
are started in step 3, and wait for it with `~/.local/bin/hc wait e2e-prepare`
(its exit code is the result; `hc read e2e-prepare --lines 40` shows the
output). A name is free again as soon as its terminal has finished. Never run them as a hidden background command there.

1. **Pull**: `git pull --ff-only`. If git refuses - local changes in the way,
   a diverged branch, no upstream - stop and tell the user. Never stash,
   reset, rebase or merge to make it go through.
2. **Install**: `yarn`
3. **Migrate**: `yarn nx run judicial-system-backend:migrate` - only after the
   database precondition above holds. A stale schema makes every CreateCase
   return 500 "column ... does not exist".
4. **Court client**: `yarn nx run judicial-system-court-client:codegen/backend-client --skip-nx-cache`.
   Its output is not committed, and without it the backend build fails with
   "Cannot find module '../../gen/fetch'".
5. **Api schema**: `yarn nx run judicial-system-api:codegen/backend-schema --skip-nx-cache`
6. **Web client**: `yarn nx run judicial-system-web:codegen/frontend-client --skip-nx-cache` -
   after the api schema, which it is generated from.
7. **Seed**: `yarn nx run judicial-system-backend:seed`. It is idempotent.
   It puts the e2e defender `0909090909` in `lawyer_registry`; without it the
   defender login redirects to `/?villa=innskraning-ekki-notandi`.

Generate only these judicial-system targets. Never run the repo-wide
`yarn codegen`, or `codegen/backend-schema` for any other project, as part of
a run. The one thing that leaves uncovered is a checkout that has never been
generated at all: the web build then fails on "Cannot find module
'./lib/schema'" in `libs/api/schema`, a file only the repo-wide codegen
produces. If `libs/api/schema/src/lib/schema.ts` is missing, stop and tell
the user that the checkout needs a one-time `yarn codegen` - it is theirs to
run.

## 3. Start the services

Start a backend, an api and a message handler for this run. Leave anything the
user already has running alone - it is on other ports and you do not need it.

**Pick the ports.** From the repo root:

```bash
PORT_ASSIGNMENTS=$(node apps/judicial-system/.claude/skills/js-e2e-standalone/pick-ports.mjs) || exit 1
eval "$PORT_ASSIGNMENTS"
QUEUE=e2e-message-queue-$BACKEND_PORT
```

If the script fails, stop there - `eval` on its empty output would succeed and
leave the ports unset.

That sets `BACKEND_PORT`, `API_PORT`, `MESSAGE_HANDLER_PORT` and `WEB_PORT` to
random free ports. `WEB_PORT` is for the web app, which you do not start
yourself - Playwright does, in step 4. It reserves a pair for each, because the backend and api also open a
metrics server on `PORT + 1`. Shell state does not carry between your tool
calls, so note the five values and write them out literally from here on.

**Wire them together.** These are the only settings that connect the services:

| Service         | Command                                         | Environment                                                                                                                                                                                            |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| backend         | `yarn nx serve judicial-system-backend`         | `AWS_PROFILE=judicial-system-dev PORT=$BACKEND_PORT SQS_QUEUE_NAME=$QUEUE CLIENT_URL=http://localhost:$WEB_PORT`                                                                                       |
| api             | `yarn nx serve judicial-system-api`             | `PORT=$API_PORT BACKEND_URL=http://localhost:$BACKEND_PORT AUTH_IDS_REDIRECT_URI=http://localhost:$WEB_PORT/api/auth/callback/identity-server AUTH_IDS_LOGOUT_REDIRECT_URI=http://localhost:$WEB_PORT` |
| message handler | `yarn nx serve judicial-system-message-handler` | `PORT=$MESSAGE_HANDLER_PORT BACKEND_URL=http://localhost:$BACKEND_PORT SQS_QUEUE_NAME=$QUEUE`                                                                                                          |

The web port appears on the backend and api because they send the browser
back to the web app: the backend in the links it puts in notifications, the
api when a user logs out. Left at their defaults those point at
`localhost:4200`, which is another stack or nothing.

The queue name matters as much as the urls: the backend hands work to the
message handler over SQS, and the default queue is shared with any other local
stack. With the default name another stack's message handler takes this run's
messages and delivers them to its own backend. A queue that does not exist is
created on first use.

**Start them where the user can see them.** Start all three at once.

- Inside Herdr (`$HC_TERMINAL_ID` is set): one pane each, in the user's tab.
  Read the tab with `~/.local/bin/hc get $HC_TERMINAL_ID --json`
  (`labels["herdr.space"]`, `labels["herdr.tab"]`), then for each service:

  ```bash
  ~/.local/bin/hc run --bg --name e2e-backend --cwd <repo root> \
    --label herdr.space=<space> --label herdr.tab=<tab> \
    -- zsh -ic 'AWS_PROFILE=judicial-system-dev PORT=<backend port> SQS_QUEUE_NAME=<queue> CLIENT_URL=http://localhost:<web port> yarn nx serve judicial-system-backend'
  ```

  The `zsh -ic` wrapper is required: Herdr's own environment has no nvm on its
  `PATH`, so a bare `yarn` fails with "cannot start yarn: No such file or
  directory".

  Name them `e2e-backend`, `e2e-api` and `e2e-message-handler`. Without the
  two labels the terminal runs but stays hidden. Read a service's log with
  `~/.local/bin/hc read <name> --lines 100`.

- Outside Herdr: run each as a background command, with its output going to a
  log file in your scratchpad.

**Wait until they answer.** Every service has a `/liveness` route:

```bash
curl -s -o /dev/null -w '%{http_code}' --retry 90 --retry-delay 2 --retry-connrefused \
  http://localhost:<port>/liveness
```

All three must return 200 before you run anything - read each result; the
command exits 0 even when it gives up and prints `000`. The first build of each
takes a few minutes on a cold nx cache, which can outlast the three-minute
wait. So after a `000`, read the service's log before calling it failed: if it
is still compiling, run the same wait again. Any other code (a 404, a 401)
comes back at once and is not retried - read the log for that too. If one
never comes up, report the error from its log - do not run the suite against
a partial stack.

Then send one real request through the whole stack, twice:

```bash
curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' \
  "http://localhost:<api port>/api/auth/login?nationalId=9999999999"
```

It must answer `302`. It proves the api reaches the backend and the backend
the database, and it takes the first-request slowness of a freshly started
service out of the run, where it can trip the suite's 15s waits.

**Note the pids.** Now that the services are up, record which process holds
each of their ports:

```bash
ps -o pid=,lstart=,command= -p "$(lsof -nP -t -iTCP:<port> -sTCP:LISTEN)"
```

Run it for the backend, api and message handler ports and for `PORT + 1` of
the backend and api. Each must be a node process running that service from
this checkout's `dist/`, started after you started the services. Note its pid
and start time next to the port; step 6 uses the pair to tell a process this
run started from one that took the port later. If a listener is anything
else, another process took the port between the pick and the start: do not
note it, stop your services and start over from the port pick.

## 4. Run

**Check the web port is still free.** Nothing has held it since step 3, and
the services took minutes to start. On a port other than 4200 the config
never reuses a server that is already there, so if something took the port in
the meantime Playwright fails at startup rather than test the wrong app. Check
first, for both the web port and the one above it:

```bash
lsof -nP -iTCP:<web port> -sTCP:LISTEN; lsof -nP -iTCP:<web port + 1> -sTCP:LISTEN
```

Both must print nothing. If either lists a listener, run `pick-ports.mjs` again
and take only its `WEB_PORT`. The backend and api have the old web port in
`CLIENT_URL` and the `AUTH_IDS_*` urls, so restart those two with the new value.
Then repeat the end of step 3 for them: wait for `/liveness`, send the login
request twice and require `302`, and note the pid and start time for both
ports of each. The restarted processes are cold, and the pids from before the
restart belong to processes that are gone - step 6 goes by the current ones.

```bash
PLAYWRIGHT_JSON_OUTPUT_NAME=<scratchpad>/e2e-report.json \
JUDICIAL_SYSTEM_WEB_PORT=<web port> INTERNAL_API_URL=http://localhost:<api port> \
  yarn playwright test -c apps/system-e2e/src --project judicial-system --reporter=line,json $ARGUMENTS
```

Both variables are required:

- `JUDICIAL_SYSTEM_WEB_PORT` is where the config serves the web app and where
  the tests look for it. Without it both fall back to 4200, where the config
  reuses a server that is already listening - so if the user has anything on
  4200 the suite silently runs against that instead of this checkout. On any
  other port it does not reuse: if the port is taken, Playwright stops with
  "already used" before any test runs. Pick a new web port as above and run
  again.
- `INTERNAL_API_URL` points that web app at your api: it proxies `/api` there
  and uses it for its own server-side calls. Without it the web app falls
  back to `localhost:3333`.

The dev S3 upload bucket only allows the `localhost:4200` origin. On any other
port the config starts the browser with `--disable-web-security`, which turns
off its CORS checks so uploads still reach S3. Nothing to do about it, but say
in the report that the run used it.

`PLAYWRIGHT_JSON_OUTPUT_NAME` keeps the JSON report in a file you can read
afterwards rather than on stdout. The config runs
`nx build:production` (fast on an nx cache hit, about two minutes cold) and
serves `dist/apps/judicial-system/web/main.js` with `ENABLE_LOCAL_PROXY`,
and `MOCK_NATIONAL_REGISTRY`, then shuts it down.
A full run is about five minutes. Run it in the background and watch the log.

Do not pass `--workers`; the config pins one worker because the specs share
one database. Do not rerun a failed suite hoping it passes - find out why first.
Once you have read the traces, rerunning only the failing files once is fair:
it tells an intermittent failure from one that repeats, and the report should
say which is which.

## 5. Read failures from the traces

Every spec is `describe.serial`, so one failure skips the rest of its file; the
first failure per file is the one that matters. For each, unzip
`apps/system-e2e/src/dist/test-results/<test-dir>/trace.zip` into your
scratchpad and read:

- `0-trace.network`: one JSON line per request with `startedDateTime`, `time`
  and the response status. GraphQL bodies are in `request.postData.text` or,
  when large, in `resources/<sha1>`; the `operationName` tells you which
  mutation or query it was.
- `0-trace.trace`: the actions (`type: before/after`, `apiName`, selector) with
  timestamps, and the error on the failing action.

Common causes, in the order to check them:

| Symptom                                                                    | Cause                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GraphQL operation X returned errors: Internal server error`               | backend 500 - usually pending migrations; reproduce with curl against `localhost:<web port>/api/graphql` and read `extensions.problem.detail`                                                                                                   |
| login GET redirects to `/?villa=innskraning-ekki-notandi`                  | user not eligible - for the defender, the `lawyer_registry` seed is missing                                                                                                                                                                     |
| `page.waitForResponse: Timeout` right after an action                      | either the action did not fire the request (button still disabled - check the DOM state) or the wait was satisfied earlier by a response already in flight from a previous action; `verifyRequestCompletion` matches on operation name only     |
| `page.goto` / chunk requests taking 5-30s                                  | `JUDICIAL_SYSTEM_WEB_PORT` was not set, so the run fell back to 4200 and reused a dev server there - check what listens on it                                                                                                                   |
| upload `POST` to `*.s3.eu-west-1.amazonaws.com` returns 403                | read the XML body in `resources/`: `InvalidAccessKeyId` or `ExpiredToken` - the backend has no valid AWS credentials, see preconditions; `AccessDenied ... s3:PutObject` - the credentials are valid but their role may not write to the bucket |
| upload `POST` to `*.s3.eu-west-1.amazonaws.com` blocked or never completes | CORS - the web app is not on 4200 and the browser was not started with `--disable-web-security`; check `judicialSystemBrowserArgs` in the Playwright config                                                                                     |

A request that fails in the browser is usually explained in a service log:
backend errors in `e2e-backend`, anything queued (notifications, deliveries to
court or police) in `e2e-message-handler`. Read them before stopping anything.

## 6. Stop the services

Once you have what you need from the logs, stop the three services you
started: `~/.local/bin/hc kill <name>` in Herdr, otherwise stop the background
commands. Stop only those - never a process you did not start.

Then check every port of the run with `lsof -nP -iTCP:<port> -sTCP:LISTEN`:
the four you picked and `PORT + 1` of the backend, api and web app (each
opens a metrics server there). Stopping
`nx serve` can leave its node child behind, still holding the port. The
message handler also takes up to ten seconds to let go of its port while it
finishes its last queue poll, so check again after that before deciding a
listener was left behind. If a
listener remains, run the `ps` command from step 3 on it and compare its pid
and start time with the pair you noted for that port. When both match it is
yours - stop it with `kill <pid>` and check again. When either differs, or
you have nothing noted for the port, leave it alone and report it with its
command: a process from this checkout on one of your ports is not proof that
this run started it. Playwright shuts the web app down itself.

If the user asked to keep the stack up, leave it and tell them the ports.

## 7. Report

Give pass/fail/skipped counts, the run time, and for each failing file the first
failing test, its root cause in one sentence, and whether it is the test, the
app, or the environment. Point at the file and line. Name the ports the run used and the commit the run tested, and say whether
the pull brought in new commits or the migrate step applied any migrations.
