# RSK Calculators Client Rebuild

## Goal

Build the RSK calculators client as a set of small, explicit calculator modules.

Each calculator owns RSK-facing contract and mapping decisions:

- the authored machine-readable input contract for that calculator
- the mapper from that contract's input shape to RSK's query parameters
- the authored machine-readable output contract for that calculator, once the
  output flow is designed
- the mapper from RSK's response shape to that output contract, once the output
  flow is designed

The client should make RSK's API understandable to downstream code without
owning downstream presentation, GraphQL, Contentful, or translation concerns.

## Decision Discipline

Every design or implementation decision made during this rebuild must be backed
by a reason.

Do not record a preference, inference, cleanup, abstraction, or scope change as
a decision unless the reason for making it is also written down.

A decision record should answer:

- what was decided
- why it was decided
- what evidence or constraint supports it
- what was deliberately not decided

If an agent cannot state the reason for a decision, it should not make the
decision. It should either keep the existing design, ask for clarification, or
record the point as open.

This rule is especially important when translating short user guidance into
written architecture. The written version is a new claim, and it needs its own
reasoning before it becomes durable.

## Running Decision Log

Maintain a running decision log in Obsidian while working on this rebuild.

Use:

```text
/Users/mani/obsidian-hxm/digital-iceland/rsk-calculators-notes/
```

Use the hammer approach first: log broadly, then narrow the triggers later if
the log becomes noisy.

Log a decision when any of these happen:

- adding, removing, renaming, or moving a file or module
- adding a shared helper or abstraction
- changing the contract shape
- changing a calculator field's name, type, semantic, requiredness, options, or
  dependency
- choosing an interpretation not directly stated by RSK docs/API
- deciding not to implement something that was discussed
- crossing or touching the client/domain/CMS boundary
- changing tests because the expected contract changed

If unsure whether to log, log it.

Each entry should include:

- the decision
- why it was made
- what evidence or constraint supports it
- what remains open or deliberately out of scope

Do not use the log for command transcripts or implementation noise. It is for
durable reasoning that a later human or agent needs in order to avoid reopening
the same question.

## Goal Checkpoint

Before changing this design or implementing against it, restate the task in this
shape:

```text
Goal: rebuild the RSK calculators client as explicit per-calculator modules.
Current phase: implement the v1 custom input contract.
Non-goals: no Zod-built contract, no generic calculator execution, no public/domain identities in the client.
Next action: <action> because <reason>.
```

For output-flow work, restate the task in this shape instead:

```text
Goal: add a client-owned output flow that mirrors the explicit input contract.
Current phase: implement the v1 custom output contract.
Non-goals: no GraphQL shape, no Contentful config shape, no frontend rendering, no public/domain identities in the client.
Next action: <action> because <reason>.
```

If the next action does not serve that goal, do not do it.

## Non-Goals

- Do not use Zod to validate or construct the custom calculator input contract.
- Do not build a generic calculator execution framework.
- Do not make the client aware of `TaxCalculatorType` or other public
  Ísland.is calculator identities.
- Do not author translated labels in the client.
- Do not make field order meaningful.
- Do not add nested object groups or layout groups to the output contract.

Zod elsewhere is outside this decision. The contracts implemented in this
document are the custom calculator input contract and the v1 output contract.

## Module Shape

Each calculator lives in its own folder under `src/lib/domains`.

```text
libs/clients/rsk/calculators/src/lib/
  contracts/
    byName.ts
    field.ts
    output.ts
    registry.ts
  utils/
    toNumber.ts
    toRskValue.ts

  domains/
    childBenefit/
      contract.ts
      childBenefit.ts
      childBenefitOutput.ts
      index.ts
```

`contract.ts` owns the authored input contract, the authored output contract,
the calculator input type, and the calculator output type. It is plain contract
data.

It was called `schema.ts` until the output round. Two reasons to rename: the
name invited reading it as a validation schema, which it is not and never was,
and a repo-wide `.gitignore` rule for generated GraphQL `schema.ts` files was
silently keeping all six of these out of version control.

`childBenefit.ts` owns the outbound mapper to RSK query parameters.

