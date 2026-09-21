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

- `getCalculator(key)` — the machine-readable contract for one calculator, both
  halves: `inputFields` and `outputFields`. An input field carries its type,
  requiredness, numeric semantic, select options and simple equality
  dependencies. Fields come back sorted by `name` in code-unit order, so
  consumers must treat `name` as identity and never array position.

A field's `semantic` says what a number means, not what bounds it may take. RSK
declares no bounds on any numeric parameter, so this library asserts none. It
does assert a _scale_ for one semantic: a `percentage` input is whole percent,
so `37` means 37%.

RSK itself expects every ratio parameter as a number between 0 and 1 — each is
documented on the wire as "gefið sem tala milli 0 og 1" — and converting to
that is the mapper's job, not the caller's. Every ratio is converted, in two
shapes:

- `pensionFundRatio`, `privatePensionRatio` and `employerPensionMatchRatio` are
  `select` fields whose accepted values are strings like `'4%'`, converted to
  `0.04` by their `toRskValue` tables.
- `taxCardUtilization` and `spouseTaxCardUtilization` are the only fields
  carrying `semantic: 'percentage'`, and their whole-percent values are divided
  by 100 through `percentToRskRatio`.

The two shapes stay separate on purpose. The select tables validate option
identity over a curated, non-contiguous set — `employerPensionMatchRatio` skips
11% between 10.5% and 11.5%, because the set is negotiated per collective
agreement rather than arithmetic. Expressing them as division would invite
parsing the string and silently accepting rates RSK does not offer.

So a caller passes whole percent everywhere, and the mapper owns every
conversion to RSK's wire scale.

Labels, translations and layout belong downstream — the client authors
identifiers only.

## Output contract

`getCalculator(key).outputFields` describes the curated result of a calculator:
which values it publishes, of what type, and what a number means. Output keys
are stable English client names — never RSK response property names — because
downstream layers store and reference them.

An output field is either a scalar or an array:

- a scalar field has `kind: 'scalar'`, a `type`, and a `semantic` when a number
  means currency, a percentage, a year, a month or a count
- an array field has `kind: 'array'` and inline `itemFields`, all scalars.
  `withholdingTax.taxBrackets` is the only one today

Output fields have no `required`. Requiredness tells a caller what it must
submit; on output there is nothing to act on, and RSK's own omissions are
carried by the mapped value instead. Output fields carry no layout, labels or
grouping, and no nested object groups — `vehicleTax`'s `fyrraTimabil` and
`seinnaTimabil` period breakdowns are deliberately outside the contract.

`outputFields` and array `itemFields` are sorted by `name` in code-unit order,
like input fields. Order carries no meaning.

## Mapped results

The six calculation methods return the curated output, not the generated RSK
shape:

```text
RSK response
  -> per-calculator response mapper
  -> curated <Calculator>Output
```

Each returns `<Calculator>Output | undefined` — `undefined` only when the
generated client produced no `data` at all.

A mapped result never contains `null`. Scalar properties are optional and are
`undefined` when RSK returned `undefined` or `null`; array properties are
always arrays and fall back to `[]`. Callers therefore need one absence check,
not two.

The generated `Get*Response` types are no longer exported. They are internal
wire shapes.

The public contract uses whole percentages (`0-100`) on both sides of the
boundary. RSK wire ratios use `0-1`, so input mappers divide by 100 and output
mappers multiply by 100. This applies to `appliedPensionFundRatio`,
`withholdingRate`, `reductionRate`, and the interest-benefit reduction rates.

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
