# tax-calculators

GraphQL domain module exposing a generic, schema-driven contract for tax and
benefit calculators, backed by RSK's (Skatturinn) public "Reiknivélar"
calculators API via `@island.is/clients/rsk/calculators`. Exposes a single
generic contract that powers one shared web calculator connected component
instead of a bespoke query per calculator.

## Calculators

- `WITHHOLDING_TAX_ON_WAGES` — payroll withholding tax (Staðgreiðsla)
- `CHILD_BENEFIT` — child benefit (Barnabætur)
- `VEHICLE_TAX` — vehicle tax (Bifreiðagjöld)
- `VEHICLE_BENEFIT` — vehicle benefit (Bifreiðahlunnindi)
- `VEHICLE_DEPRECIATION` — vehicle depreciation (Fyrning ökutækja)
- `INTEREST_BENEFIT` — mortgage interest benefit (Vaxtabætur)

## GraphQL API

- `taxCalculatorFields(calculatorType: TaxCalculatorType!): [TaxCalculatorField!]` —
  returns the dynamic form schema (field key, label, kind, options, bounds)
  for the given calculator type. The web layer renders a generic form from
  this schema — it has no calculator-specific code.
- `taxCalculatorCalculation(calculatorType: TaxCalculatorType!, input: [TaxCalculatorInputValue!]!): [TaxCalculatorResultRow!]` —
  takes generic key/value pairs (matching the keys from `taxCalculatorFields`)
  and returns a flat/grouped list of generic result rows.

## Structure

Each calculator lives in its own folder under `src/lib/calculators/<name>/`,
owning its own input field schema (`<name>.fields.ts`) and its own mapping
from the client library's raw Icelandic response fields to generic English
result rows (`<name>.mapper.ts`). `calculators.constants.ts` registers all
calculators in a lookup keyed by `TaxCalculatorType`; `tax-calculators.service.ts`
is a thin dispatcher with no per-calculator knowledge of its own. Adding a
new calculator means adding a new folder and one line in the registry —
nothing else changes. Shared parsing/formatting helpers used across
calculators live in `src/lib/utils/`.

## Prerequisites

Requires `@island.is/clients/rsk/calculators` to be available (no auth
required — RSK's Reiknivélar API is public).

## Running unit tests

Run `nx test api-domains-tax-calculators` to execute the unit tests via
[Jest](https://jestjs.io).
