# rsk-calculators

GraphQL domain module wrapping RSK's (Skatturinn) public "Reiknivélar"
calculators API via `@island.is/clients/rsk/reiknivelar`. Exposes a single
generic, schema-driven contract that powers one shared web calculator
connected component instead of a bespoke query per calculator.

## Calculators

- `WITHHOLDING_TAX_ON_WAGES` — payroll withholding tax (Staðgreiðsla)
- `CHILD_BENEFIT` — child benefit (Barnabætur)

## GraphQL API

- `rskCalculatorFields(calculatorType: RskCalculatorType!): [RskCalculatorField!]` —
  returns the dynamic form schema (field key, label, kind, options, bounds)
  for the given calculator type. The web layer renders a generic form from
  this schema — it has no calculator-specific code.
- `rskCalculatorCalculation(calculatorType: RskCalculatorType!, input: [RskCalculatorInputValue!]!): [RskCalculatorResultRow!]` —
  takes generic key/value pairs (matching the keys from `rskCalculatorFields`)
  and returns a flat/grouped list of generic result rows.

This domain owns the mapping between the client library's raw Icelandic
query/response field names and the English field keys used in the GraphQL
schema — see `mapper.ts`.

## Prerequisites

Requires `@island.is/clients/rsk/reiknivelar` to be available (no auth
required — RSK's Reiknivélar API is public).

## Running unit tests

Run `nx test api-domains-rsk-calculators` to execute the unit tests via
[Jest](https://jestjs.io).
