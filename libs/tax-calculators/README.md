# Tax Calculators

Shared configuration contract for the Contentful `calculator` content type.

The Zod schema in this library is the single source of truth for the
`configJson` field: `apps/contentful-apps` validates against it before saving,
and `apps/web` parses against it before rendering a calculator.

The config has two halves, both editor-authored display structure only:

- `inputSections` -- grouping, ordering, labels, placeholders, grid spans and
  toggle/gate visibility for the calculator form.
- `outputSections` -- grouping, ordering, labels, markdown copy and
  presentation hints for the calculation result.

Neither half carries field types, requiredness, options, bounds or
dependencies. That metadata comes from `TaxCalculator.inputFields` and
`TaxCalculator.outputFields` in `libs/api/domains/tax-calculators`, and joins
to this config by `key`.

The one exception is the optional `numberType` (`currency | count | year |
percentage | plain`) on number input values, output values, output item fields
and the output total. It overrides the number semantic the API infers, for
numbers RSK's spec can't tell apart (a year or a count would otherwise render
as currency).

## Running unit tests

Run `nx test tax-calculators` to execute the unit tests via [Jest](https://jestjs.io).