`childBenefitOutput.ts` owns the inbound mapper from the generated RSK result to
the curated client output.

`index.ts` exports the calculator contract, input type, output type, and both
mappers.

The same pattern applies to the other calculators.

## Client Contract

The exported contract is plain typed data.

```ts
export interface CalculatorContract<TKey extends string = string> {
  key: TKey
  inputFields: readonly CalculatorField[]
  outputFields: readonly CalculatorOutputField[]
}

export type CalculatorFieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'select'

export type CalculatorFieldSemantic =
  | 'currency'
  | 'percentage'
  | 'year'
  | 'month'
  | 'count'

export interface CalculatorField {
  name: string
  type: CalculatorFieldType
  required: boolean
  semantic?: CalculatorFieldSemantic
  options?: readonly CalculatorFieldOption[]
  dependsOn?: CalculatorFieldDependency
}

export interface CalculatorFieldOption {
  value: string
}

export interface CalculatorFieldDependency {
  field: string
  equals: string | number | boolean
}
```

Rules:

- `semantic` is used for number fields.
- `options` is used for select fields.
- `dependsOn` supports simple equality conditions only.
- field identity is `name`.
- exported fields are sorted by `name` using code-unit comparison.

`CalculatorField` and its supporting types live in `contracts/field.ts`.
`CalculatorOutputField` and its supporting types live in `contracts/output.ts`;
the Output Flow section is the authority on their shape.

## Input Types

Input types are authored explicitly in each calculator's `contract.ts`.

Why: deriving the types from the field contract keeps each field written once,
but the required TypeScript mapped-type machinery is opaque enough to make
ordinary debugging harder. The client favours readable per-calculator input
types for this v1 contract. If the number of calculators or repeated input
patterns grows enough to make duplication the larger risk, reintroduce a helper
deliberately and keep it small.

For `type: 'date'`, the explicit input value is a `yyyy-MM-dd` string. The
contract's `date` type tells downstream consumers to render a date control; it
does not mean the submitted contract value is a JavaScript `Date`.

Input types are still client-facing types only. They must not introduce runtime
parsing, validation, dependency interpretation, semantic-specific behavior,
outbound RSK query parameters, or other calculator behavior.

The field contract remains the downstream metadata contract. The input type is
the TypeScript call shape for the mapper/service method. Keep the two next to
each other in `contract.ts` and update the calculator's contract and mapper tests
when a field name, requiredness, option set, or value type changes.

## Registry

`contracts/registry.ts` collects the calculator contracts and derives the
client-local calculator key type.

```ts
export const calculatorRegistry = {
  childBenefit: childBenefitCalculator,
  vehicleTax: vehicleTaxCalculator,
  vehicleBenefit: vehicleBenefitCalculator,
  vehicleDepreciation: vehicleDepreciationCalculator,
  withholdingTax: withholdingTaxCalculator,
  interestBenefit: interestBenefitCalculator,
} as const

export type CalculatorKey = keyof typeof calculatorRegistry
```

The registry key is a client-local RSK calculator identity. It is not the public
`TaxCalculatorType`.

Base contract types should not import the registry.

## Service API

The service exposes a generic contract lookup:

```ts
getCalculator(key: CalculatorKey): CalculatorContract<CalculatorKey>
```

This method returns the downstream machine-readable contract. The GraphQL domain
consumes it, maps it to the public GraphQL model, and hands that result onward
to CMS/frontend consumers.

The canonical downstream boundary is the Nest service. The GraphQL domain should
inject the calculators client module/service and call `getCalculator`. The
method may be asynchronous if the service shape needs it.

Calculation methods stay explicit:

```ts
getChildBenefit(input: ChildBenefitInput)
getVehicleTax(input: VehicleTaxInput)
getVehicleBenefit(input: VehicleBenefitInput)
getVehicleDepreciation(input: VehicleDepreciationInput)
getWithholdingTax(input?: WithholdingTaxInput)
getInterestBenefit(input: InterestBenefitInput)
```

There is no generic `calculate(key, input)` method. The key-to-endpoint
association is manual, so generic execution does not buy much and would weaken
the per-calculator types.

