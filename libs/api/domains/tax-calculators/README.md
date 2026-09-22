# api-domains-tax-calculators

Serves the input and output contracts for Skatturinn's (RSK) tax calculators,
so a consumer can render a generic form, and know what a result will contain,
instead of writing per-calculator UI code -- and runs those calculators against
submitted values.

Two queries, in that order: `taxCalculator` publishes the contract, and
`taxCalculatorCalculate` runs one against values keyed by it.

## The metadata query

```graphql
taxCalculator(type: TaxCalculatorType!): TaxCalculator!

type TaxCalculator {
  type: TaxCalculatorType!
  inputFields: [TaxCalculatorInputField!]!
  outputFields: [TaxCalculatorOutputField!]!
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
field exposes `semantic`, `min` and `max`, and only the select field exposes
`options: [TaxCalculatorInputFieldOption!]!` -- the interface exists so those
live where they are meaningful instead of being nullable everywhere. `min`/`max`
are set only for a semantic that bounds the value (`percentage`, `month`,
`count`); absent otherwise. They come from the same table the domain validates
submissions against (`shared/numericSemanticRange.ts`), so the published bound
can never drift from the enforced one.

### Output fields

```graphql
interface TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

interface TaxCalculatorOutputScalarField implements TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

type TaxCalculatorArrayOutputField implements TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
  itemFields: [TaxCalculatorOutputScalarField!]!
}
```

`TaxCalculatorOutputScalarField` is implemented by
`TaxCalculator{Number,String,Boolean,Date}OutputField`, and only the number
field exposes `semantic`. `TaxCalculatorArrayOutputField` describes a repeating
group: its `itemFields` are the columns of one row, not values.

Output fields are metadata, not results. They carry no `required`, `dependsOn`,
`options`, labels, layout or grouping, and no RSK source keys -- `key` is the
join to the Contentful `configJson`, exactly as on the input side.

The second interface is the one structural difference from the input side, and
it is deliberate: typing `itemFields` as scalar-only is what makes an array
inside an array unrepresentable, matching the client's
`itemFields: readonly CalculatorScalarOutputField[]`. A single flat interface
would let the schema express nesting the contract does not have.

`TaxCalculatorOutputFieldSemantic` is a separate enum from
`TaxCalculatorInputFieldSemantic` despite identical members, so that each side
can describe the value in the direction it travels. Both assert the same scale
for `PERCENTAGE`: a whole `0-100` figure. That is a declaration this contract
makes, not an observation of what RSK sends -- the client's mappers divide on
the way in and multiply on the way out to make it true.

`dependsOn.equals` is a union over
`TaxCalculator{Boolean,String,Number}InputDependencyValue`; read `__typename` to
learn which scalar it carries. Today every dependency RSK publishes is boolean,
but the client types the comparison as `string | number | boolean`, so the
public contract matches the client contract rather than only its current data.

Public and unauthenticated -- no `IdsUserGuard`, `ScopesGuard` or `@Audit`,
since the consumer is the Contentful-driven Calculator slice on the public web.

## Deliberate deviations

**The metadata root query is non-nullable**, against `conventions/graphql.md`'s
"all root Query fields must be nullable". That rule protects consumers from a
query that fronts a service which can be down; `taxCalculator` reads a static
in-process registry with no network behind it. `taxCalculatorCalculate` does
front RSK, and takes the convention as written.

**Output uses a second scalar interface**, unlike input fields. This lets
`TaxCalculatorArrayOutputField.itemFields` be typed as
`[TaxCalculatorOutputScalarField!]!`, making nested arrays unrepresentable in
the public schema and matching the client output contract.

**Invalid client metadata throws rather than degrading.** An earlier version of
this module warned and dropped the offending piece, on the reasoning that a
public unauthenticated page turns a throw into a 500 for every visitor. That
reasoning does not hold any more: the field contract is now authored plain data
in the client, not derived by introspecting a zod schema, so a violation is a
code bug the domain tests catch in CI -- not upstream API drift arriving at
runtime.

The non-null root query and throw-on-invalid-metadata decisions together mean
one bad contract entry nulls the whole response rather than one field. That is
the intended trade: `contract/validation/validation.ts` enumerates what must
hold before anything is published -- for input and output fields alike -- and
a violation should never reach a deploy.

Note that "only number fields carry `semantic`" is a runtime invariant on both
sides by necessity: the client permits `semantic` on any scalar type, so
nothing enforces the rule at compile time. The mapper rejects a violation
rather than dropping the semantic, so client drift cannot be published as a
quietly wrong contract.

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
  with `apps/web` and `apps/contentful-apps`) and registered with GraphQL here,
  in `models/enums.ts` -- this is the only GraphQL schema that exposes it, so
  it must be the only place `registerEnumType` is called for it; registering
  twice throws.
- **No display text.** Labels, placeholders, section titles, ordering,
  conditional visibility and spans are all editor-authored per placement
  through the `calculator` content type's `configJson`. See
  `libs/tax-calculators/src/lib/calculatorConfig.schema.ts` and
  `apps/contentful-apps` for the editor. The two sides join on `key`.
- **Field order carries no meaning.** `getCalculator` returns fields sorted by
  name for determinism. Match on `key`, never on array position.

## Current consumers

The public web calculator slice and the Contentful calculator editor both query
the current metadata shape: `taxCalculator(type:)`, `inputFields`,
`outputFields`, structured select options, dependency `fieldKey`, and typed
dependency values.

## The calculation query

```graphql
taxCalculatorCalculate(
  input: TaxCalculatorCalculateInput!
): TaxCalculatorCalculateResponse

