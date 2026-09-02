# api-domains-tax-calculators

**This module is currently an empty shell. It exposes no GraphQL surface.**

It is intended to serve the input schema for Skatturinn's (RSK) tax
calculators, so the web client can render a generic form rather than
per-calculator UI code.

## Why it is empty

An earlier version exposed:

- `taxCalculatorFields(calculatorType: TaxCalculatorType!): [TaxCalculatorField!]`

backed by a hardcoded field list (`calculators/<name>.fields.ts`, a
`fieldsByCalculatorType` lookup, and `TaxCalculatorField` /
`TaxCalculatorFieldOption` / `TaxCalculatorFieldKind` models). That list was
maintained by hand and did not match RSK's own input contract, so it was
removed in full rather than left to drift further.

The module keeps its NX scaffolding, `TaxCalculatorsModule`, and empty
`TaxCalculatorsResolver` / `TaxCalculatorsService` stubs so it stays wired into
`apps/api` and can be rebuilt in place.

## Rebuilding it

The replacement source is the RSK client library added alongside this module:

- `libs/clients/rsk/calculators/src/lib/inputs/*.inputs.ts` — the real per-calculator
  input definitions (`childBenefit`, `withholdingTax`, `vehicleTax`,
  `vehicleBenefit`, `vehicleDepreciation`, `interestBenefit`)

The field schema should be derived from those rather than restated here.

## What lives elsewhere

- `TaxCalculatorType` is declared in `libs/tax-calculators` (plain TS, shared with
  `apps/web` and `apps/contentful-apps`) and registered with GraphQL by
  `libs/cms/src/lib/models/calculator.model.ts` — **not** by this module.
- Section layout, ordering, conditional visibility and label overrides are
  editor-authored per placement through the `calculator` content type's
  `configJson`. See `libs/tax-calculators/src/lib/calculatorConfig.schema.ts` for
  that schema and `apps/contentful-apps` for the editor. Note that `configJson`
  carries no input contract — a section field is only a `key` referencing a
  backend field — which is why the web slice renders nothing until this module
  is rebuilt.

## Performing a calculation

Not implemented. An earlier version exposed `taxCalculatorCalculation` backed
by per-calculator mappers over the RSK client; it was removed because the
output contract is being redesigned to live in `configJson` alongside the input
sections. The v1 contract — including the RSK response field mappings — is
recorded outside this repo and is deferred until the input flow is finished end
to end.
