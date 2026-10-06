# RSK Calculators Client

This library provides a stable, typed boundary for RSK's public calculators
API. It covers child benefit, vehicle tax, vehicle benefit, vehicle
depreciation, withholding tax, and interest benefit.

The generated OpenAPI client is an internal transport detail. Consumers use the
client service and curated calculator contracts instead of generated RSK types
or Icelandic wire-property names.

## Design

Each calculator domain owns three responsibilities:

- `definition.ts` declares the client-facing input and output contract.
- `input.ts` maps that contract to RSK query parameters.
- `output.ts` maps RSK responses to stable client output.

The client service configures the generated client, exposes calculator
definitions, and calls the domain mappers. Shared types describe the contract;
the catalog registers available calculators.

Inputs and outputs use whole percentages (`0-100`). Domain mappers convert to
and from RSK's `0-1` wire ratios. Mapped scalar values are optional rather than
`null`; absent arrays are returned as `[]`.

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
