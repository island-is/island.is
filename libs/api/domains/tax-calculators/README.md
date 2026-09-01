# api-domains-tax-calculators

Serves the dynamic form schema for Skatturinn's (RSK) tax calculators. The web
client renders a generic form from it — there is no per-calculator UI code.

## Surface

- `taxCalculatorFields(calculatorType: TaxCalculatorType!): [TaxCalculatorField!]` —
  the field list for one calculator: key, label, input kind, required flag, and
  where relevant a unit, numeric bounds and select options.

That is the whole GraphQL surface. This module calls no external API and
injects no client library.

## Structure

```
src/lib/
├── tax-calculators.module.ts
├── tax-calculators.resolver.ts     # the single query
├── tax-calculators.service.ts      # looks up the field list by type
├── calculators.constants.ts        # type -> field list
├── calculators/<name>.fields.ts    # the field definitions, one file per calculator
├── models/                         # GraphQL types + enums
└── utils/                          # definition -> model mapping, shared option builders
```

Field labels are Icelandic and act as defaults. A Contentful editor overrides
them per placement through the `calculator` content type's `configJson`, which
also decides section layout, ordering and conditional visibility — see
`libs/tax-calculators` for that schema and `apps/contentful-apps` for the
editor.

## Performing a calculation

Not implemented. An earlier version exposed `taxCalculatorCalculation` backed
by per-calculator mappers over the RSK client; it was removed because the
output contract is being redesigned to live in `configJson` alongside the input
sections. The v1 contract — including the RSK response field mappings — is
recorded outside this repo and is deferred until the input flow is finished end
to end.
