# Tax Calculators Domain Output Contract — Implementation Plan

Implementer-facing plan for adding output metadata to
`libs/api/domains/tax-calculators`.

Intent: GraphQL/domain modeling only. The client already owns the RSK-facing
output contract and curated output mappers. This domain mediates that contract
into a public GraphQL shape that consumers can query without reasoning about
client internals.

Read `ROADMAP.md` first. It is the control document and records the settled
design. This file is the file-by-file execution plan.

## Goal Checkpoint

```text
Goal: expose the client-owned calculator output contract through a robust public GraphQL model.
Current phase: implement the domain GraphQL output metadata contract.
Scope: libs/api/domains/tax-calculators only.
Reachability: the four public TaxCalculatorType calculators only.
Non-goals: no web renderer, no Contentful editor work, no calculation execution, no old output compatibility, no new public calculator enum members.
Next action: add output-specific GraphQL models because output fields have different invariants from input fields and must not reuse input GraphQL types.
```

## Settled Decisions

- The domain exposes output metadata on `TaxCalculator.outputFields`.
- The domain does not execute calculations in this round.
- The public output contract is not a thin wrapper around the client contract.
  It conditions the data in the same spirit as the input contract.
- Input and output GraphQL types stay separate. They share a modeling pattern,
  not public types.
- Top-level output fields expose common `key` and `type` through
  `TaxCalculatorOutputField`, matching the input contract's consumer-friendly
  enum-discriminator pattern.
- Scalar output metadata is reusable through `TaxCalculatorOutputScalarField`,
  which represents only non-array output fields.
- Number output fields are the only output fields that expose `semantic`.
- Array output fields expose scalar `itemFields`; nested arrays and object
  groups are not part of the client v1 output contract and are not invented here.
- `TaxCalculatorOutputFieldType.ARRAY` mirrors input's `SELECT`: it is an
  ordinary public field type whose concrete object carries extra metadata.
- Output fields expose no `required`, `dependsOn`, `options`, labels, layout,
  grouping, public `kind`, or RSK source keys.
- Public reachability stays at the four current `TaxCalculatorType` members:
  `withholdingTaxOnWages`, `childBenefit`, `vehicleTax`, and `vehicleBenefit`.
- `vehicleDepreciation` and `interestBenefit` remain unreachable until the
  shared enum/content model work happens elsewhere.
- "Only number outputs carry `semantic`" is a throwing publication invariant,
  not a lenient drop-the-field mapping -- confirmed deliberately for outputs,
  not inherited from the input side. Validation reads the client's static
  in-process contract registry, never live RSK response data, so a violation is
  a code bug the domain tests catch before deploy rather than a runtime data
  condition. This matches the resolver's existing documented decision to keep
  the root query non-nullable and surface publication-invariant violations
  instead of degrading around them. Serving the field with `semantic` dropped
  would instead render an unformatted currency figure on the public site with
  nothing signalling why.
- Output percentage semantics must not assert a universal 0-1 scale. The client
  documents that output ratio scale is unverified and passed through unchanged.

## Target GraphQL Shape

