# clients-fjarskiptastofa-self-assessment

X-Road client for Fjarskiptastofa's (Electronic Communications Office) NIS2
self-assessment API.

X-Road service (dev): `IS-DEV/GOV/10100/Fjarskiptastofa-Protected/assessment-v1`

Configured through `XROAD_FJARSKIPTASTOFA_SELF_ASSESSMENT_PATH` (see the
`FjarskiptastofaSelfAssessment` X-Road config in `infra/src/dsl/xroad.ts`), and
wired into both `api` and `application-system-api`.

## Operations

`isRegulated`, `getQuestionCategories`, `getQuestions` and `submitAnswers`, used
by the Fjarskiptastofa self-assessment application template.

## Logging

The self-assessment answers are confidential, so the client sets
`logErrorResponseBody: false` and wraps the logger in `redactProblemBody`, which
drops the `problem` field of `problem+json` error responses. Fjarskiptastofa
quotes the offending fields in validation problems, so the answers could
otherwise reach the logs that way.

## Updating the OpenAPI document

Requires a running local X-Road security server (proxied at `localhost:8081`):

```sh
nx run clients-fjarskiptastofa-self-assessment:update-openapi-document
```

## Regenerating the client

```sh
nx run clients-fjarskiptastofa-self-assessment:codegen/backend-client
```

## Running unit tests

Run `nx test clients-fjarskiptastofa-self-assessment` to execute the unit tests
via [Jest](https://jestjs.io).
