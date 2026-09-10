# Tax Calculators Domain Roadmap

This roadmap is the control document for rethinking
`libs/api/domains/tax-calculators` after the RSK calculators client rebuild.

Scope is the GraphQL domain only.

Current consumers are useful context, but they are not hardened design
invariants. This domain is allowed to publish a new relationship that breaks
current CMS/web assumptions. Consumer retooling may be required later, but that
work is outside this roadmap.

Output/calculation follows the same relationship as input fields: the client
must first curate the RSK-facing output contract, and the domain then mediates
that contract into the curated public GraphQL shape. Do not design or implement
domain calculation output ahead of the client output contract.

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
- keep calculation execution deferred until the client has an explicit output
  contract; reserve the future operation name `taxCalculatorCalculate`

Target input contract:

```graphql
type Query {
  taxCalculator(type: TaxCalculatorType!): TaxCalculator!
}

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

Output:

- target GraphQL query shape
- target GraphQL model and enum shape
- calculator reachability decision
- explicit calculation deferral decision, unless the client output contract is
  already finished
- explicit non-goals for this domain

## Section 3: Output Contract Checkpoint

Goal: prevent the domain from inventing result/output shape before the client
has curated the RSK-facing output contract.

Work:

- confirm whether `libs/clients/rsk/calculators` exposes an output contract
  parallel to its input field contract
- if it does not, stop output-domain design and move the output contract work
  to the client roadmap
- if it does, inspect the client result keys, value types, grouping concepts,
  and response mapping responsibilities
- decide which client output concepts should be mediated publicly by the domain
  and which are client details

Output:

- client output contract status
- list of result/output concepts the domain is allowed to design against
- explicit note that domain calculation remains deferred when the client output
  contract is not ready
- follow-up questions for the domain once the client output contract exists

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

## Resolved Outputs (Sections 1-4)

Recorded after the rebuild, so this control document states what was settled
rather than being contradicted by the code. `PLAN.md` holds the file-level
detail.

### Section 1 -- domain boundary

- Domain responsibilities today: public calculator identity, the GraphQL shape,
  and the invariants a contract must satisfy before publication.
- Client responsibilities relied on: RSK endpoint choice, field naming, types,
  requiredness, numeric semantics, option values, dependency facts, and the
  deterministic sort by field name.
- Removed from the domain: nothing derived from zod introspection remains; the
  old `getCalculatorInputProps` path and the warn-and-degrade dependency
  narrowing are both gone.
- Consumer assumptions broken: `apps/web` and `apps/contentful-apps` both
  selected `fields`/`inputType`/`options: [String!]`/`dependsOn.field` and
  passed a `calculatorType` argument. All four are renamed or restructured.
- Output/calculation questions moved back to the client roadmap: the whole
  result contract. See Section 3 below.

### Section 2 -- domain contract

- Query shape and model/enum shape: exactly the target SDL above, emitted
  verbatim into the merged schema.
- Calculator reachability: **four**. `TaxCalculatorType` keeps its four members;
  `vehicleDepreciation` and `interestBenefit` stay unreachable until that enum
  grows, which touches `libs/tax-calculators`, `libs/cms`,
  `apps/contentful-apps` and the Contentful content model together.
- Calculation deferral: **deferred**, since the client output contract does not
  exist. `taxCalculatorCalculate` is reserved by name only.
- Non-goals: no display text of any kind, no field ordering with meaning, no
  RSK interpretation, no client-local `CalculatorKey` in the public schema, no
  calculation.
- Deviation from the suggested structure below: the two enums live in a single
  `models/enums.ts` per `conventions/domain-module.md`, not in per-enum
  `*.model.ts` files -- a `.model.ts` containing no `@ObjectType` reads wrong.

### Section 3 -- output contract checkpoint

- Client output contract status: **absent**. Every client mapper is
  outbound-only, and the only result types re-exported are the raw generated
  `Get*Response`. There is no response mapping anywhere in the client.
- Result/output concepts the domain may design against: **none**.
- Domain calculation therefore remains deferred, as Section 2 records.
- Follow-up questions for once the client output contract exists: which result
  keys are public versus client detail; whether results carry grouping; how
  result values express currency/percentage units; whether the operation takes
  the curated `TaxCalculatorType` and a typed input per calculator.

### Section 4 -- domain mediation

- Identity mapping policy: `mappings/calculatorType.ts` holds a
  `Record<TaxCalculatorType, CalculatorKey>`, keyed on the enum so a fifth
  member fails to compile rather than resolving to undefined. The client never
  imports `TaxCalculatorType`.
- Field mapping policy: `mappings/inputField.ts` maps client field to concrete
  GraphQL type. Its two `Record`s are keyed on the client's own literal unions,
  so this module is where a client contract change stops compiling.
- Validation policy: `validation/inputContract.ts` asserts every publication
  invariant listed above and throws on violation. It runs per request, scoped to
  the requested calculator.
- Documentation boundary: RSK interpretation stays in the client's README
  (including the percentage-conversion asymmetry). The domain README documents
  publication semantics, reachability, and its two deliberate deviations.
- Testable domain contract: 61 tests across the service, the mapper and the
  validation module.

## Section 5: Domain Implementation Plan

Goal: turn the chosen domain boundary into concrete code changes.

Work:

- update `TaxCalculatorsModule` imports if the domain should inject the rebuilt
  client service
- update `TaxCalculatorsService` to call the chosen client boundary
- update or move the calculator identity mapping
- update the field mapper
- update GraphQL models and descriptions
- remove stale references to old client helpers or Zod-derived contracts
- update tests around public behavior and mapping rules
- split mapping and validation into focused modules; do not leave all behavior
  in the service

Output:

- file-by-file implementation plan
- focused test plan
- verification commands
- known risks and intentional downstream breaks

Suggested domain structure:

```text
src/lib/
  models/
    taxCalculator.model.ts
    inputField.model.ts
    inputFieldType.model.ts
    inputFieldSemantic.model.ts
    inputFieldOption.model.ts
    inputFieldDependency.model.ts
    inputDependencyValue.model.ts

  mappings/
    calculatorType.ts
    inputField.ts

  validation/
    inputContract.ts

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
- calculation remains deferred unless the client output contract exists and the
  domain output contract was designed from it
- stale docs and comments are gone
- downstream breaks, if any, are explicit and not accidental

Verification:

- run focused domain tests
- run focused client tests if client exports are touched
- run typecheck targets if practical
- review the final code against this roadmap before closing the work