```graphql
type TaxCalculator {
  type: TaxCalculatorType!
  inputFields: [TaxCalculatorInputField!]!
  outputFields: [TaxCalculatorOutputField!]!
}

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

`TaxCalculatorOutputFieldType` values mirror the client scalar output type
literals:

- `number`
- `string`
- `boolean`
- `date`
- `array`

`TaxCalculatorOutputFieldSemantic` values mirror the client semantic literals:

- `currency`
- `percentage`
- `year`
- `month`
- `count`

The output semantic enum is separate from the input semantic enum so its
descriptions can reflect output-specific uncertainty. In particular,
`percentage` must not say "0-1 ratio".

## Domain Conditioning

Map client output metadata into public GraphQL concepts:

| Client                   | Domain                                             |
| ------------------------ | -------------------------------------------------- |
| `name`                   | `key`                                              |
| scalar `type: 'number'`  | `TaxCalculatorNumberOutputField`                   |
| scalar `type: 'string'`  | `TaxCalculatorStringOutputField`                   |
| scalar `type: 'boolean'` | `TaxCalculatorBooleanOutputField`                  |
| scalar `type: 'date'`    | `TaxCalculatorDateOutputField`                     |
| scalar `semantic`        | `semantic` only on number output fields            |
| `kind: 'array'`          | `TaxCalculatorArrayOutputField` with `type: array` |
| array `itemFields`       | `[TaxCalculatorOutputScalarField!]!`               |

Do not expose client `kind`. Consumers can query `key` and `type` on every
output field without fragments, and can use `__typename` when they need
type-specific fields such as `semantic` or `itemFields`.

## File Changes

### `src/lib/models/enums.ts`

Add:

- `TaxCalculatorOutputFieldType`
- `TaxCalculatorOutputFieldSemantic`

Keep input and output semantic enums separate even though their values match.
The descriptions are different: input percentage asserts 0-1, output percentage
does not.

Give both new enums a `valuesMap`, matching the input-side enums. Keep the
descriptions short; `ARRAY` only needs to say that it is a repeating group.

### `src/lib/models/outputField.model.ts` (new)

Defines, as TS symbol -> GraphQL name. Follow `inputField.model.ts`: give each
output type a short TS name and its prefixed public name via the decorator
argument.

| TS symbol            | GraphQL name                      | Decorator                                            |
| -------------------- | --------------------------------- | ---------------------------------------------------- |
| `OutputField`        | `TaxCalculatorOutputField`        | `@InterfaceType`                                     |
| `OutputScalarField`  | `TaxCalculatorOutputScalarField`  | `@InterfaceType`, `implements: () => OutputField`    |
| `NumberOutputField`  | `TaxCalculatorNumberOutputField`  | `@ObjectType`, `implements: () => OutputScalarField` |
| `StringOutputField`  | `TaxCalculatorStringOutputField`  | `@ObjectType`, `implements: () => OutputScalarField` |
| `BooleanOutputField` | `TaxCalculatorBooleanOutputField` | `@ObjectType`, `implements: () => OutputScalarField` |
| `DateOutputField`    | `TaxCalculatorDateOutputField`    | `@ObjectType`, `implements: () => OutputScalarField` |
| `ArrayOutputField`   | `TaxCalculatorArrayOutputField`   | `@ObjectType`, `implements: () => OutputField`       |

`OutputField` and `OutputScalarField` are `abstract class`es. The full chain,
as built and verified in the probe:

- `OutputField` declares `key` and `type` with their `@Field` descriptions.
- `OutputScalarField extends OutputField` **and** passes
  `implements: () => OutputField` to its `@InterfaceType`. Both are required:
  `extends` is what inherits the field metadata and descriptions so they are
  declared once, and `implements` is what makes GraphQL emit
  `interface TaxCalculatorOutputScalarField implements TaxCalculatorOutputField`.
  Its body stays empty -- `type` is declared once on `OutputField` (see
  below).
- the four scalar object types `extends OutputScalarField` with
  `implements: () => OutputScalarField`. NestJS adds the transitive
  `TaxCalculatorOutputField` itself, so do not list both.
- `ArrayOutputField extends OutputField` with `implements: () => OutputField`,
  adding `itemFields`.

Use data-driven `resolveType`, following the input model's pattern. Mapper
objects should remain plain objects; no `instanceof` dependency.

Both interfaces need a `resolveType`, and the `type` -> class table must exist
in exactly one place. Use one shared function over the whole enum, and give it
to both interfaces:

```ts
const resolveOutputField = (value: OutputField) => {
  switch (value.type) {
    case TaxCalculatorOutputFieldType.NUMBER:
      return NumberOutputField
    case TaxCalculatorOutputFieldType.STRING:
      return StringOutputField
    case TaxCalculatorOutputFieldType.BOOLEAN:
      return BooleanOutputField
    case TaxCalculatorOutputFieldType.DATE:
      return DateOutputField
    case TaxCalculatorOutputFieldType.ARRAY:
      return ArrayOutputField
    default: {
      const unhandled: never = value.type
      return unhandled
    }
  }
}
```

Both interfaces pass `resolveType: resolveOutputField`. Sharing it is sound
because the mapping is total: ARRAY never arrives through the scalar interface,
since no array field implements it.

`ScalarOutputFieldType` (`Exclude<TaxCalculatorOutputFieldType, ...ARRAY>`) is
still needed, but only to type the mapper's `Record` so a client scalar output
type cannot map to ARRAY. It is not used by `resolveType`.

**Do not narrow `type` by redeclaring it on `OutputScalarField`.** It looks
tempting -- it would let a scalar-only helper keep a tighter exhaustiveness
check -- but `noImplicitOverride` then requires the `override` modifier, and
this repo's prettier is pinned at **2.2.0**, which predates that syntax
(prettier added it in 2.3) and fails with `SyntaxError: Unexpected token`. One
shared switch avoids the question entirely and keeps `type` declared once, on
`OutputField`.

Annotate the `value` parameter explicitly, as `inputField.model.ts` does —
NestJS types the `resolveType` argument loosely, and without the annotation the
`const unhandled: never` is dead code instead of a compile-time guarantee that
every enum member is handled.

Co-locate both interfaces and all five implementors in this one file for the
same module-load-order reason as `inputField.model.ts`. Keep comments and field
descriptions short; the domain README and roadmap carry the design rationale.

`ArrayOutputField.itemFields` must be typed `[OutputScalarField!]!`, never
`[OutputField!]!` — that is what keeps an array inside an array unrepresentable
in the schema, matching the client's
`CalculatorArrayOutputField.itemFields: readonly CalculatorScalarOutputField[]`.

Interface-implements-interface is confirmed working at this repo's versions
(`@nestjs/graphql` 13.4.2, `graphql` 16.14.2) — this exact type graph was built
and its schema printed during review:

- `interface TaxCalculatorOutputScalarField implements TaxCalculatorOutputField`
  emits.
- The concrete types emit as
  `implements TaxCalculatorOutputScalarField & TaxCalculatorOutputField`.
  NestJS adds the transitive interface itself from the prototype chain
  (`object-type-definition.factory`'s `generateInterfaces` unions
  `metadata.interfaces` with `parentClass.getInterfaces()`), so declaring only
  `implements: () => OutputScalarField` satisfies GraphQL's transitive
  declaration rule.
- `itemFields: [TaxCalculatorOutputScalarField!]!` emits, and all five
  implementors register without `orphanedTypes`.

No union fallback is needed.

### `src/lib/mappings/outputField.ts` (new)

Map `CalculatorOutputField` to the public domain model.

Use `Record` mappings keyed on the client's literal unions:

- `CalculatorOutputScalarType -> TaxCalculatorOutputFieldType`
- `CalculatorFieldSemantic -> TaxCalculatorOutputFieldSemantic`

Use exhaustive switches so a new client output `kind` or scalar `type` fails at
compile time here.

Semantic _placement_ is not compile-time enforced, and the plan must not imply
it is: the client's `CalculatorScalarOutputField.semantic?` is permitted on any
scalar type, so "only number outputs carry `semantic`" is a runtime validation
invariant. No current client contract violates it. This mirrors the input side.

Map client array fields to `TaxCalculatorOutputFieldType.ARRAY`. Scalar fields
map to their scalar type.

### `src/lib/models/taxCalculator.model.ts`

Add:

```ts
@Field(() => [OutputField], {
  description: '...',
})
outputFields!: OutputField[]
```

`OutputField` is the abstract interface class from `outputField.model.ts`; the
public name `TaxCalculatorOutputField` comes from its decorator, so the
`@Field` thunk takes the TS symbol, exactly as `inputFields` takes `InputField`.

Write the description to mirror `inputFields`: order carries no meaning (the
client sorts by `name`, `itemFields` included), consumers match on `key`, and it
carries no display text.

### `src/lib/tax-calculators.service.ts`

Return:

```ts
{
  type,
  inputFields: contract.inputFields.map(toInputField),
  outputFields: contract.outputFields.map(toOutputField),
}
```

Keep service synchronous. The client contract lookup is still an in-process
registry lookup.

The `validation/inputContract.ts` -> `validation/contract.ts` rename also
changes this file's import at `tax-calculators.service.ts:9`. The compiler
catches it, but it is part of this change, not an incidental fixup.

### Validation

Rename `validation/inputContract.ts` -> `validation/contract.ts` (and
`inputContract.spec.ts` -> `contract.spec.ts`) and add the output invariants
inside the existing `assertPublishableContract`. Do not add a second validator
module.

Rationale: the exported function is already named `assertPublishableContract`
and already receives the whole `CalculatorContract`, which already carries
`outputFields`. A second module would mean two entry points validating one
object and two calls from the service, for no gain. Keep the existing internal
helper structure (`fail`, `assertFieldShape`, ...) and add output helpers
alongside them.

Output publishability invariants:

- `outputFields` is non-empty for each reachable published calculator.
- top-level output keys are non-empty.
- top-level output keys are unique within the calculator.
- number outputs may carry `semantic`.
- non-number scalar outputs must not carry `semantic`.
- array output `itemFields` is non-empty.
- array item keys are non-empty.
- array item keys are unique within the array.
- number array item fields may carry `semantic`.
- non-number array item fields must not carry `semantic`.

Do not validate output field order. Order carries no meaning.

Do not validate output value availability. That belongs to calculation result
mapping, not metadata publication.

## Tests

### `src/lib/mappings/outputField.spec.ts`

Cover mapper shape with hand-built fields:

- number scalar maps to `TaxCalculatorNumberOutputField` shape and preserves
  semantic.
- string scalar maps to `TaxCalculatorStringOutputField`.
- boolean scalar maps to `TaxCalculatorBooleanOutputField`.
- date scalar maps to `TaxCalculatorDateOutputField`, even if no current
  reachable calculator publishes one.
- array output maps to `TaxCalculatorArrayOutputField`.
- array `itemFields` reuse the scalar mapper and preserve number semantics.

### Contract validation specs

Add output invalid-contract cases:

- empty `outputFields`
- empty top-level output key
- duplicate top-level output key
- semantic on non-number top-level scalar
- empty array `itemFields`
- empty array item key
- duplicate array item key
- semantic on non-number array item scalar

### `src/lib/tax-calculators.service.spec.ts`

Keep testing only the four reachable `TaxCalculatorType` members.

Add representative output assertions:

- every reachable calculator returns non-empty `outputFields`.
- `withholdingTaxOnWages` exposes `taxBrackets` as an array output.
- `taxBrackets.itemFields` includes `lowerBound`, `bracketNumber`,
  `withholdingRate`, and `calculatedWithholding`.
- `vehicleTax.vehicleTax` is a number output with `currency`.
- `vehicleTax.periodLabel` is a string output.
- `vehicleTax.vehicleWeight` is a number output with no semantic.
- `vehicleBenefit.monthlyBenefit` is a number output with `currency`.
- `childBenefit.splitCustody` is a boolean output.

## Verification

Focused checks, when practical:

```bash
yarn nx run api-domains-tax-calculators:test
```

Schema build is the load-bearing check for interface registration, and the only
thing that proves interface-implements-interface emits correctly. Run it before
reporting done, not only the unit tests:

```bash
INIT_SCHEMA=true yarn ts-node -P apps/api/tsconfig.json scripts/build-graphql-schema.ts apps/api/src/app/app.module
```

Do not broaden scope to web or Contentful consumers in this round.

## Documentation Updates

After implementation:

- update the `taxCalculator` query description in
  `tax-calculators.resolver.ts`. It currently says "The input contract for a
  calculator", which stops being true the moment `outputFields` ships. This is a
  code change, not just docs — do it as part of implementation.
- update `README.md` to describe `outputFields`. Three concrete spots go stale,
  beyond the two listed below: the opening summary at `README.md:3-4` ("Serves
  the input contract ... so a consumer can render a generic form"), the
  `## The query` SDL block at `README.md:8-22`, which shows `type TaxCalculator`
  without `outputFields`, and `README.md:118-124`, which reserves the operation
  name `taxCalculatorCalculate` — keep that reservation, since calculation
  execution stays a later round.
- update `README.md:55`, which names `validation/inputContract.ts` by path —
  the rename makes it a dangling reference.
- remove `README.md`'s claim that "The client exposes no curated output
  contract" — it is now false.
- remove the statement that calculation/output contract is deferred, replacing
  it with: output metadata is exposed; calculation execution remains separate
  unless implemented in a later round.
- revisit `README.md`'s "deliberate deviations" list: the output side adds a
  second interface (`TaxCalculatorOutputScalarField`) purely to keep nested
  arrays unrepresentable, which the input side has no equivalent of. Record it
  there so it reads as intentional.
- keep `ROADMAP.md` at the design/control level. Do not duplicate this file's
  file-by-file plan there.
