# RSK Calculators Client

Client for RSK's (Skatturinn) public "Reiknivélar" (calculators) API at
`https://reiknivelarapi.rsk.is`. This is an open lookup API — no X-Road
connection or authentication is required.

## Endpoints

- `getChildBenefit` — child benefit calculation
- `getVehicleTax` — vehicle tax calculation
- `getVehicleBenefit` — vehicle purchase benefit calculation
- `getVehicleDepreciation` — vehicle depreciation calculation
- `getWithholdingTax` — payroll withholding tax calculation
- `getInterestBenefit` — interest deduction benefit calculation

## Input contract

- `getCalculator(key)` — the machine-readable input contract for one
  calculator: its fields, their types, requiredness, numeric semantic, select
  options and simple equality dependencies. Fields come back sorted by `name`
  in code-unit order, so consumers must treat `name` as identity and never
  array position.

A field's `semantic` says what a number means, not what range it may take. RSK
declares no bounds on any numeric parameter, so this library asserts none.

RSK does expect every ratio parameter as a number between 0 and 1 — each is
documented on the wire as "gefið sem tala milli 0 og 1" — and converting to
that is the mapper's job, not the caller's. Note this is a statement about the
wire and about the mapper's obligation, not about what a `percentage` field's
own value looks like. Those differ today, deliberately:

- `pensionFundRatio`, `privatePensionRatio` and `employerPensionMatchRatio` are
  `select` fields whose accepted values are strings like `'4%'`, converted to
  `0.04` by their `toRskValue` tables.
- `taxCardUtilization` and `spouseTaxCardUtilization` are the only fields
  carrying `semantic: 'percentage'`, and their values are forwarded to RSK
  unconverted. The calculator form supplies whole percent, so these two are
  the known gap: the conversion belongs in the mapper alongside `toRskValue`,
  and correcting it was out of scope for the contract rebuild.

So the asymmetry, not a uniform whole-percent convention, is what a reader
needs to know here.

Labels, translations and layout belong downstream — the client authors
identifiers only.

## Configuration

- `RSK_CALCULATORS_BASE_URL` — defaults to `https://reiknivelarapi.rsk.is`

## Generate client code

Fetch the latest OpenAPI spec and regenerate `gen/fetch`:

```
yarn nx run clients-rsk-calculators:update-openapi-document
yarn nx run clients-rsk-calculators:codegen/backend-client
```

## Running unit tests

Run `nx test clients-rsk-calculators` to execute the unit tests via [Jest](https://jestjs.io).
