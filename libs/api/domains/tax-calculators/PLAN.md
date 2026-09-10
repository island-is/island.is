# Tax Calculators Domain — Implementation Plan

Implementer-facing plan for `libs/api/domains/tax-calculators`, derived from
`ROADMAP.md` in this directory and from the rebuilt client in
`libs/clients/rsk/calculators`.

Intent: **rebuild of an existing module**. No NX generation. Scope is this
library only.

Read `ROADMAP.md` first — it is the control document. This plan is the
file-by-file execution of its Sections 1–5.

## Starting state (verified against source)

- The domain **does not compile**: `tax-calculators.service.ts` imports
  `getCalculatorInputProps` and `InputProp`, neither exported by the client any
  more since `cfe4db9245`. The client's `ROADMAP.md` §6 says this is deliberate
  — Sections 1–6 are meant to land together.
- The client exposes `getCalculator(key: CalculatorKey):
  CalculatorContract<CalculatorKey>` — synchronous, registry-backed, returning
  fields sorted by `name` in code-unit order. `new CalculatorsClientService()`
  takes no constructor arguments.
- Client field shape: `{ name, type: 'number'|'string'|'boolean'|'date'|'select',
  required, semantic?, options?: readonly {value}[], dependsOn?: { field,
  equals: string|number|boolean } }`.
- **No client output contract exists.** Every client mapper is outbound-only
  (`toChildBenefitQuery` and siblings map input → RSK query params); there is no
  response mapping anywhere, and the only result types exported are raw
  generated `Get*Response`. Roadmap §3's checkpoint therefore resolves to:
  **calculation stays deferred; output-contract work belongs to the client
  roadmap.**
- **Only two dependencies exist across all six calculators**, both in
  `childBenefit`, both `{ field: 'splitCustody', equals: true }`. No string or
  number dependency exists in real data.
- Every number field in all four reachable calculators carries a `semantic`
  today.
- `apps/api/src/api.graphql`, `libs/api/schema/src/lib/schema.ts` and
  `apps/native/app/src/graphql/types/schema.tsx` are **all gitignored**
  (`.gitignore` 81/83/84). None is authoritative; each currently describes a
  different historical shape. Note the client's `PLAN.md` claims these are
  "checked in" — that is wrong.
- Live consumers, both already mismatched with the resolver on disk — they query
  `taxCalculator(calculatorType: …) { fields { … } }`, which no longer exists:
  `apps/web/screens/queries/TaxCalculators.ts` (+
  `components/Organization/Slice/Calculator/Calculator.tsx`) and
  `apps/contentful-apps/components/editors/CalculatorEditor/{constants.ts,types.ts}`.
- **No native consumer.** The gitignored native `schema.tsx` holds a fifth shape
  (`taxCalculatorFields`, `TaxCalculatorField { kind, options }`), but nothing
  under `apps/native/app/src/graphql/queries/` or `src/screens/` references
  `taxCalculator`. Recorded because those stale types look alarming on first
  encounter.

## Settled decisions

| Decision | Answer |
|---|---|
| Scope | This library only. Consumers stay red; fixed in follow-up work. |
| Reachability | Four calculators. `TaxCalculatorType` keeps its 4 members; `vehicleDepreciation` and `interestBenefit` stay unreachable (growing the enum touches `libs/tax-calculators`, `libs/cms`, `apps/contentful-apps` and the Contentful content model). |
| Root query nullability | **Non-null** `TaxCalculator!`, per roadmap. 374 of 666 root Query fields in the merged schema are already non-nullable, so `conventions/graphql.md`'s "always nullable" is a preference in practice. The source is a static in-process registry — no network, no service-down mode. |
| Enum file placement | Single `models/enums.ts` per `conventions/domain-module.md`, **not** the roadmap's per-enum `*.model.ts` files (a `.model.ts` with no `@ObjectType` reads wrong; the roadmap calls its layout "suggested"). |
| Feature flag | None. Consumer is a public Contentful-driven web slice. |
| Auth | Public/unauthenticated — no `IdsUserGuard`, `ScopesGuard`, `@Scopes`, `@Audit`. `ApiScope.internal` not applicable. |
| Calculation | Deferred. `taxCalculatorCalculate` reserved by name only. |
| GQL prefix | `TaxCalculator*`. No collisions outside this module. |
| Input semantics | The domain exposes the client's five input semantics (`currency`, `percentage`, `year`, `month`, `count`) as the public `TaxCalculatorInputFieldSemantic` set. `semantic` is optional and only appears on number input fields. |

