# Tax Calculators Domain Roadmap

This roadmap is the control document for rethinking
`libs/api/domains/tax-calculators` after the RSK calculators client rebuild.

Scope is the GraphQL domain only.

Current consumers are useful context, but they are not hardened design
invariants. This domain is allowed to publish a new relationship that breaks
current CMS/web assumptions. Consumer retooling may be required later, but that
work is outside this roadmap.

Output/calculation follows the same relationship as input fields: the client
curates the RSK-facing output contract, and the domain mediates that contract
into the curated public GraphQL shape. Calculation execution is separate from
output metadata publication and must not be designed from old output handling.

## Section 1: Establish The Domain Boundary

Goal: understand what this domain owns today and what it should own after the
client rebuild.

Work:

- inspect the rebuilt client contract in `libs/clients/rsk/calculators`
- inspect the current GraphQL domain contract
- inspect `TaxCalculatorType` ownership and GraphQL registration
- identify every place the domain currently depends on old client helpers or
  old client contract shapes
- identify the old calculation/output path only as historical context; it is
  not the authority for the new output contract
- identify current consumer assumptions only where they explain why the domain
  has its present shape

Output:

- domain responsibilities today
- client responsibilities the domain should rely on
- domain responsibilities that should be removed
- consumer assumptions that may be broken by the new domain contract
- output/calculation questions that must move back to the client roadmap before
  the domain can design them

## Section 2: Design The Domain Contract

Goal: decide the public GraphQL contract this domain should expose.

Settled input decisions:

- expose a calculator object query:
  `taxCalculator(type: TaxCalculatorType!): TaxCalculator!`
- keep `TaxCalculatorType` in `libs/tax-calculators` as the curated shared
  calculator identity; do not expose client `CalculatorKey`
- expose input fields as `inputFields`, not generic `fields`
- name the field interface `TaxCalculatorInputField`
- model input fields with an expressive GraphQL interface plus concrete input
  field object types
- expose common `key`, `type`, `required`, and `dependsOn` fields on the input
  field interface
- use `TaxCalculatorInputFieldType.SELECT`, not `ENUM`
- expose number `semantic` only on number input fields, and keep it optional
- expose `options` only on select input fields, as structured
  `TaxCalculatorInputFieldOption { value }` objects
- model dependency equality with a GraphQL union over boolean, string, and
  number value objects; use `__typename` as the discriminator
- expose dependency targets as `fieldKey`

Settled output decisions:

- expose output fields on the same calculator object as
  `outputFields: [TaxCalculatorOutputField!]!`
- keep input and output GraphQL types separate; reuse the input contract's
  conditioning pattern, not its public types
- model output fields with `TaxCalculatorOutputField`, so consumers can query
  common `key` and `type` fields without fragments, matching the input
  contract's enum-discriminator precedent
- expose reusable scalar output metadata through
  `TaxCalculatorOutputScalarField`, which represents only non-array output
  fields
- expose number `semantic` only on number output fields
- model array outputs with `TaxCalculatorArrayOutputField { key, itemFields }`
- keep array item fields scalar-only, matching the client v1 output contract
- include `ARRAY` in `TaxCalculatorOutputFieldType`, mirroring input's `SELECT`
  as a public field type whose concrete object carries extra metadata
- expose no public `kind`; it is a client contract detail
- expose no `required`, `dependsOn`, `options`, labels, layout, grouping, or
  RSK source keys on output fields
- keep calculation execution separate from output metadata; this round does not
  add a calculation operation

Target input contract:

```graphql
type Query {
  taxCalculator(type: TaxCalculatorType!): TaxCalculator!
}

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

type TaxCalculatorNumberInputField implements TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
  semantic: TaxCalculatorInputFieldSemantic
}

type TaxCalculatorStringInputField implements TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
}

type TaxCalculatorBooleanInputField implements TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
}

type TaxCalculatorDateInputField implements TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
}

type TaxCalculatorSelectInputField implements TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
  options: [TaxCalculatorInputFieldOption!]!
}

type TaxCalculatorInputFieldOption {
  value: String!
}

type TaxCalculatorInputFieldDependency {
  fieldKey: String!
  equals: TaxCalculatorInputDependencyValue!
}

union TaxCalculatorInputDependencyValue =
    TaxCalculatorBooleanInputDependencyValue
  | TaxCalculatorStringInputDependencyValue
  | TaxCalculatorNumberInputDependencyValue

type TaxCalculatorBooleanInputDependencyValue {
  value: Boolean!
}

type TaxCalculatorStringInputDependencyValue {
  value: String!
}

type TaxCalculatorNumberInputDependencyValue {
  value: Float!
}
```

