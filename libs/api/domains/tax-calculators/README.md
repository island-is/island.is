# api-domains-tax-calculators

Serves the input contract for Skatturinn's (RSK) tax calculators, so a consumer
can render a generic form instead of per-calculator UI code.

## The query

```graphql
taxCalculator(type: TaxCalculatorType!): TaxCalculator!

type TaxCalculator {
  type: TaxCalculatorType!
  inputFields: [TaxCalculatorInputField!]!
}

interface TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
}
```

`TaxCalculatorInputField` is implemented by
`TaxCalculator{Number,String,Boolean,Date,Select}InputField`. Only the number
field exposes `semantic`, and only the select field exposes
`options: [TaxCalculatorInputFieldOption!]!` -- the interface exists so those
two live where they are meaningful instead of being nullable everywhere.

`dependsOn.equals` is a union over
`TaxCalculator{Boolean,String,Number}InputDependencyValue`; read `__typename` to
learn which scalar it carries. Today every dependency RSK publishes is boolean,
but the client types the comparison as `string | number | boolean`, so the
public contract matches the client contract rather than only its current data.

Public and unauthenticated -- no `IdsUserGuard`, `ScopesGuard` or `@Audit`,
since the consumer is the Contentful-driven Calculator slice on the public web.

## Two deliberate deviations

**The root query is non-nullable**, against `conventions/graphql.md`'s "all root
Query fields must be nullable". That rule protects consumers from a query that
fronts a service which can be down; this one reads a static in-process registry
with no network behind it.

**Invalid client metadata throws rather than degrading.** An earlier version of
this module warned and dropped the offending piece, on the reasoning that a
public unauthenticated page turns a throw into a 500 for every visitor. That
reasoning does not hold any more: the field contract is now authored plain data
in the client, not derived by introspecting a zod schema, so a violation is a
code bug the domain tests catch in CI -- not upstream API drift arriving at
runtime.

Taken together these two mean one bad contract entry nulls the whole response
rather than one field. That is the intended trade: `validation/inputContract.ts`
enumerates what must hold before anything is published, and a violation should
never reach a deploy.

## Where the fields come from

`TaxCalculatorsService` calls `getCalculator(key)` on
`@island.is/clients/rsk/calculators` and mediates the result. Nothing here is
hand-maintained: an earlier version of this module restated the field list by
hand, drifted from RSK's real contract, and was deleted for it -- so field
metadata must keep coming from the client.

The split of responsibilities is deliberate and documented on both sides. The
client owns RSK interpretation (which endpoint, which query parameter, what a
number means, requiredness, option values). This domain owns Ísland.is
publication semantics: the `TaxCalculatorType` -> `CalculatorKey` mapping, the
GraphQL shape, and the invariants a contract must satisfy before it is
published. Do not restate client-side RSK detail here; see the client's README.

## Only four of six calculators are reachable

The client covers six calculators (`childBenefit`, `vehicleTax`,
`vehicleBenefit`, `vehicleDepreciation`, `withholdingTax`, `interestBenefit`),
but `TaxCalculatorType` -- the enum Contentful authors against -- declares four.
`vehicleDepreciation` and `interestBenefit` stay unreachable until that enum
grows, which touches `libs/tax-calculators`, `libs/cms`,
`apps/contentful-apps` and the Contentful content model together.

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
- **Field order carries no meaning.** `getCalculator` returns fields sorted by
  name for determinism. Match on `key`, never on array position.

## Known-red consumers

Both consumers of this query still select the previous shape and need updating
(`fields` -> `inputFields`, `inputType` -> `type` + `semantic`, `options` from
`[String!]` to structured objects, `dependsOn.field` -> `fieldKey`, `equals`
from a scalar to a union, and the argument `calculatorType` -> `type`):

- `apps/web/screens/queries/TaxCalculators.ts` and
  `components/Organization/Slice/Calculator/Calculator.tsx`
- `apps/contentful-apps/components/editors/CalculatorEditor/`
  (`constants.ts`, `types.ts`)

Deliberately out of scope for the domain rebuild; see `PLAN.md`.

## Performing a calculation

Not implemented. The client exposes no curated output contract -- every client
mapper is outbound-only, and the only result types it re-exports are the raw
generated `Get*Response`. Per `ROADMAP.md` Section 3 the domain must not invent
result shape ahead of that, so calculation stays deferred and the operation
name `taxCalculatorCalculate` is reserved.

## Running unit tests

```
nx test api-domains-tax-calculators
```