## Target contract

Exactly `ROADMAP.md` §2's SDL:

```graphql
taxCalculator(type: TaxCalculatorType!): TaxCalculator!

type TaxCalculator { type: TaxCalculatorType!, inputFields: [TaxCalculatorInputField!]! }

interface TaxCalculatorInputField {
  key: String!
  type: TaxCalculatorInputFieldType!
  required: Boolean!
  dependsOn: TaxCalculatorInputFieldDependency
}
# implemented by TaxCalculator{Number,String,Boolean,Date,Select}InputField
# Number adds  semantic: TaxCalculatorInputFieldSemantic
# Select adds  options: [TaxCalculatorInputFieldOption!]!

type TaxCalculatorInputFieldOption { value: String! }
type TaxCalculatorInputFieldDependency { fieldKey: String!, equals: TaxCalculatorInputDependencyValue! }
union TaxCalculatorInputDependencyValue =
    TaxCalculatorBooleanInputDependencyValue
  | TaxCalculatorStringInputDependencyValue
  | TaxCalculatorNumberInputDependencyValue
```

## Field descriptions must migrate

The files being deleted carry consumer-facing `@Field({ description })` text for
exactly the fields that need it, and nothing in the verification step would
catch its loss. Carry these across, reworded for the new names:

- `key` — "Stable identifier for the input, as RSK names it. This is what a
  section field's `key` in the Contentful `configJson` must match."
- `required` — "Whether RSK rejects the calculation when this field is absent."
- `options` (now on `SelectInputField`) — raw identifiers, no display text.
- `dependsOn` — "Set when the field is only part of the input contract under a
  condition. Absent means the field always applies."
- `fieldKey` (was `field`) — "The `key` of the sibling field this one is
  conditional on. Not this field's own key."
- `equals` — what the referenced field must hold for this field to apply.

`fieldKey` and `equals` are the least self-evident fields in the new contract;
they need descriptions most.

## Changes

### Deleted

| File | Why |
|---|---|
| `src/lib/mapper.ts` | Maps the deleted `InputProp` shape; replaced by `mappings/inputField.ts`. |
| `src/lib/models/field.model.ts` | Flat `TaxCalculatorField` replaced by the interface + five concrete types. |
| `src/lib/models/fieldDependency.model.ts` | `equals: Boolean!` replaced by the three-member union. |

### `src/lib/models/enums.ts` (rewritten)

Replaces `TaxCalculatorFieldInputType`, which conflated control kind with
number semantic, with the two enums the new contract separates:

- `TaxCalculatorInputFieldType { NUMBER='number', STRING='string',
  BOOLEAN='boolean', DATE='date', SELECT='select' }` — `SELECT`, not `ENUM`.
- `TaxCalculatorInputFieldSemantic { CURRENCY, PERCENTAGE, YEAR, MONTH, COUNT }`.

