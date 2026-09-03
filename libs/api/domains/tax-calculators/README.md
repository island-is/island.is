# api-domains-tax-calculators

Serves the input contract for Skatturinn's (RSK) tax calculators, so a consumer
can render a generic form instead of per-calculator UI code.

## The query

```graphql
taxCalculatorFields(calculatorType: TaxCalculatorType!): [TaxCalculatorField!]

type TaxCalculatorField {
  key: String!
  dataType: TaxCalculatorFieldDataType!
  required: Boolean!
  options: [String!]
  dependsOn: TaxCalculatorFieldDependency
}

type TaxCalculatorFieldDependency {
  field: String!
  equals: Boolean!
}

enum TaxCalculatorFieldDataType { NUMBER STRING BOOLEAN DATE ENUM }
```

Public and unauthenticated -- no `IdsUserGuard`, `ScopesGuard` or `@Audit`,
since the consumer is the Contentful-driven Calculator slice on the public web.

## Where the fields come from

Nothing here is hand-maintained. `TaxCalculatorsService` calls
`getCalculatorInputProps` from `@island.is/clients/rsk/calculators`, which
derives the field list from each calculator's zod schema
(`libs/clients/rsk/calculators/src/lib/calculatorTypes/*.ts`). An earlier
version of this module restated the field list by hand, drifted from RSK's real
contract, and was deleted for it -- so field metadata must keep coming from the
client, never from a table in this library.

`dependsOn` falls out of the same derivation: `childBenefit` is a zod
discriminated union on `splitCustody`, so `splitCustodyChildrenOver7` and
`splitCustodyChildrenUnder7` are reported as valid only when `splitCustody` is
true. A consumer must neither render nor submit a field whose dependency is
unmet.

`equals` is `Boolean!` by deliberate choice, not by accident: every discriminant
across the exposed calculators is a zod boolean literal. `InputProp.dependsOn.value`
is typed `unknown`, so the service narrows it and -- if RSK ever introduces a
non-boolean discriminant -- logs a warning and drops that one dependency rather
than throwing, which on a public page would turn schema drift into a 500 for
every visitor. The dropped dependency makes the field unconditional, so the
warning is the signal to widen this type.

## Only four of six calculators are reachable

The client covers six calculators (`childBenefit`, `vehicleTax`,
`vehicleBenefit`, `vehicleDepreciation`, `withholdingTax`, `interestBenefit`),
but `TaxCalculatorType` -- the enum Contentful authors against -- declares four.
`vehicleDepreciation` and `interestBenefit` stay unreachable until that enum
grows, which touches `libs/tax-calculators`, `libs/cms` and
`apps/contentful-apps` together.

Note the one name that differs between the two vocabularies:
`TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES` (`withholdingTaxOnWages`) maps to
the client's `withholdingTax`. `tax-calculators.service.spec.ts` covers that
mapping, because a wrong entry compiles cleanly and silently returns another
calculator's fields.

## What lives elsewhere

- `TaxCalculatorType` is declared in `libs/tax-calculators` (plain TS, shared
  with `apps/web` and `apps/contentful-apps`) and registered with GraphQL by
  `libs/cms/src/lib/models/calculator.model.ts`, following
  `CustomPageUniqueIdentifier` -- **not** by this module. This module must never
  call `registerEnumType` for it; registering twice throws.
- **No display text.** Labels, placeholders, section titles, ordering,
  conditional visibility and spans are all editor-authored per placement
  through the `calculator` content type's `configJson`. See
  `libs/tax-calculators/src/lib/calculatorConfig.schema.ts` and
  `apps/contentful-apps` for the editor. The two sides join on `key`.

## Known-stale consumers

- **`apps/contentful-apps` CalculatorEditor** still selects a `label` field that
  this module no longer returns, so its query fails GraphQL *validation* -- the
  whole document errors, `data` is undefined, and the field picker renders
  empty rather than partially working. Nothing catches this at build time: the
  app has no codegen target and types the response with a hand-written local
  interface, so the mismatch surfaces only at runtime. Deliberately deferred.
  The fix spans three files under
  `apps/contentful-apps/components/editors/CalculatorEditor/`:
  - `constants.ts` -- drop `label` from the `GET_TAX_CALCULATOR_FIELDS`
    selection set
  - `types.ts` -- narrow `AvailableField` to `{ key: string }`
  - `components/SectionFieldRow.tsx` -- render `key` as the option text, and
    remove the now-dead prefill that seeded the editor's label from the
    backend's

  `CalculatorConfigEditor.tsx` also consumes the query but compiles unchanged
  once `types.ts` is narrowed.
- **`apps/web` Calculator slice** renders `null`; the form renderer is deferred.
  It also needs somewhere to author per-option display text, since enum options
  arrive as raw identifiers (`firstHalf`, `secondHalf`) and `sectionFieldSchema`
  has no slot for them -- that will require a `configJson` schema change.

## Performing a calculation

Not implemented. An earlier version exposed `taxCalculatorCalculation` backed
by per-calculator mappers over the RSK client; it was removed because the
output contract is being redesigned to live in `configJson` alongside the input
sections. The v1 contract -- including the RSK response field mappings -- is
recorded outside this repo and is deferred until the input flow is finished end
to end.

Note that the module needs no `imports` today because `getCalculatorInputProps`
is a pure function. `CalculatorsClientModule` becomes necessary only when the
calculation query is built, since that one injects `CalculatorsClientService`.
