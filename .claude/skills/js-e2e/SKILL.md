---
name: js-e2e
description: Run the judicial-system Playwright e2e suite locally against a production build and diagnose failures from the traces. Use when asked to run, rerun or debug the judicial-system e2e tests, or when a change touches apps/system-e2e/src/tests/judicial-system. Takes an optional spec path or filter as argument.
---

# Judicial-system e2e

The suite lives in `apps/system-e2e/src/tests/judicial-system` and is timed for a
production build of the web app. Against a dev server Next compiles every route on
first visit, which blows the 15s request waits and makes the suite look flaky.
The Playwright config handles the production build itself - your job is the
preconditions, the run, and reading the result honestly.

## 1. Preconditions

Check all of these before running. Fix what is fixable, report the rest.

- **Backend, api and database up**: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3344/liveness`
  and the same on `:3333` both return 200, and `docker ps` lists `db_judicial_system`.
  If not, tell the user which one is down - do not start their services for them.
- **Migrations applied**: in `apps/judicial-system/backend`, run
  `../../../node_modules/.bin/sequelize-cli db:migrate:status` and apply with
  `db:migrate` if any line says `down`. A stale schema makes every CreateCase
  return 500 "column ... does not exist".
- **Seeders run**: `yarn nx run judicial-system-backend:seed`. It is idempotent.
  It puts the e2e defender `0909090909` in `lawyer_registry`; without it the
  defender login redirects to `/?villa=innskraning-ekki-notandi`.
- **Port 4200**: `lsof -nP -iTCP:4200 -sTCP:LISTEN`. If a dev server
  (`nx serve judicial-system-web`) holds it, ask the user to stop it and wait.
  The suite must run on 4200 (the dev S3 upload bucket only allows that origin)
  and a dev server there would be reused, which brings the compile stalls back.
  Do not kill the user's processes yourself.

## 2. Run

```bash
yarn playwright test -c apps/system-e2e/src --project judicial-system --reporter=line,json $ARGUMENTS
```

Set `PLAYWRIGHT_JSON_OUTPUT_NAME` to a file in your scratchpad so the JSON report
is readable afterwards. With nothing on 4200 the config runs
`nx build:production` (fast on an nx cache hit, about two minutes cold) and
serves `dist/apps/judicial-system/web/main.js` with `ENABLE_LOCAL_PROXY`,
and `MOCK_NATIONAL_REGISTRY`, then shuts it down.
A full run is about five minutes. Run it in the background and watch the log.

Do not pass `--workers`; the config pins one worker because the specs share
one database. Do not rerun a failed suite hoping it passes - find out why first.

## 3. Read failures from the traces

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

| Symptom                                                         | Cause                                                                                                                                                                                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GraphQL operation X returned errors: Internal server error`    | backend 500 - usually pending migrations; reproduce with curl against `localhost:4200/api/graphql` and read `extensions.problem.detail`                                                                                                     |
| login GET redirects to `/?villa=innskraning-ekki-notandi`       | user not eligible - for the defender, the `lawyer_registry` seed is missing                                                                                                                                                                 |
| `page.waitForResponse: Timeout` right after an action           | either the action did not fire the request (button still disabled - check the DOM state) or the wait was satisfied earlier by a response already in flight from a previous action; `verifyRequestCompletion` matches on operation name only |
| `page.goto` / chunk requests taking 5-30s                       | the server on 4200 is a dev server; see preconditions                                                                                                                                                                                       |
| upload `POST` to `*.s3.eu-west-1.amazonaws.com` never completes | wrong origin - the server is not on port 4200                                                                                                                                                                                               |

## 4. Report

Give pass/fail/skipped counts, the run time, and for each failing file the first
failing test, its root cause in one sentence, and whether it is the test, the
app, or the environment. Point at the file and line. If you changed anything to
get the suite running (applied migrations, ran seeders), say so.
