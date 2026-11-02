# RSK Kilometragjald Reimbursement Client

Client for Skatturinn's `Kilometragjald-reimbursement` service, used by the
`temporary-vehicle-export` application template to submit a trip abroad as a
basis for the kilometre fee exemption.

The multipart submit endpoint is called by hand in
`RskKilometragjaldReimbursementClient.submitApplication`, as the generated
client can not send multipart bodies through node-fetch. The generated client
is used for the models and the `GET` endpoint.

## Updating the OpenAPI document

Requires an X-Road proxy on `localhost:8081` (`yarn proxies xroad`) and `jq`.

```bash
yarn nx run clients-rsk-kilometragjald-reimbursement:update-openapi-document
yarn nx run clients-rsk-kilometragjald-reimbursement:codegen/backend-client
```

## Running unit tests

Run `nx test clients-rsk-kilometragjald-reimbursement` to execute the unit tests via [Jest](https://jestjs.io).
