# clients-fjarskiptastofa-self-assessment

X-Road client for Fjarskiptastofa's (Electronic Communications Office) NIS2
self-assessment API.

X-Road service (dev): `IS-DEV/GOV/10100/Fjarskiptastofa-Protected/assessment-v1`

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
