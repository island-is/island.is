# Tax Calculators Domain Calculation Roadmap

This roadmap documents the API/domain calculation boundary for public RSK tax
calculators.

The metadata query already exposes each calculator's input and output contract.
Calculation is the runtime companion: web submits keyed input values for one
public calculator type, the domain validates and coerces them against metadata,
dispatches to the typed RSK client method, then returns keyed output values for
the web renderer to place into the CMS-authored output layout.

## Goal

Add a public GraphQL calculation operation that preserves the same identity model
as metadata and config:

- calculator identity is `TaxCalculatorType`
- submitted values are keyed by input field `key`
- returned values are keyed by output field `key`
- array result rows are keyed by item field keys

The operation is generic at the GraphQL boundary and typed at the client
boundary.

## Operation Kind

Use a GraphQL `Query`. RSK calculation is an external read and has no side
effect.

The operation should be separate from the metadata query:

```graphql
type Query {
  taxCalculatorCalculate(
    input: TaxCalculatorCalculateInput!
  ): TaxCalculatorCalculateResponse
}
```

Nullable, following `conventions/graphql.md`. The metadata query deviates from
that rule because it reads a static in-process registry; this one fronts a
network call to RSK and so takes the convention as written.

Consumers therefore handle two distinct failure paths: a null or thrown
transport error, and a populated `errors` array on an otherwise successful
response.

## Input Shape

Use keyed typed rows, not JSON:

```graphql
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
```

`@oneOf` is supported by the installed stack: `@nestjs/graphql` exposes
`@InputType(..., { isOneOf: true })`, and the installed GraphQL/codegen packages
understand one-of input objects.

Input validation rules:

- no duplicate submitted keys
- every submitted key exists in `inputFields`
- value kind matches field metadata
- `select` fields use `stringValue`
- selected values exist in the field's `options`
- `date` fields use `stringValue` formatted as `yyyy-MM-dd`
- required applicable fields are present
- dependency-inapplicable submitted fields are rejected
- empty strings, `null` and `undefined` are treated as absent
- `0` and `false` are preserved

Applicability is determined from `dependsOn` metadata and submitted values after
normalization. Missing dependency targets should be impossible after metadata
publication validation; if encountered, treat it as a contract bug.

Public input conventions:

- percentage number inputs use whole percent, for example `37`
- month number inputs use `1-12`

The domain passes both through unchanged. Percentage values are converted to
RSK's `0-1` ratio by the client query mapper, which already owns every other
RSK-specific encoding; the domain must not reinterpret them.

This carries one correction to already-shipped metadata code, which this pass
owns: `models/enums.ts` currently describes the *input* `PERCENTAGE` semantic as
`A ratio between 0 and 1, not a 0-100 figure`. That description is now wrong at
the public boundary and must say whole percent. The *output* `PERCENTAGE`
description (`No scale is asserted`) is correct and stays.

The `1-12` month convention is the accepted current baseline. Both
`models/enums.ts` and the web's `optionSources.ts` record that RSK documents no
convention here, so this remains unverified and may need revisiting.

## Client Dispatch

After validation, the domain builds the typed input object expected by the
selected client method.

Keep the generic dispatch map local to the domain, keyed on the client's
`CalculatorKey` *after* `toCalculatorKey` has resolved it:

- `childBenefit` -> `getChildBenefit`
- `vehicleTax` -> `getVehicleTax`
- `vehicleBenefit` -> `getVehicleBenefit`
- `withholdingTax` -> `getWithholdingTax`

Do not key this map on `TaxCalculatorType`. The two vocabularies agree on three
of the four names and disagree on the fourth --
`TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES` is `withholdingTaxOnWages`, whose
client key is `withholdingTax`. `mappings/calculatorType.ts` already owns that
translation and is the single place it should happen; re-deriving it here is how
the one name that differs silently fails to match.

Do not expose client-local `CalculatorKey` in GraphQL.

## Output Shape

Return keyed typed output rows, not JSON:

```graphql
type TaxCalculatorCalculateResponse {
  calculation: TaxCalculatorCalculation
  errors: [TaxCalculatorCalculationError!]!
}

type TaxCalculatorCalculation {
  type: TaxCalculatorType!
  values: [TaxCalculatorOutputFieldValue!]!
}

type TaxCalculatorOutputFieldValue {
  key: String!
  type: TaxCalculatorOutputFieldType!
  numberValue: Float
  stringValue: String
  booleanValue: Boolean
  arrayValue: [TaxCalculatorOutputFieldValueRow!]
}

type TaxCalculatorOutputFieldValueRow {
  values: [TaxCalculatorOutputScalarValue!]!
}

type TaxCalculatorOutputScalarValue {
  key: String!
  type: TaxCalculatorOutputFieldType!
  numberValue: Float
  stringValue: String
  booleanValue: Boolean
}
```

Exactly one value field should be populated according to `type`. Array fields
populate `arrayValue`; scalar fields populate their matching scalar value. Date
outputs use `stringValue` with the same `yyyy-MM-dd` convention as input dates.

Output transport order is only for deterministic responses and tests. Rendering
order is entirely CMS-authored through `outputSections`.

Output omission rules:

- missing or `undefined` scalar client outputs are omitted
- empty arrays are returned as `arrayValue: []`
- extra client output keys not present in metadata are ignored
- output percentage values are returned as the client mapper produced them

## Error Shape

Use a typed response wrapper so public web can render calculation failures
without treating the metadata query or whole page as broken.

Validation and RSK errors block calculation completely. Do not return partial
calculation values. When `errors` is non-empty, `calculation` is `null`; when a
calculation succeeds, `errors` is empty.

Target error shape:

```graphql
enum TaxCalculatorCalculationErrorCode {
  INVALID_VALUE
  MISSING_REQUIRED_VALUE
  INAPPLICABLE_VALUE
  UNKNOWN_FIELD
  DUPLICATE_FIELD
  UNSUPPORTED_CALCULATOR
  CALCULATION_FAILED
  EMPTY_RESULT
}

type TaxCalculatorCalculationError {
  code: TaxCalculatorCalculationErrorCode!
  key: String
  message: String!
}
```

At minimum distinguish:

- invalid submitted value
- missing required applicable field
- dependency-inapplicable submitted field
- unsupported or unreachable calculator type
- RSK calculation failure
- empty/missing result from RSK

Validation errors should include the affected input `key` when one exists. RSK
and empty-result failures are calculation-level errors.

## Verification

Domain implementation should include focused tests for:

- `@oneOf` input value shape in the emitted schema
- duplicate key rejection
- unknown key rejection
- value-kind mismatch rejection
- select option validation
- required applicable field validation
- dependency-inapplicable rejection
- dispatch to each reachable client method
- scalar client output mapping
- array client output mapping
- omitted missing scalar outputs
- empty array output rows
- typed error responses
- RSK failure behavior

The schema build is load-bearing because it proves `@oneOf` emits and codegen
can consume the operation shape.