`getWithholdingTax` keeps its optional input. RSK's generated query type allows
the query object to be omitted, and a bare call returns RSK's defaults. Making
the argument required would silently remove an existing client capability.

## Output Flow

The output flow mirrors the input flow, starting in the client:

```text
RSK response
  -> per-calculator response mapper
  -> authored client output contract
  -> downstream mediation and rendering
```

The client-owned parts are only the first three steps. GraphQL shape,
`TaxCalculatorType`, Contentful `configJson`, labels, result layout, formatting,
and renderer behavior stay downstream.

The client must not ask downstream code to infer a public result contract from
raw generated `Get*Response` types. Those types are RSK wire shapes: they contain
RSK names, optional/null generated fields, and nested structures that may or may
not be public result concepts. Every calculator therefore publishes an explicit
output contract, and every calculation method returns a mapped value.

The v1 output contract is plain typed data. Output metadata is part of the full
calculator contract returned by `getCalculator(key)`, not a separate
`getCalculatorOutput(key)` lookup.

```ts
export type CalculatorOutputField =
  | CalculatorScalarOutputField
  | CalculatorArrayOutputField

export type CalculatorOutputScalarType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'

export interface CalculatorScalarOutputField {
  name: string
  kind: 'scalar'
  type: CalculatorOutputScalarType
  semantic?: CalculatorFieldSemantic
}

export interface CalculatorArrayOutputField {
  name: string
  kind: 'array'
  itemFields: readonly CalculatorScalarOutputField[]
}
```

The full calculator contract is:

```ts
export interface CalculatorContract<TKey extends string = string> {
  key: TKey
  inputFields: readonly CalculatorField[]
  outputFields: readonly CalculatorOutputField[]
}
```

Output fields are addressable result values, not layout. The client exposes
stable English output keys, value type, and number semantic where one applies.
It does not expose labels, result groups, display ordering, assumptions copy,
formatting, or raw RSK source keys.

V1 supports scalar fields and array fields. Arrays are required because
withholding tax must expose `skattthrep` as `taxBrackets`. V1 deliberately does
not add nested object groups: `vehicleTax.fyrraTimabil` and `seinnaTimabil` are
out of v1 unless a later design adds stable prefixed scalar keys or an explicit
structural primitive with a recorded reason.

Output field order is not meaningful. `getCalculator(key)` returns
`inputFields`, `outputFields`, and array `itemFields` sorted by `name` using the
same code-unit comparator as input fields.

Mapped outputs expose no `null`. Scalar output properties are optional and are
omitted or set to `undefined` when RSK returns `undefined` or `null`. Array
output properties are always arrays and fall back to `[]`.

Output fields do not have `required`. Input `required` tells callers what they
must submit; output availability is represented by the mapped output value
shape.

Calculation methods return mapped client output values. If generated `data` is
`undefined`, the service returns `undefined`; otherwise it returns the mapped
`*Output`.

Raw generated `Get*Response` types are not re-exported from the public client
barrel. They remain internal wire types for implementation and tests.

Response mappers live one per calculator in `<calculator>Output.ts` and take a
non-undefined generated result, so the `data` absence check happens once, in
the service. The client does not runtime-validate output contracts; authored
data plus mapper tests are the safety net.

One thing the contract deliberately does not assert is the scale of output
ratio fields. RSK documents ratio inputs as 0-1 and says nothing about ratios
in a response, so mappers pass them through unchanged and their tests assert
mapping rather than scale.

Rejected alternatives:

- separate `getCalculatorOutput(key)` lookup
- raw RSK property names as public output keys
- layout groups in the client contract
- nested object groups in v1
- `required` on output fields
- exposing `null` in mapped output values
- exposing raw generated `Get*Response` types as the public output contract

## Boundary With Tax Calculator Domain

The RSK client owns RSK API interpretation:

- which RSK endpoint a calculator maps to
- which client field maps to which RSK query parameter
- whether a number means currency, percentage, year, month, or count
- requiredness, based on RSK docs/API where possible and RSK-side
  interpretation where needed
- option values transcribed from RSK docs/forms/API
- conditional API behavior, such as fields that only apply when another field
  has a specific value