Target output contract:

```graphql
interface TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

interface TaxCalculatorOutputScalarField implements TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

type TaxCalculatorNumberOutputField implements TaxCalculatorOutputField & TaxCalculatorOutputScalarField {
  key: String!
  type: TaxCalculatorOutputFieldType!
  semantic: TaxCalculatorOutputFieldSemantic
}

type TaxCalculatorStringOutputField implements TaxCalculatorOutputField & TaxCalculatorOutputScalarField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

type TaxCalculatorBooleanOutputField implements TaxCalculatorOutputField & TaxCalculatorOutputScalarField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

type TaxCalculatorDateOutputField implements TaxCalculatorOutputField & TaxCalculatorOutputScalarField {
  key: String!
  type: TaxCalculatorOutputFieldType!
}

type TaxCalculatorArrayOutputField implements TaxCalculatorOutputField {
  key: String!
  type: TaxCalculatorOutputFieldType!
  itemFields: [TaxCalculatorOutputScalarField!]!
}
```

Output:

- target GraphQL query shape
- target GraphQL model and enum shape
- calculator reachability decision
- explicit calculation-execution non-goal for this metadata round
- explicit non-goals for this domain

## Section 3: Output Contract Checkpoint

Goal: prevent the domain from inventing result/output shape and ensure it
mediates the client-owned output contract into a public GraphQL model.

Work:

- confirm `libs/clients/rsk/calculators` exposes an output contract parallel to
  its input field contract
- inspect the client output keys, scalar value types, array concepts, and
  response mapping responsibilities
- decide which client output concepts should be mediated publicly by the domain
  and which are client details
- decide how much GraphQL conditioning the domain should apply so consumers do
  not need to reason about optional metadata
- verified: NestJS emits interface-implements-interface correctly for
  `TaxCalculatorOutputScalarField implements TaxCalculatorOutputField` at
  `@nestjs/graphql` 13.4.2 / `graphql` 16.14.2, and adds the transitive
  interface to the concrete types itself. No union fallback is needed.

Output:

- client output contract status
- list of result/output concepts the domain is allowed to design against
- explicit note that domain calculation execution remains separate from output
  metadata
- public output GraphQL model shape and non-goals

## Section 4: Define Domain Mediation

Goal: decide how the domain mediates between public calculator identity and the
client-local RSK calculator contract.

Work:

- define how `TaxCalculatorType` maps to the client-local `CalculatorKey`
- keep the mapping in a dedicated module
- define how client fields map to GraphQL fields
- define how dependency mismatches are validated
- define how invalid client metadata throws before publication
- decide which comments/docs belong in the domain and which client details
  should be left to client docs

Output:

- identity mapping policy
- field mapping policy
- validation policy
- documentation boundary
- testable domain contract

Publication invariants:

- requested client calculator key must match the returned client calculator key
- curated calculators must publish at least one input field
- input field keys must be non-empty and unique within a calculator
- field order has no domain meaning
- select input fields must have defined, non-empty options
- non-select input fields must not expose options
- option values must be non-empty and unique within the field
- `semantic` on a non-number field is rejected, because only number input
  fields publish it
- dependency targets must reference another field in the same calculator
- dependency equality must be compatible with the referenced field
- dependencies on date fields are unsupported for now
- dependency cycles are forbidden
- invalid client metadata throws; do not degrade

Output publication invariants:

- curated calculators must publish at least one output field
- output field keys must be non-empty and unique within a calculator
- scalar output `semantic` is allowed only on number output fields
- array output fields must publish at least one item field
- array item field keys must be non-empty and unique within that array
- array item `semantic` is allowed only on number item fields
- output field order has no domain meaning

## Resolved Outputs (Sections 1-4)

Recorded after the rebuild, so this control document states what was settled
rather than being contradicted by the code. `PLAN.md` holds the file-level
detail.

### Section 1 -- domain boundary

- Domain responsibilities today: public calculator identity, the GraphQL shape,
  and the invariants a contract must satisfy before publication.
- Client responsibilities relied on: RSK endpoint choice, field naming, input
  types, output types, requiredness, numeric semantics, option values,
  dependency facts, output array shape, curated output keys, response mapping,
  and deterministic sorting by field name.
- Removed from the domain: nothing derived from zod introspection remains; the
  old `getCalculatorInputProps` path and the warn-and-degrade dependency
  narrowing are both gone.
- Consumer assumptions broken: `apps/web` and `apps/contentful-apps` both
  selected `fields`/`inputType`/`options: [String!]`/`dependsOn.field` and
  passed a `calculatorType` argument. All four are renamed or restructured.