Values mirror the client's literals so the mappers are plain `Record` lookups;
lowercase matches the convention for simple enums. Both registered via
`registerEnumType` with per-member `valuesMap` descriptions, carrying over the
useful ones from the current file (PERCENTAGE is a 0–1 ratio, not 0–100;
MONTH's base is undocumented by RSK so no range is asserted). Do **not** restate
the client's percentage-conversion asymmetry — the client README owns it, and
the roadmap's documentation boundary assigns it there.

### `src/lib/models/` (new)

One model per file, except the input-field interface and its five implementors,
which share `inputField.model.ts` — see below for why that exception is load-bearing
rather than a convenience.

Three repo precedents exist for relating an implementor to its interface, and the
choice between them is not ergonomic. `implements: () => …` and the body of
`resolveType` are lazy thunks, but **`extends` is evaluated at class-definition
time**, and a custom `resolveType` forces the interface to reference its
implementors. So the question is whether that reference crosses a module boundary:

| Shape | Form | Precedent |
|---|---|---|
| Interface + implementors in **one file** | `extends` — the reference never crosses a module boundary, and `resolveType`'s body runs long after evaluation | `auth/src/lib/models/delegation.model.ts` (6 implementors, custom `resolveType`) |
| **Split** across files, no custom `resolveType` | `extends` — nothing imports the implementors, so no cycle exists | `icelandic-medicines-agency/.../pharmacyContact.model.ts` |
| **Split** across files **with** a custom `resolveType` | `implements` + redeclare every shared field | `education/.../gradeCategory.model.ts`, `intellectual-properties/.../intellectualProperty.model.ts` |

**This plan takes the first row.** One file keeps `extends`, so the four shared
fields and their `@Field` descriptions are declared once instead of five times,
and it matches the single `inputField.model.ts` that `ROADMAP.md`'s suggested
structure named in the first place.

The split-with-`implements` form was tried first and reverted. It is safe, but it
costs 4 fields × 5 classes = 20 restatements, plus a leaf constants module holding
the shared descriptions so those 20 copies could not drift — both of which the
one-file form removes outright. What ruled out the remaining combination,
split-plus-`extends`, is that it throws `TypeError: Class extends value undefined
is not a constructor or null` depending on which module loads first: entering via
the interface file crashes, entering via an implementor happens to work. Verified
with a minimal repro.

`libs/api/domains/tax-calculators/tsconfig.json` enables `noImplicitOverride`.
The implementors add only their own fields, so no `override` modifier is needed.
If one later redeclares an inherited field to customize its metadata, that
property must be marked `override`; making the base fields abstract would avoid
TS4114 but would also lose the inherited `@Field` metadata that motivates
`extends`.

| File | Contents |
|---|---|
| `taxCalculator.model.ts` | `@ObjectType()` `class TaxCalculator` — class name already equals the GQL name, so no explicit arg. `@Field(() => TaxCalculatorType) type!`; `@Field(() => [InputField]) inputFields!: InputField[]` (interface-in-list has precedent in `education`'s `course.model.ts`). `TaxCalculatorType` is imported from `@island.is/tax-calculators` and **must not** be re-registered — `libs/cms/src/lib/models/calculator.model.ts:17` owns its `registerEnumType`, and registering twice throws. |
| `inputField.model.ts` | The interface **and all five implementors**, in declaration order. `@InterfaceType('TaxCalculatorInputField', { resolveType })` `abstract class InputField` declares `key`/`type`/`required`/`dependsOn?` once, with their descriptions. Annotate the callback parameter explicitly — `resolveType(value: InputField)` — because NestJS types it loosely and the exhaustive `never` default only compiles into a guarantee with the annotation; switch on `value.type`. Then `NumberInputField extends InputField` (adds `@Field(() => TaxCalculatorInputFieldSemantic, { nullable: true }) semantic?`), `StringInputField`, `BooleanInputField`, `DateInputField` (empty bodies — no `GraphQLISODateTime` anywhere: the client's `date` type means "render a date control", and nothing in this contract carries a date *value*), and `SelectInputField` (adds `@Field(() => [InputFieldOption]) options!: InputFieldOption[]` — non-null list, guaranteed by validation). |
| `inputFieldOption.model.ts` | `@ObjectType('TaxCalculatorInputFieldOption') class InputFieldOption { @Field() value!: string }`. |
| `booleanInputDependencyValue.model.ts` | `@ObjectType('TaxCalculatorBooleanInputDependencyValue')`, single `@Field() value!: boolean`. |
| `stringInputDependencyValue.model.ts` | Same, `value!: string`. |
| `numberInputDependencyValue.model.ts` | Same, `@Field(() => Float) value!: number`. |
| `inputDependencyValue.model.ts` | `createUnionType({ name: 'TaxCalculatorInputDependencyValue', types, resolveType })` only — not an `@ObjectType`, so it keeps this file to itself. **`resolveType` must switch on `typeof value.value`**: all three members are structurally `{ value }`, so the field-presence discrimination used by `health-directorate`'s union precedent cannot work here. Return `null` otherwise. |
| `inputFieldDependency.model.ts` | `@ObjectType('TaxCalculatorInputFieldDependency') class InputFieldDependency { @Field() fieldKey!: string; @Field(() => InputDependencyValue) equals!: BooleanInputDependencyValue \| StringInputDependencyValue \| NumberInputDependencyValue }`. The explicit three-class TS union beats `health-directorate`'s `typeof UnionConst` idiom, which is less precise. |

### `src/lib/mappings/` (new)

| File | Contents |
|---|---|
| `calculatorType.ts` | `CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE: Record<TaxCalculatorType, CalculatorKey>` — exhaustive 4-entry map (`withholdingTaxOnWages → withholdingTax` is the one differing name), plus `toCalculatorKey(type)`. Keyed on the enum so a fifth member fails to compile. The domain's identity-mediation point; the client never sees `TaxCalculatorType`. |
| `inputField.ts` | `toInputField(field: CalculatorField): InputField` — switch on `field.type`; `toDependency(dep)`; `toDependencyValue(equals: string \| number \| boolean)`. **This is where a new client `CalculatorFieldType` is caught at compile time** — via the exhaustive switch and the `Record<CalculatorFieldType, …>` keying, not via the interface's `resolveType`, which switches on the *domain* enum. Returns plain objects typed as the concrete classes, not `new`-ed instances: both `resolveType`s are data-driven, so no `instanceof` is needed. Use `?? undefined`, never `null`. |

### `src/lib/validation/inputContract.ts` (new)

`assertPublishableContract(requestedKey: CalculatorKey, contract:
CalculatorContract<CalculatorKey>): void`, throwing `Error`s that name the
calculator and field. A short comment should record why a bare `Error`
(surfacing as an unqualified `INTERNAL_SERVER_ERROR`) is acceptable: each one is
a contract bug in authored client data, caught by this library's own tests, not
an upstream condition a consumer could act on.

Invariants, per `ROADMAP.md` §4:

- requested key equals returned key
- at least one input field
- field names non-empty and unique
- `select` fields have a defined, non-empty `options`
- non-`select` fields expose no `options`
- option values non-empty and unique within the field
- `dependsOn.field` names a **different** field in the same calculator
- the equality value's `typeof` is compatible with the referenced field's `type`
  (`boolean`→boolean, `number`→number, `string`→string or select; for a select,
  the value must be one of that field's option values)
- dependencies on `date` fields are rejected
- no dependency cycles — DFS over the `dependsOn` edges; self-reference is
  caught by the "different field" rule, longer loops by the walk

- a `semantic` on a non-number field is rejected, because only
  `NumberInputField` exposes `semantic`, so the mapper would otherwise drop it
  silently and hide client drift

Field order is explicitly *not* validated — it carries no domain meaning.

### Rewritten

| File | What & why |
|---|---|
| `src/lib/tax-calculators.service.ts` | Injects `CalculatorsClientService`. `getCalculator(type: TaxCalculatorType): TaxCalculator` → `toCalculatorKey(type)` → `client.getCalculator(key)` → `assertPublishableContract(key, contract)` → `{ type, inputFields: contract.inputFields.map(toInputField) }`. Synchronous. Validate and map on every request, scoped to the requested calculator. `LOGGER_PROVIDER` is removed: the roadmap replaces warn-and-degrade with throw, so there is nothing to warn about. |
| `src/lib/tax-calculators.resolver.ts` | `@CodeOwner(CodeOwners.Hugsmidjan)` + `@Resolver(() => TaxCalculator)`. `@Query(() => TaxCalculator, { name: 'taxCalculator', description })` with `@Args('type', { type: () => TaxCalculatorType })` and an explicit `TaxCalculator` return-type annotation. Query name is prefix-once. No guards, no `@Audit`, no `registerEnumType`. **Put a short comment at the `@Query` recording the non-null deviation** from `conventions/graphql.md:42` — that is where the next reader will ask, and README/ROADMAP alone won't reach them. |
| `src/lib/tax-calculators.module.ts` | `imports: [CalculatorsClientModule]` added. `providers: [TaxCalculatorsResolver, TaxCalculatorsService]`; no `exports`. No `apps/api` config or infra work: `CalculatorsClientConfig` self-registers via `registerOptional()`, `RSK_CALCULATORS_BASE_URL` has a default and is already in `apps/api/infra/api.ts`, and the RSK API is open — no X-Road, no auth. |
| `src/index.ts` | `export { TaxCalculatorsModule } from './lib/tax-calculators.module'` — named export replacing `export *`. Resolver and service stay unexported. |
| `README.md` | New query/SDL; four-of-six reachability; "no display text — it comes from `configJson`"; calculation deferred with `taxCalculatorCalculate` reserved; the two known-red consumers. Must state **both** deviations (non-null root query, throw-don't-degrade). Delete the now-false claims that field metadata comes from zod introspection and that the module needs no `imports`. Do not restate client-owned RSK interpretation. |
| `ROADMAP.md` | Fill in §§1–4 outputs: reachability = four, nullability = non-null, output-contract status = absent → deferred, and the enum-file deviation from the suggested structure. |

### Unchanged (verified)

- `project.json` — dep constraints already permit `scope:api → lib:client` and
  `lib:js`. Note there is **no `tsc` target**.
- `jest.config.ts` — discovers specs anywhere under the project; new
  `mappings/` and `validation/` specs need no registration. It uses
  `tsconfig.spec.json`, so spec type errors *are* caught by the test target.
- `apps/api/src/app/app.module.ts` — already imported (line 86) and registered
  (line 396), both alphabetically placed.
- `libs/clients/rsk/calculators/**` source — no client change, confirming the
  roadmap's boundary check that the client never learns about
  `TaxCalculatorType`.

## Test plan

**`src/lib/tax-calculators.service.spec.ts`** (rewritten) — instantiate directly
as `new TaxCalculatorsService(new CalculatorsClientService())`, **not** via
`Test.createTestingModule`: building a schema here fails on `TaxCalculatorType`,
whose `registerEnumType` lives in `libs/cms` and never runs in this project's
test context. Cases:

- all four `TaxCalculatorType` members return a non-empty `inputFields` with
  non-empty keys
- `withholdingTaxOnWages` resolves to the withholding-tax calculator (contains
  `salary` and `paymentFrequency`) — the guard for the one hand-maintained
  cross-vocabulary entry, which compiles fine when wrong
- `childBenefit`'s `splitCustodyChildrenOver7`/`Under7` carry
  `{ fieldKey: 'splitCustody', equals: { value: true } }`; the rest are
  unconditional
- `vehicleTax.period` is a `SelectInputField` with
  `[{value:'firstHalf'},{value:'secondHalf'}]`
- `vehicleTax.periodSplitDate` is a `DateInputField` with no `options`
- a per-field semantic table (carried over from the current spec — this is what
  catches a *mis*-annotation)
- no blanket assertion that every number field has a `semantic`: `semantic` is
  optional in the public contract, so tests may pin known current semantics but
  must not turn that data property into a domain invariant.

**`src/lib/mappings/inputField.spec.ts`** (new) — each `CalculatorFieldType`
maps to the right concrete shape; a `semantic` on a number field survives;
`options` become `{value}` objects only on select; each of the three `typeof`s
of `dependsOn.equals` maps to the matching union member. The string and number
cases **must** use hand-built contracts — real data has only the two boolean
dependencies in `childBenefit`.

**`src/lib/validation/inputContract.spec.ts`** (new) — one hand-built invalid
contract per invariant, each asserted to throw, plus one valid contract asserted
not to. These are the only tests for rules no type can enforce, and the
select-option-membership and number-compatibility branches are reachable only
here.

Not covered by jest: both `resolveType` functions run only during real schema
execution, which this project's test context cannot build. The schema build
below is what proves they register.

## Verification

```bash
npx tsc --noEmit -p libs/api/domains/tax-calculators/tsconfig.lib.json
npx eslint libs/api/domains/tax-calculators/src --ext .ts --max-warnings 0
yarn nx run api-domains-tax-calculators:test
yarn nx run clients-rsk-calculators:test

# Merged-schema build — the load-bearing check
INIT_SCHEMA=true yarn ts-node -P apps/api/tsconfig.json scripts/build-graphql-schema.ts apps/api/src/app/app.module
```

Two notes on why these and not the obvious ones:

- **Do not** run `nx run api:codegen/backend-schema`. `nx.json`'s
  `targetDefaults` gives it `dependsOn: ["codegen/backend-client",
  "^codegen/backend-client", "^codegen/backend-schema"]`, dragging in the whole
  client-codegen chain. The raw command above is what that target executes.
- `tsc` runs directly because `project.json` has no `tsc` target, so the nx
  targets alone never typecheck `tsconfig.lib`. **Filter its output** -- it
  reports 29 pre-existing errors in dependency libraries (`libs/auth-nest-tools`,
  `libs/logging`, `libs/nest/config`, ...), because this library's stricter flags
  (`noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns`) apply to everything pulled in through the path aliases.
  Grep for `domains/tax-calculators` to see only this library's own errors.
- `nx run api-domains-tax-calculators:lint` **fails repo-wide** on
  `Failed to load plugin 'storybook': require() of ES Module ... not supported`.
  Pre-existing and environmental -- the untouched `occupational-licenses` domain
  fails identically -- so it is not a signal about this work.

The schema build is load-bearing: an interface with no implementing types, a
union whose members aren't registered, and a duplicate `registerEnumType` all
fail there and nowhere else. It rewrites the gitignored `api.graphql`.

## Key decisions

- **Interface + union over a flat field type** — roadmap-settled. Buys
  schema-level guarantees the flat shape couldn't express: `options` only where
  meaningful, `semantic` only on numbers.
- **One file for the interface and its five implementors, using `extends`** —
  keeps the four shared fields and their descriptions declared once. Safe because
  the interface never references the implementors across a module boundary; the
  crash case is split files *plus* `extends`, not `extends` itself. See the models
  section for the three-way rule and its precedents. An earlier revision of this
  plan chose split-plus-`implements`, which is also safe but costs 20 field
  restatements and a constants module to stop them drifting; the refactor to one
  file was verified to leave the emitted schema unchanged — 2199 types before and
  after, zero definition changes, textual diff limited to emission order.
- **The interface keeps a `type` field** now redundant with `__typename` — kept
  deliberately as a convenience for renderers that switch on an enum rather than
  a typename, and it is what `resolveType` discriminates on.
- **`type` as both argument and field name**, despite `domain-module.md` naming
  `type` under "avoid reserved words as property names" — roadmap-settled, and
  it reads correctly at the call site (`taxCalculator(type: VEHICLE_TAX)`).
- **Non-null root query** — see settled decisions; comment it at the `@Query`.
- **Throw, don't degrade** on invalid client metadata — roadmap-settled, and a
  deliberate reversal of the decision the current module documents at length
  (warn and drop, because a public unauthenticated page turns a throw into a 500
  for every visitor). Defensible now for a reason that did not hold before: the
  contract is authored plain data in the client, not derived from zod
  introspection, so a violation is a code bug caught in CI rather than upstream
  drift arriving at runtime.
- **Validation runs per request, not at boot.** A reviewer proposed validating
  all four contracts in `OnModuleInit` so a violation fails the deploy rather
  than a visitor's request. Rejected: `OnModuleInit` appears in only three files
  repo-wide and in no `libs/api/domains` module, and it trades a localized
  failure for a global one — a malformed contract would stop the entire
  `apps/api` gateway from booting rather than breaking one slice. Validate only
  the requested calculator on each `taxCalculator(type)` execution; full curated
  coverage comes from the validation and service specs.
- ⚠️ ASSUMPTION: mappers return plain objects, not class instances — safe because
  both `resolveType`s are data-driven, but nothing would catch a later
  `instanceof` check.

## Downstream breakage

Both live consumers break: same query *name* (`taxCalculator`, which is what
they already call), renamed *argument* (`calculatorType` → `type`), renamed and
restructured *fields*. `apps/web`'s `Calculator.tsx` reads
`data.taxCalculator.fields` with `key/inputType/required/options/dependsOn{field,equals}`;
`apps/contentful-apps`' `types.ts` derives `ContractField` from
`['taxCalculator']['fields'][number]`. Neither is silently compatible.

The gitignored generated artefacts (`libs/api/schema/src/lib/schema.ts`,
`apps/web/graphql/schema.d.ts`, `apps/contentful-apps/graphql/schema.ts`) also
go stale.

Fixed in follow-up work via `/develop-web` and `/develop-contentful-app` — out
of scope here by decision. Breaking per `conventions/domain-module.md`'s
taxonomy, and sanctioned by `ROADMAP.md`'s opening statement that this domain may
publish a relationship that breaks current CMS/web assumptions.

Two union members ship with no producer: every `dependsOn.equals` in the client
is `true`, so `TaxCalculatorStringInputDependencyValue` and
`TaxCalculatorNumberInputDependencyValue` register with no data path reaching
them. Roadmap-settled — the client types `equals` as `string | number | boolean`,
so the union matches the client contract rather than only its current data.

## Open follow-ups (not blocking)

- **Select option values are display strings doing duty as stable keys** —
  `pensionFundRatio` publishes `[{value:'0%'},{value:'4%'}]` and
  `employerPensionMatchRatio` goes up to `{value:'13.5%'}`, so a consumer must
  string-parse to get a number. Meanwhile `semantic: 'percentage'` marks a 0–1
  ratio on `taxCardUtilization`/`spouseTaxCardUtilization` — so consumers meet
  percentages in two unrelated shapes within one calculator. That is the
  client's contract, not this domain's, and `TaxCalculatorInputFieldOption` is
  already an object type with room to grow. Unresolved: whether a future
  `label`/`numericValue` lands on the option type, or `configJson` gains
  per-option display text. Worth settling before the web form renderer, not
  before this lands.
- **Output/calculation contract** — belongs to the client roadmap first, then a
  follow-up round here.
- **Non-domain doc cleanup** — `libs/tax-calculators/src/lib/calculatorConfig.schema.ts`
  and `libs/clients/rsk/calculators/PLAN.md` contain stale references after this
  domain rebuild. Correcting them is useful but outside this domain-only plan.