- outbound defaults required by RSK, such as optional booleans sent as `false`
- conversions from accepted client input values to generated RSK query values,
  such as converting a `yyyy-MM-dd` date string to `Date` when the generated RSK
  client requires it
- which RSK response values become part of the curated output contract
- conversions from generated RSK response values to published client result
  values

The client stops there.

If RSK does not state requiredness clearly, preserve the current behavior or
mark the field optional and record the uncertainty. Do not infer requiredness
from UI preference.

The public tax calculator domain owns Ísland.is publication semantics:

- mapping public `TaxCalculatorType` values to client-local `CalculatorKey`
  values
- mapping `CalculatorContract` to GraphQL models and enums
- mapping the future client output contract to GraphQL models and enums
- deciding what CMS/frontend consumers need beyond the client contract
- public naming, labels, translation, layout, and editor behavior

This mediation belongs in `libs/api/domains/tax-calculators`, not in the RSK
client.

`libs/tax-calculators` remains the shared public calculator identity/config
library. It should not own RSK client contract details.

## Labels And Options

The client does not author translated labels.

Field names and option values are the machine-readable identifiers downstream
consumers receive. If a downstream layer needs labels, translations, or
presentation-specific copy, that layer owns them.

`CalculatorFieldOption.value` is the accepted client input value. It does not
have to be the raw RSK wire value. If RSK expects another value, the
per-calculator mapper converts from the client value to the RSK query value.

Option values are compatibility-sensitive because downstream consumers may store
or submit them.

## Dependencies

The contract supports simple equality dependencies only:

```ts
dependsOn: { field: 'splitCustody', equals: true }
```

More complex conditional behavior is out of scope for this contract shape. If a
calculator later needs compound conditions, ranges, or multi-value conditions,
extend the contract deliberately rather than adding ad hoc behavior in the
domain or frontend.

Do not extend the contract shape during the rebuild unless the current
calculator cannot be represented with the v1 shape. Record other needs as
follow-up work.

## Field Ordering

Field identity is by `name`.

Source declaration order is not meaningful. `getCalculator(key)` should return
fields sorted by `name` using code-unit comparison so the output is
deterministic without making authoring order part of the contract.

Use the explicit comparator exported from `contracts/byName.ts`:

```ts
export const byName = <T extends { name: string }>(a: T, b: T): number =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
```

It lives in `contracts/` rather than `utils/` because deterministic ordering is
part of the contract boundary, not a general-purpose utility. It is the single
comparator for input fields, output fields, and array `itemFields`; do not
inline a second copy.

Do not use `localeCompare` or `sortAlpha` for this boundary. Those are
appropriate for human-facing label sorting, not machine contract keys.

Consumers must not use array position as identity.

Any visual or editorial ordering belongs downstream.

Pin code-unit sorting in one `getCalculator` test using `withholdingTax`, which
contains `payMonth` and `paymentFrequency` and distinguishes this comparator
from locale-aware sorting. Do not pin field ordering in per-calculator contract
fixtures; those fixtures should verify fields by name.

## Compatibility

Calculator keys and field names are compatibility-sensitive because downstream
layers may store or reference them.

Changing a field's RSK-side semantic, requiredness, options, or dependency is
also meaningful and should be treated as a contract change.

Adding a field is usually safer than renaming or removing one, but it still
needs to be checked against the GraphQL/domain and CMS/frontend flow.

Each calculator contract should have a focused fixture test. The domain mapping
should also have a fixture test so field renames, option changes, semantic
changes, and dependency changes are reviewed intentionally.

Contract changes require an intentional test update and a short note explaining
why the change is RSK-correct.

## Pitfalls To Avoid

- Do not rebuild the old schema-introspection mechanism under a new name.
- Do not let the contract become a broad validation DSL.
- Do not add translated labels to the client.
- Do not import public/domain calculator identities into the RSK client.
- Do not create a third calculator identity unless there is a clear boundary
  reason.
- Do not rely on field order.
- Do not make calculation generic without a concrete need.
- Do not move RSK interpretation into the GraphQL domain.
- Do not move GraphQL, Contentful, or frontend presentation semantics into the
  client.
