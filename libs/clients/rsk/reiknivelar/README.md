# RSK Reiknivélar Client

Client for RSK's (Skatturinn) public "Reiknivélar" (calculators) API at
`https://reiknivelarapi.rsk.is`. This is an open lookup API — no X-Road
connection or authentication is required.

## Endpoints

- `getBarnabaetur` — child benefit calculation
- `getBifreidagjold` — vehicle tax calculation
- `getBifreidahlunnindi` — vehicle purchase benefit calculation
- `getFyrningOkutaekja` — vehicle depreciation calculation
- `getStadgreidsla` — payroll withholding tax calculation
- `getVaxtabaetur` — interest deduction benefit calculation

## Configuration

- `REIKNIVELAR_BASE_URL` — defaults to `https://reiknivelarapi.rsk.is`

## Generate client code

Fetch the latest OpenAPI spec and regenerate `gen/fetch`:

```
yarn nx run clients-rsk-reiknivelar:update-openapi-document
yarn nx run clients-rsk-reiknivelar:codegen/backend-client
```

## Running unit tests

Run `nx test clients-rsk-reiknivelar` to execute the unit tests via [Jest](https://jestjs.io).