input TaxCalculatorCalculateInput {
  type: TaxCalculatorType!
  values: [TaxCalculatorInputFieldValue!]!
}

input TaxCalculatorInputFieldValue {
  key: String!
  value: TaxCalculatorInputValue!
}

input TaxCalculatorInputValue @oneOf {
  numberValue: Float
  stringValue: String
  booleanValue: Boolean
}

type TaxCalculatorCalculateResponse {
  calculation: TaxCalculatorCalculation
  errors: [TaxCalculatorCalculationError!]!
}
```

Generic at the GraphQL boundary, typed at the client boundary. Submitted values
are keyed by input field `key` and results by output field `key`, so one query
document serves every calculator, including ones not yet declared.

`TaxCalculatorOutputFieldValue` is a flat tagged object -- `type` plus mutually
exclusive nullable payloads -- rather than the interface hierarchy the metadata
models use. The metadata models are genuinely polymorphic: different field types
carry different fields. Values all carry a key and exactly one payload, so an
interface would only force the consumer to enumerate concrete types through
inline fragments, twice over once array rows nest, to read a fact the metadata
contract already stated.

### Three failure paths, not two

A consumer has to handle all three, and only the middle one is an `errors` entry:

1. **A transport or contract failure** nulls the whole response, or throws.
   Unpublishable client metadata is the contract bug described above.
2. **A populated `errors` array.** Validation and RSK failures alike. When
   `errors` is non-empty `calculation` is null: a calculation runs completely or
   not at all, and there is no partial result.
3. **A top-level GraphQL error before the resolver runs.** `@oneOf` coercion
   rejects a payload that is empty or carries more than one member, and a
   cleared form control produces exactly that. Omit the whole
   `TaxCalculatorInputFieldValue` row rather than sending `{}` or
   `{ stringValue: null }`. Only `''` reaches the domain, which reads it as no
   value at all.

`TaxCalculatorCalculationError.code` is the contract; `message` is
developer-facing English for logs, is not localized, and must never be
rendered. Field-level codes carry the input `key`; `CALCULATION_FAILED` and
`EMPTY_RESULT` are calculation-level and carry none.

An RSK failure is logged server-side and deliberately not interpolated into
`message` -- this is a public unauthenticated operation, so upstream detail must
not reach the response.

### Public value conventions

Percentages are whole percent (`37`, not `0.37`) in both directions. The
domain passes both percentages and months through unchanged; the client's
mappers own the conversion to and from RSK's own encoding, along with every
other RSK-specific detail. Dates are `yyyy-MM-dd` on both sides.

A submitted `percentage` must be `0-100`, a `month` must be `1-12`, and a
`count` must be `0` or more. These are declarations this contract makes, not
observations of what RSK itself sends or accepts -- they live in
`shared/numericSemanticRange.ts`, which both the input validation
(`calculate/submission/submission.ts`) and the published `min`/`max` on
`TaxCalculatorNumberInputField` read from, so the two can never disagree.

Number fields carrying the `year`, `month` or `count` semantic must also be
whole numbers -- the one place a semantic affects behaviour rather than
presentation.

### Applicability is narrower here than on the web

The domain decides applicability from `dependsOn` alone. The public web slice
decides it from `dependsOn` plus CMS section gates, and does not submit values
in a closed section. An editor who places a contract-required field inside a
gated section therefore gets a `MISSING_REQUIRED_VALUE` for a value the web
correctly declined to send. Surfacing that to the editor belongs to the web
slice's own diagnostics, not here.

## Running unit tests

```
nx test api-domains-tax-calculators
```
