# RSK Calculators Client

This library provides a stable, typed boundary for RSK's public calculators
API. It covers child benefit, vehicle tax, vehicle benefit, vehicle
depreciation, withholding tax, and interest benefit.

The generated OpenAPI client is an internal transport detail for outputs.
Child benefit, vehicle tax and withholding tax take RSK's own query parameters:
their input type is the generated query type, and their input fields are named
after RSK's parameters. The other calculators still map a curated input
contract to RSK's parameters in their own `input.ts`.

## Design

Each calculator domain owns:

- `definition.ts` declares the input fields and the client-facing output
  contract; spec-driven calculators name inputs after RSK's query parameters,
  with enums as selects.
- `input.ts` (curated calculators only) maps the input contract to RSK query
  parameters.
- `output.ts` maps RSK responses to stable client output.

The client service configures the generated client, exposes calculator
definitions, builds spec-driven queries with `toClientQuery`, and calls the
domain mappers. Shared types describe the contract; the catalog registers
available calculators.

Percentage inputs and outputs are whole percentages (`0-100`). `toClientQuery`
reads the generated zod request schemas and divides any non-integer
parameter bounded `0-1` by 100; curated `input.ts` mappers convert their own.
Output mappers convert RSK's ratios back. Mapped scalar values are optional
rather than `null`; absent arrays are returned as `[]`.

The API is public. It does not require X-Road or authentication.

## Configuration

`RSK_CALCULATORS_BASE_URL` defaults to `https://reiknivelarapi.rsk.is`.

## Update the generated client

```sh
yarn nx run clients-rsk-calculators:update-openapi-document
yarn nx run clients-rsk-calculators:codegen/backend-client
```

Review the OpenAPI snapshot before regenerating the client.

## Test

```sh
yarn nx test clients-rsk-calculators
```
