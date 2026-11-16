# RSK Calculators Client

Typed client for RSK's public calculators API: child benefit, interest
benefit, vehicle benefit, vehicle depreciation, vehicle tax and withholding
tax. The API is public. It does not require X-Road or authentication.

## Design

The client passes RSK's API through as the generated spec describes it. Input
and output keys are RSK's own, and an RSK spec update is a regenerate.

- `client/calculators.registry.ts` holds each calculator's generated zod
  request query and response schemas.
- `contract/toInputFields` and `contract/toOutputFields` derive a calculator's
  contract (`getCalculator(key)`) from those schemas. Enums become selects,
  date-time strings become dates, number fields carry `integer`, `minimum`,
  `maximum` and `defaultValue` as given. Schemas the contract can't describe
  are skipped. Output fields are `scalar`, `array` or `object`; arrays and
  objects carry scalar `itemFields`.
- `contract/numberSemantic` labels a number `percentage` when it is a ratio,
  otherwise `currency`.
- `client/toClientQuery` builds a request query from input values, and
  `validateInput(key, input)` checks it against the generated schema,
  returning the failing field names.
- `client/fromClientResult` converts a response's ratios to percentages.

`*Input` and `*Output` types are the generated query and result types.

Percentages are whole percentages (`0-100`) on both sides. A ratio is a
non-integer number the generated schema bounds to `0-1` (`utils/isRskRatio`):
`toClientQuery` divides ratio inputs by 100, and `fromClientResult` multiplies
ratio outputs by 100. Contract bounds and defaults of ratio fields are in
percent too. A ratio RSK leaves unbounded in its spec is not detected.

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