- Output metadata now follows the same boundary: the client owns the output
  contract, and the domain owns its GraphQL publication shape. Calculation
  execution remains outside this output-metadata round.

### Section 2 -- domain contract

- Query shape and model/enum shape: the target input and output SDL above.
- Calculator reachability: **four**. `TaxCalculatorType` keeps its four members;
  `vehicleDepreciation` and `interestBenefit` stay unreachable until that enum
  grows, which touches `libs/tax-calculators`, `libs/cms`,
  `apps/contentful-apps` and the Contentful content model together.
- Calculation execution: **not part of this round**. The domain exposes output
  metadata but does not add a calculation operation here.
- Non-goals: no display text of any kind, no field ordering with meaning, no
  RSK interpretation, no client-local `CalculatorKey` in the public schema, no
  calculation execution.
- Deviation from the suggested structure below: the two enums live in a single
  `models/enums.ts` per `conventions/domain-module.md`, not in per-enum
  `*.model.ts` files -- a `.model.ts` containing no `@ObjectType` reads wrong.

### Section 3 -- output contract checkpoint

- Client output contract status: **present**. The client exposes
  `outputFields` beside `inputFields` from `getCalculator(key)` and owns
  per-calculator response mappers into curated output shapes.
- Result/output concepts the domain may design against: scalar output fields,
  array output fields with scalar `itemFields`, scalar value types, and numeric
  semantics.
- Concepts the domain must not invent: labels, layout, nested object groups,
  public RSK source keys, and output requiredness.
- Domain calculation execution remains separate. This roadmap section settles
  output metadata publication only.
- Output percentage semantics deliberately do not assert a universal 0-1 scale,
  because the client documents that output ratio scale is unverified.
- The union alternative was rejected because it makes common fields like `key`
  and `type` unqueryable without fragments, unlike the input contract. The
  two-interface shape keeps those common fields queryable while preserving the
  scalar-only guarantee for array `itemFields`.

### Section 4 -- domain mediation

- Identity mapping policy: `mappings/calculatorType.ts` holds a
  `Record<TaxCalculatorType, CalculatorKey>`, keyed on the enum so a fifth
  member fails to compile rather than resolving to undefined. The client never
  imports `TaxCalculatorType`.
- Field mapping policy: `mappings/inputField.ts` maps client input fields to
  concrete GraphQL types; `mappings/outputField.ts` maps client output fields
  to the output interface model. Their `Record`s are keyed on the
  client's own literal unions, so these modules are where client contract
  changes stop compiling.
- Validation policy: validation asserts every input and output publication
  invariant listed above and throws on violation. It runs per request, scoped to
  the requested calculator.
- Documentation boundary: RSK interpretation stays in the client's README
  (including the percentage-conversion asymmetry). The domain README documents
  publication semantics, reachability, and its two deliberate deviations.
- Testable domain contract: focused tests across the service, mappers and
  validation modules.

## Section 5: Domain Output Implementation Plan

Goal: turn the chosen output metadata boundary into concrete code changes.

Work:

- add output-specific GraphQL enums and models
- add a client-output to domain-output mapper
- add output publication validation
- add `TaxCalculator.outputFields`
- update `TaxCalculatorsService` to map `contract.outputFields`
- update tests around public output behavior and mapping rules
- update documentation once the model is implemented

Output:

- file-by-file implementation plan
- focused test plan
- verification commands
- known risks and intentional downstream breaks

See `PLAN.md` for the file-by-file implementation plan. Keep detailed file
lists, test cases and verification commands there rather than duplicating them
in this roadmap.

Target domain structure after output metadata:

```text
src/lib/
  models/
    taxCalculator.model.ts
    inputField.model.ts
    outputField.model.ts
    inputFieldOption.model.ts
    inputFieldDependency.model.ts
    inputDependencyValue.model.ts
    enums.ts

  mappings/
    calculatorType.ts
    inputField.ts
    outputField.ts

  validation/
    contract.ts

  tax-calculators.module.ts
  tax-calculators.resolver.ts
  tax-calculators.service.ts
```

## Section 6: Final Review

Goal: verify the rebuilt domain matches the chosen domain design.

Checks:

- the RSK client does not know about `TaxCalculatorType`
- the domain does not author RSK fields
- the domain consumes the rebuilt client boundary intentionally
- public GraphQL shape is intentional
- calculator reachability is intentional
- output metadata is mediated from the client contract rather than invented
- calculation execution remains outside this output-metadata round
- stale docs and comments are gone
- downstream breaks, if any, are explicit and not accidental

Verification:

- run focused domain tests
- run focused client tests if client exports are touched
- run typecheck targets if practical
- review the final code against this roadmap before closing the work
