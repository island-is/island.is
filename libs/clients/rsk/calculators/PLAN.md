# RSK Calculators Client Rebuild — Implementation Plan

> **Status: executed.** Sections 1–5 are implemented and green — the library
> contributes zero typecheck errors, lint is clean, and 27 tests pass across 7
> suites. `DESIGN.md` is the authority on the shape that actually landed; this
> document is the record of what was planned and why, kept because the
> reasoning is still the useful part.
>
> Three things landed differently from what is written below. They are recorded
> here rather than edited into the text, so the plan stays a record of intent
> rather than a retrofit:
>
> 1. **The input-type derivation helper was removed.** `contracts/inputType.ts`
>    existed briefly and is gone; every calculator now authors its input type as
>    an explicit `interface` beside its contract. The mapped-type machinery was
>    judged too opaque for ordinary debugging at this size. Everything below
>    about deriving through a helper — including the anti-widening rule's second
>    half — describes a mechanism that no longer exists. The `as const satisfies`
>    discipline on the fields array does remain, and still matters.
> 2. **`src/lib/archive/` was deleted.** The plan's requirement that it stay out
>    of the commit is moot, and the 16 typecheck errors it contributed are gone.
> 3. **The PR boundary was relaxed.** Sections 1–5 may land without Section 6,
>    leaving `apps/api` red for now. See Sequencing And The PR Boundary below,
>    which has been corrected in place because leaving it would read as a live
>    constraint.


Scope: `ROADMAP.md` Sections 1–5, in `libs/clients/rsk/calculators` only.
Intent: update an existing library. No NX scaffolding.

Section 6 (`libs/api/domains/tax-calculators` mediation) is out of scope for
this pass, by decision. See Consequences for what that leaves broken and why
that is accepted rather than overlooked.

Read `DESIGN.md` first; it is the authority on shape. This document records only
what will be done to satisfy it, in what order, and what was deliberately left
out. Nothing in it is open: every question raised in planning is settled and
recorded in the design docs or the decision log.

## Goal Checkpoint

```text
Goal: rebuild the RSK calculators client as explicit per-calculator modules.
Current phase: implement the v1 custom input contract, Sections 1-5.
Non-goals: no Zod-built contract, no generic calculator execution, no public/domain identities in the client, no percentage-conversion change.
Next action: add the shared contract primitives in contracts/field.ts because every later section depends on them and the library currently has no contract types at all.
```

## Starting State

Verified by `npx tsc -p libs/clients/rsk/calculators/tsconfig.lib.json --noEmit`:

- `src/index.ts` lines 4, 5 and 23, and `src/lib/calculators.service.ts` lines
  18 and 26, import `./lib/calculatorTypes`. That module does not exist. The
  library does not compile.
- `src/lib/contracts/` and `src/lib/domains/` do not exist. Sections 1–4 have
  not been started.
- The library has no test files. `jest.config.ts` and the `test` target exist,
  so the tests this plan adds are the first here.
- `project.json` declares no `build` target — only `lint`, `test`,
  `update-openapi-document` and `codegen/backend-client`. This library is
  therefore only ever typechecked through a consumer. See Verification.
- `src/lib/archive/**` is out of consideration: not a source of truth, not a
  work item. It does not compile, which has a verification consequence noted
  below, but no action in this plan.

## The Authority, And The Safety Net

Two independent references, and neither is `archive/`.

**`gen/fetch/types.gen.ts`** — generated from the committed `src/clientConfig.json`
— is the authority for parameter names, types, requiredness and RSK's own coded
value sets. It carries RSK's Icelandic doc comments, so value tables are
checkable rather than transcribed from memory.

**`git HEAD` holds the entire previous contract.** The twelve
`src/lib/calculatorTypes/*.ts` files and `src/lib/utils/zodToInputProp.ts` were
deleted in the worktree but never committed as deleted, so they are still
tracked and `git show HEAD:<path>` returns each one intact. An earlier draft of
this plan claimed the old contract was unavailable and that Sections 3–4 would
therefore have no diff net. That was wrong: it reasoned from `archive/` being
the only surviving copy and overlooked the uncommitted deletion.

So the net recommended in `input-contract-registry.md` item 8 is available and
this plan uses it, in its intended three-step order — pin, replace, then trim,
each green before the next. `archive/` is never the authority for any of this;
`git show HEAD:<path>` is.

Per calculator, in Sections 3 and 4:

1. **Pin.** Read the previous definition with
   `git show HEAD:libs/clients/rsk/calculators/src/lib/calculatorTypes/<calculator>.ts`
   and write the mapper test against the query it emits today, asserting the
   exact key set as well as the values.
2. **Replace.** Author the new contract and mapper.
3. **Trim.** Reduce the pin to the invariants worth keeping permanently, once it
   has run green against the new implementation.

Step 3 must not be folded into step 2: if the pin is trimmed in the same move
that replaces the definition, it never runs against the new data and the whole
exercise buys nothing. That is item 8's own warning.

**Why the diff is load-bearing rather than belt-and-braces.** Every HEAD mapper
already declares an explicit return type — `(input): GetChildBenefitData['query'] =>`
and so on, all six verified. Keeping that is correct, but it is the status quo,
not a new safeguard, and it does not catch the failure mode that matters most
here: **an omitted optional parameter compiles clean.** `GetWithholdingTaxData['query']`
has sixteen optional members, so a mapper that silently drops `orlof` typechecks
perfectly. The same hole covers `skiptBornYfir7ara`, `skiptBornUndir7ara` and
`gjaldskipting`. An annotated return type catches renames and type mismatches,
never omissions.

Each mapper test therefore **asserts the exact emitted key set**, not just
individual values. That, plus the HEAD diff, is what covers the omission class.

A second tracked record exists and is worth cross-checking against for the four
calculators it reaches: `libs/api/domains/tax-calculators/src/lib/tax-calculators.service.spec.ts`
pins `salary`, `paymentFrequency`, `taxCardUtilization`,
`splitCustody`/`splitCustodyChildrenOver7`, `periodSplitDate` as an optional
date, and the exact ratio option sets `['0%','4%']`,
`['0%','1%','2%','3%','4%']` and
`['0%','8%','8.5%','10%','10.5%','11.5%','12%','13.5%']`. It is not only Section
6 cleanup — it is evidence for Sections 3–4.

## Changes

| File/Module | What & why |
|---|---|
| `src/lib/contracts/field.ts` (new) | Section 1. The v1 contract types: `CalculatorContract`, `CalculatorField`, `CalculatorFieldType`, `CalculatorFieldSemantic`, `CalculatorFieldOption`, `CalculatorFieldDependency`. Plain typed data, no Zod. Imports nothing at all — deliberately a leaf, which is what keeps the registry from forming a cycle with the calculators consuming these types. |
| `src/lib/contracts/registry.ts` (new) | Section 2. `calculatorRegistry` over the six contracts, `CalculatorKey` derived as `keyof typeof calculatorRegistry`. A client-local RSK identity; never imports `TaxCalculatorType`. `CalculatorKey` stays exported from `src/index.ts` because the downstream domain owns the public-to-client key mapping. |
| `src/lib/domains/childBenefit/{schema.ts,childBenefit.ts,index.ts}` (new) | Section 3, the proving slice. `schema.ts` authors the fields and an explicit `ChildBenefitInput`; `childBenefit.ts` owns `toChildBenefitQuery` with an explicit return type; `index.ts` exports contract, input type and mapper. |
| `src/lib/domains/{vehicleTax,vehicleBenefit,vehicleDepreciation,withholdingTax,interestBenefit}/{schema.ts,<name>.ts,index.ts}` (new) | Section 4, one calculator at a time, same shape as the proving slice. `vehicleTax` additionally converts its `yyyy-MM-dd` `periodSplitDate` string to the `Date` that `GetVehicleTaxData.query.gjaldskipting` requires — in the mapper, per the date decision below. The `RSK_VALUE_BY_*` lookup tables live in `<calculator>.ts`, importing the option literal union from `schema.ts`: `DESIGN.md` requires `schema.ts` to be plain contract data, and an RSK wire-value table is mapper knowledge, not contract data. |
| `src/lib/utils/toRskValue.ts` (moved, not new) | The shared option-to-RSK-value lookup. It exists at HEAD as `src/lib/calculatorTypes/toRskValue.ts` — verified, and `utils/toRskValue.ts` does not exist there — so this is a move into `utils/`, body unchanged. It imports nothing, so nothing needs rewriting. Its `undefined` passthrough is what makes the sixteen optional `withholdingTax` selects work. Lives in `utils/` because it is shared mapper plumbing, not contract shape; `DESIGN.md`'s Module Shape already lists it, and the decision log already sanctioned it. Not mandatory — a mapper may inline where that reads more clearly. |
| `src/lib/calculators.service.ts` | Sections 2 and 5. Add `getCalculator(key: CalculatorKey): CalculatorContract<CalculatorKey>` returning fields sorted lexically by `name`, sorting a copy so the authored contract is never mutated. Return type is `CalculatorContract<CalculatorKey>`: the simple form, pinning `key` to the union rather than the `string` default. No per-key narrowing at the service boundary — `<K extends CalculatorKey>(key: K): CalculatorContract<K>` would be type cleverness that prevents no real drift. The generic earns its keep at the definitions instead, where each calculator is declared as `CalculatorContract<'childBenefit'>` and so checked against its literal key. Synchronous. The six calculation methods stay explicit; no generic `calculate(key, input)`. `getWithholdingTax` keeps its optional parameter and today's `query: input && toWithholdingTaxQuery(input)` shape. Imports repointed from `./calculatorTypes` to `./domains/*`. |
| `src/index.ts` | Section 5. See Export Surface below. |
| `src/lib/domains/*/<name>.spec.ts` (new, 6 files) | A contract fixture test and a mapper test per calculator. Fixtures compare fields keyed by `name`, never as an array, so no fixture can pin authoring order. |
| `src/lib/calculators.service.spec.ts` (new) | The one test pinning lexical sorting, on `getCalculator`. The only place ordering is asserted anywhere. |
| `README.md` | Gains a `getCalculator` line once Section 2 lands; it currently documents only the six endpoints and the base-URL config. |

## Export Surface

Kept: `CalculatorsClientModule`, `CalculatorsClientConfig`,
`CalculatorsClientService`, and the six `Get*Response` types.

Added: `CalculatorContract`, `CalculatorField`, `CalculatorFieldType`,
`CalculatorFieldSemantic`, `CalculatorFieldOption` and
`CalculatorFieldDependency`. Every type appearing in a public method signature
is exported, parameter types included, not only return types.

Kept, not added: `CalculatorKey` and the six `*Input` types are already exported
today (`src/index.ts:4` and `:7-22`). They are **redefined**, not introduced —
worth stating because `CalculatorKey` keeping its name and members means the
downstream `Record<TaxCalculatorType, CalculatorKey>` mapping survives Section 6
untouched.

**Changed, and it is an intentional contract change:**
`VehicleTaxInput.periodSplitDate` goes from an optional `Date` — forwarded raw
to `gjaldskipting` — to an optional `yyyy-MM-dd` string that the mapper converts.
This retypes an already-exported member of an already-exported type. Blast
radius is nil today (nothing outside the library imports `VehicleTaxInput`), but
`DESIGN.md`'s Compatibility section requires a contract change to be recorded
deliberately rather than noticed later, and the decision log's date entry
records the rationale without recording that it retypes an export. That gets
added to the log when Section 4 runs.

Removed deliberately, not by omission: `getCalculatorInputProps`, `InputProp`,
`ChildBenefitKey`, `VehicleTaxKey`, `VehicleBenefitKey`,
`VehicleDepreciationKey`, `WithholdingTaxKey`, `InterestBenefitKey`,
`PaymentFrequency`, `VehicleTaxPeriod`, `WithholdingMaritalStatus`,
`InterestBenefitMaritalStatus`.

The `*Key` and option-union removals are safe: the only client imports anywhere
outside this library are `getCalculatorInputProps`, `CalculatorKey` and
`InputProp`, all in `libs/api/domains/tax-calculators`. One knock-on: with
option values inlined into the explicit input types, downstream loses any
nameable handle on those value sets. If Section 6 needs one, export named
aliases then rather than pre-emptively now.

## Decisions

### Field ordering is destroyed at the boundary, not preserved

`getCalculator` sorts lexically by `name`. Per-calculator files may be authored
in any order, and no per-calculator fixture pins order; a single service test
pins the sort.

Why: authoring order is an accident, and a test pinning it would fossilise that
accident and force future contracts into a shape nobody chose. Sorting at the
boundary serves that concern rather than fighting it — it destroys authoring
order instead of publishing it, so nothing accidental leaks downstream, and the
output is still deterministic.

Evidence: neither consuming frontend uses order as *identity* — both build a
`Map` keyed by the field, and the public form renders in the order a content
editor arranged. One nuance, so it is not a surprise: the Contentful editor's
field picker iterates that Map
(`apps/contentful-apps/components/editors/CalculatorEditor/CalculatorConfigEditor.tsx:60-66`),
so publication order *is* visible in the picker dropdown — sorting changes that
list to alphabetical. No identity impact, and arguably an improvement for an
editor scanning for a field by name. Confirmed with the programmer, and recorded
in `DESIGN.md` under Field Ordering.

Not decided: any visual or editorial ordering. That belongs downstream.

### The sort comparator is code-unit order, and the sort test lives on `withholdingTax`

`getCalculator` sorts with a code-unit comparison:

```ts
[...contract.fields].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
```

Not `localeCompare`, and **not `sortAlpha` from `@island.is/shared/utils`** —
named explicitly because it is the helper a later agent will reach for:
`libs/clients/verdicts/src/lib/verdicts-client.service.ts` already uses
`sortAlpha('label')` for exactly this shape of sort, so its absence here looks
like an oversight unless the reason is written down.

All three disagree on real data in this contract. `withholdingTax` carries both
`paymentFrequency` and `payMonth`:

| Comparator | Result |
|---|---|
| code unit (chosen) | `payMonth`, `paymentFrequency` |
| `localeCompare` | `paymentFrequency`, `payMonth` |
| `sortAlpha('name')` | `paymentFrequency`, `payMonth` |

Verified in node for the first two; `sortAlpha` follows from reading it — it
collates against the literal order string
`0123456789aAáÁbB…lLmMnN…`, in which lowercase precedes its uppercase pair, so
`m` sorts before `M` and `paymentFrequency` comes first.

Why code unit:

- `localeCompare` without an explicit locale is environment dependent, so its
  result can differ between a developer machine, CI, and a container with
  another ICU build. Deterministic output is the entire reason this sort exists,
  and a locale-sensitive comparator quietly forfeits it.
- `sortAlpha` is deterministic, but it is an **Icelandic display collation** —
  built to order Icelandic words the way a reader expects, including `þ`, `æ`
  and `ö`. Field names are machine identifiers in ASCII camelCase, never shown
  to a user, so Icelandic collation buys nothing and its case-insensitivity
  actively obscures the camelCase boundary that distinguishes these two fields.
  It also returns `0` for a falsy key, silently declining to order rather than
  failing.
- `DESIGN.md` says "lexically", which is the code-unit reading.

Consequence for the test: the single sort test must use `withholdingTax`, not
`childBenefit`. On a calculator whose field names don't straddle the two
comparators, a sort test passes under either implementation and therefore pins
nothing — which would make the one test that exists to pin ordering useless.

Not decided: any human-friendly or editorial ordering. Still downstream.

### `splitCustody` is a boolean field, not a two-option select

It gets `type: 'boolean'` and no `options`. The two dependent fields get
`dependsOn: { field: 'splitCustody', equals: true }`, `equals` a boolean.

Why: a live transcription hazard, not a stylistic preference. The previous
definition expresses the field as two permitted literal values, so transcribing
it by eye produces a two-option choice list. That version compiles cleanly and
breaks two things silently — the control becomes a dropdown, and the dependent
fields stop appearing, because the value is then the string `'true'` rather than
the boolean, so the condition never matches.

Evidence: `GetChildBenefitData.query.skiptBuseta` is a `boolean`, and both
dependent parameters carry RSK's own note *"Bara notað ef skiptBuseta == true"*.

Mitigation: asserted directly in the childBenefit contract test — the field's
type, the absence of `options`, and the boolean-ness of `equals`.

### The child-benefit outbound gate survives the flattening

The mapper keeps the ternary it has today:

```ts
skiptBornYfir7ara: input.splitCustody ? input.splitCustodyChildrenOver7 : undefined,
skiptBornUndir7ara: input.splitCustody ? input.splitCustodyChildrenUnder7 : undefined,
```

Why it has to be said out loud: the old input type was a discriminated union, so
passing a count alongside `splitCustody: false` was a compile error and the
ternary was belt-and-braces. The explicit input type is flat — a boolean plus two
optional counts — so that compile-time guarantee is gone, and unconditional
forwarding would send counts RSK documents as *"Bara notað ef skiptBuseta ==
true"*. A flat optional input type must not become unconditional forwarding.

Evidence: `GetChildBenefitData.query` carries that note on both dependent
parameters. The gate is asserted in the childBenefit mapper test with
`splitCustody: false` and both counts populated, checking neither reaches the
query.

Not decided: whether the contract should be able to express the conditionality
as a type rather than as mapper logic. That would be a v2 contract-shape
question, and `DESIGN.md` forbids extending the shape during the rebuild.

### Input types are explicit

Input types are handwritten in each calculator's `schema.ts`, next to the field
contract.

Why: a helper can derive the call shape from the authored contract, but the
necessary mapped types are hard to read and harder to debug than the duplication
they remove. This client has six small input shapes. For v1, the maintainability
tradeoff favours boring explicit interfaces.

The contract is still authored first because it carries facts a TypeScript
input interface cannot: currency/year/month/count semantics, dependencies, and
field metadata for downstream rendering. The explicit input type records only
the TypeScript values accepted by the mapper/service method.

The calculator's key is pinned with `satisfies`, not a type annotation:

```ts
const childBenefitFields = [ /* ... */ ] as const satisfies readonly CalculatorField[]

export const childBenefitCalculator = {
  key: 'childBenefit',
  fields: childBenefitFields,
} as const satisfies CalculatorContract<'childBenefit'>

export interface ChildBenefitInput {
  marriedOrCohabiting: boolean
  incomeYear: number
  // ...
}
```

Using `satisfies` keeps the authored contract checked against
`CalculatorContract<'childBenefit'>` without widening the literal key and field
data while the object is being authored.

Not decided: nothing here validates input at runtime. That is a scope boundary,
not a deferral — if calculator inputs are ever validated it belongs where
untrusted input arrives, at the GraphQL boundary, not in a client library whose
callers are all internal and already typechecked.

### Option sets live per calculator, with no shared constants module

Why: each calculator's option set is a fact about one RSK endpoint, and the
endpoints evolve independently. Keeping a set beside the mapper that consumes it
means a change to one endpoint cannot reach another, and the value table sits
next to the RSK doc comment that justifies it.

One transcription hazard follows directly from this, and it sits in the file
being transcribed from: HEAD's `calculatorTypes/constants.ts` carries a comment
on `INTEREST_BENEFIT_MARITAL_STATUSES` claiming RSK "reuses `hjuskaparstada`
with a different shape per endpoint, so matching values today are a
coincidence." That comment is false, per the evidence below. **Do not carry it
over.** Copying option sets out of that file while leaving its justification
comment attached would re-import the retracted claim into the new code.

Evidence, and a correction: an earlier draft of this plan justified the split by
claiming the withholding-tax and interest-benefit marital-status sets match
"only by coincidence" because RSK reuses `hjuskaparstada` with a different shape
per endpoint. `gen/fetch/types.gen.ts` does not support that. Those two are
genuinely identical — same value set, same doc string, differing only in
requiredness. The endpoint that actually diverges is `childBenefit`, where
`hjuskaparstada` is a `boolean` documented *"1 - Hjón/í sambúð 0 - Einstætt
foreldri"*. So one of the three shapes differs, not all three, and the reason
above stands on locality rather than on a coincidence that was not there.

### Requiredness is preserved as authored, not re-derived from the swagger

Requiredness corrections are a non-goal for every calculator, per the decision
log entry of 2026-09-08.

Worth recording what that actually resolves to, because "preserve" and "derive
from RSK" happen to agree almost everywhere. Comparing the existing contract
against `gen/fetch/types.gen.ts`:

- `childBenefit`, `vehicleTax`, `vehicleDepreciation` and `interestBenefit`
  already match the swagger exactly, including the three optional members
  `skiptBornYfir7ara`, `skiptBornUndir7ara` and `gjaldskipting`. Preserving and
  deriving produce the same contract; there is nothing to choose between.
- `withholdingTax` matches too: `GetWithholdingTaxData.query?` is itself
  optional and every member within it is optional, so all sixteen fields stay
  `required: false`. The Figma design marks `salary` and `incomeYear` mandatory,
  but `DESIGN.md` forbids inferring requiredness from UI preference, so that
  stays a downstream concern.
- `vehicleBenefit` is the single divergence. `GetVehicleBenefitData.query` marks
  `rafbill`, `starfsmadurGreidirHledslu` and
  `starfsmadurGreidirRekstrarkostnad` required, while the existing contract
  marks all three optional and the mapper sends `?? false`. They stay optional,
  with the outbound default preserved.

Why the divergence is kept rather than corrected: `DESIGN.md` explicitly
sanctions this exact pattern under the client's RSK-facing responsibilities —
"outbound defaults required by RSK, such as optional booleans sent as `false`".
RSK requires the parameter to be present; it does not require the caller to
supply it. Optional-with-a-default satisfies both, and it is the behavior in
production today.

Not decided: whether any of this is right for the form. That is D1, and it is
not settled here.

### `type: 'date'` carries a `yyyy-MM-dd` string, not a `Date`

The contract keeps `type: 'date'`, and the explicit input value for such a field
is a `yyyy-MM-dd` string. Where the generated RSK client wants a `Date`, the
per-calculator mapper converts. In practice that is exactly one field:
`vehicleTax`'s `periodSplitDate`, feeding
`GetVehicleTaxData.query.gjaldskipting`.

Why: `type: 'date'` is metadata telling a downstream consumer to render a date
control; it is not a claim about the runtime type of the submitted value. Making
the contract's value a `Date` would push a detail of the generated RSK client
out of the mapper and into the form and domain path that feeds it.

Evidence: `GetVehicleTaxData.query.gjaldskipting` is generated as `Date`, while
the calculator UI renders date fields with `DatePickerController`
(`apps/web/components/Organization/Slice/Calculator/CalculatorField.tsx`), which
already stores `yyyy-MM-dd` strings in form state. The string is what the form
actually produces, so the contract matches reality and the mapper absorbs the
difference. Recorded in `DESIGN.md` under Input Types and in the decision log.

Not decided: nothing about GraphQL `DateTime` conventions elsewhere in the repo.
This settles only the submitted value type for the RSK calculator contract.

### `getCalculator` throws on an unknown key

Rather than returning `undefined`.

Why: `CalculatorKey` is derived from the registry, so an unknown key is
unreachable for any typed caller. The throw guards only the untyped boundary,
which the domain already validates, and states that this is a programming error
rather than a normal absence a caller should handle.

Open: whether the domain wants a typed absence instead. A Section 6
conversation; nothing in Sections 1–5 depends on the answer.

## Non-Goals

Named explicitly so they cannot be quietly attached to this work.
`ROADMAP.md` Sections 3 and 4 carry the first two as per-section non-goals.

- **No percentage conversion at the mapper boundary.** RSK documents every ratio
  parameter as *"gefið sem tala milli 0 og 1"*. This pass rewrites every mapper,
  so the change would be cheap now and dearer later — and it is still out,
  because it changes what the client sends. Tracked as **D5**.

  Two things get recorded rather than fixed, because dropping the old
  `percentage()` builder removes the only artifact that carried the 0–1 rule.
  First, **the rule itself** moves into prose: a doc comment on the
  `percentage` member of `CalculatorFieldSemantic` in `contracts/field.ts`,
  where anyone authoring a ratio field will read it, plus a line in `README.md`.
  Deliberately prose and not an assertion — the registry note already settled
  that an unenforced assertion reads as a guarantee and is worse than a note.
  The wording must be a statement about **RSK's wire format plus the mapper's
  obligation**, not about the contract's own values: "RSK expects every ratio
  parameter as a number between 0 and 1; the mapper is responsible for
  converting the client value to that." Saying "percentage values lie between 0
  and 1" would be false of the client contract — `taxCardUtilization` carries
  whole percent from the form, and the select ratios carry `'4%'` strings. HEAD
  made exactly that mistake in the opposite direction: its `percentage()` builder
  asserted `.min(0).max(1)` while `nytingSkattkorts` forwarded a raw whole
  percent. That contradiction is D5's mechanism, not an aside.
  Second, **the actual bug is an asymmetry, not a uniform convention.** The
  select ratio fields — `pensionFundRatio`, `privatePensionRatio`,
  `employerPensionMatchRatio` — already convert to 0–1 through their
  `toRskValue` tables, while `taxCardUtilization` and
  `spouseTaxCardUtilization` forward their raw value. Only the latter two are
  wrong. Naming that here so the eventual fix is a two-field change and not a
  sweep across every ratio.
- **No requiredness corrections, in any calculator.** See the decision below for
  what that resolves to per calculator. Tracked as **D1**.
- **No numeric bounds in the contract.** Bounds belong in the contract as data
  eventually, which would also retire the renderer's invented year and month
  ranges, but a new kind of field crosses into the domain and the public API.
  Tracked as **D3**.
- **Section 6 is not done.** See Consequences.
- **`archive/` is untouched.**
- No `TaxCalculatorType` in the client. No generic `calculate(key, input)`. No
  translated labels. No input validation.

## Consequences

Removing `InputProp` and `getCalculatorInputProps` from `src/index.ts` breaks
the build of `libs/api/domains/tax-calculators`, which imports both — in
`tax-calculators.service.ts` (lines 4, 6 and 40), `mapper.ts` (line 1),
`models/enums.ts`, whose comment mirrors `InputProp['inputType']`, and
`tax-calculators.service.spec.ts`, which breaks transitively — and which is also
a tracked record of the old contract, so it is evidence for Sections 3–4 before
it is cleanup for Section 6.

That breakage lasts until Section 6. It is inherent to finishing the client
first, not a defect in this plan, and is written down so the choice is visible
rather than discovered at the next build.

Section 6 is larger than an import swap, and this plan does not do any of it:

- The contract shape changes, not just names. `dependsOn.value` becomes
  `dependsOn.equals`. The old `inputType`, which folded structural type and
  numeric semantic into one field, splits into `type` plus optional `semantic` —
  and GraphQL's `TaxCalculatorFieldInputType` is a single flat union containing
  `enum`, with no `select`. `CalculatorFieldOption` is a `{ value }` object
  where GraphQL `options` is `[String]`.
- The published GraphQL surface is already out of step, in committed generated
  artifacts. `apps/api/src/api.graphql:13529` and
  `libs/api/schema/src/lib/schema.ts:15501` both still declare
  `taxCalculator(calculatorType: TaxCalculatorType!): TaxCalculator!`, while the
  resolver in this tree exposes `taxCalculatorFields`. Both must be regenerated
  in the same PR — they are checked in, so a stale copy is a merged
  inconsistency, not a local one. Separately,
  `apps/api/src/api.graphql:8941`'s field description says fields come "in the
  order the underlying schema declares them", which `getCalculator`'s sort makes
  actively false; it needs rewording in the same pass.
- Moving contract lookup from a static function onto the Nest service means
  Section 6 must add `CalculatorsClientModule` to `TaxCalculatorsModule`'s
  `imports` and register `CalculatorsClientConfig` in `apps/api`'s config load
  list. Nothing outside this library imports either today. No X-Road wiring is
  needed — this is an open, unauthenticated API.

## Verification

Three commands, each with a constraint that has to be respected or it reports
nothing useful.

### Run under node 22.22.3, not the pinned 20.15.0

`.nvmrc` pins `v20.15.0`, but `package.json` engines requires `22.22.3`, and
lint only works on the higher one. Under 20.15.0,
`nx lint clients-rsk-calculators` does not run at all — it fails loading config
with `ERR_REQUIRE_ESM` from `eslint-plugin-storybook` via `@eslint/eslintrc`,
because a CJS `require` of an ESM-only plugin is unsupported there. Under
22.22.3 the same command succeeds (both verified). Node 22 supports
`require()` of ES modules, which is presumably why engines was raised.

No merge from `main` is needed for this, despite the flat-config migration that
has since landed there. If a merge happens for other reasons it must be a real
`git merge`, never a squash — a squash breaks the merge base and drags in
unrelated CODEOWNERS reviewers.

### Baseline the typecheck before Section 1

`npx tsc -p libs/clients/rsk/calculators/tsconfig.lib.json --noEmit` reports
**46 errors before any of this work starts**, measured under node 22.22.3:

- **25 from outside this library**, pulled in transitively through
  `@island.is/clients/middlewares` and `@island.is/nest/config` in
  `calculators.module.ts` / `calculators.config.ts`, and surfaced by the base
  tsconfig's `noImplicitOverride` / `noImplicitReturns` /
  `noPropertyAccessFromIndexSignature`. Spread across `libs/auth-nest-tools`
  (TS4114 ×6), `libs/nest/config` (×4), `libs/logging` (×4),
  `libs/feature-flags` (×4), `libs/clients/middlewares` (×4),
  `libs/shared/pii` (×1) and `libs/shared/problem` (×1).
- **16 from `src/lib/archive/**`**, which is out of consideration.
- **5 on the judged surface** — the known `./lib/calculatorTypes` breakage in
  `src/index.ts` (lines 4, 5, 23) and `src/lib/calculators.service.ts`
  (lines 18, 26).

An earlier draft of this plan put the out-of-library figure at ten. That was
measured on node 20 through a truncated `head`, and was wrong; the real count is
25 across eight libraries.

None are this work's business and none can be fixed from here. So the gate is
not "zero errors": capture this baseline before Section 1 and diff against it,
or filter output to `src/lib/(contracts|domains|calculators)`. A plan that
demanded a clean typecheck would be unachievable on step one and would train the
implementer to ignore the command.

### Spec files are not covered by that command

`tsconfig.lib.json` excludes `jest.config.ts`, `src/**/*.spec.ts` and
`src/**/*.test.ts`. The seven new spec files are typechecked only by ts-jest via
`tsconfig.spec.json` when `nx test` runs, and that config extends the
`strict: true` base with diagnostics on. `nx test` is therefore load-bearing
rather than optional, because the fixtures are partly compile-time contract
pins — a fixture that stops matching the contract's type is a real failure and
`tsc` will not see it.

### `archive/` affects only the typecheck, and must stay out of the commit

It does not compile, and `tsconfig.lib.json` has no exclusion for it, so local
`tsc` reports it; those errors are filtered along with the baseline above. It
does **not** break lint — verified green with the directory present, because the
config does not resolve imports. And it is untracked, so it is invisible to CI.

The requirement is about the commit, not the code: **`archive/` must stay out of
the commit.** `git add`ed, it would become CI's problem. It is never consulted
as an authority; `git show HEAD:<path>` is.

### Section 5 checks

- `rg` for `calculatorTypes`, `getCalculatorInputProps` and `InputProp` — no
  active client path may still reach the old machinery.
- `rg` for `zod` under `src/lib`, per ROADMAP §5's design check that no
  Zod-built calculator input contract remains in the active path. The other
  three greps do not cover this: `calculators.config.ts` legitimately keeps its
  Zod use for env config, so the check is that no *contract* file imports it.
- **Stage the deletions.** `src/lib/calculatorTypes/*.ts` (12 files) and
  `src/lib/utils/zodToInputProp.ts` are deleted in the worktree but unstaged.
  Until they are staged, the `rg` checks pass locally while the commit still
  carries both contract paths. Confirm with `git status` that what remains is
  the intended adds plus untracked `archive/`, nothing else.

### Decision-log deliverables

Per section, not as a wrap-up task. At minimum: the no-shared-constants choice
with its corrected reason, the requiredness stance with its `vehicleBenefit`
divergence, the child-benefit outbound gate, the sort comparator choice, and the
`VehicleTaxInput.periodSplitDate` retype as an intentional contract change. Not
the `utils/` placement or the date mapping — both are already logged, and
re-logging them would be the implementation noise `DESIGN.md` warns against.

## Sequencing And The PR Boundary

Sections 1–5 are the scope of this plan. They are not, on their own, a shippable
change: removing the old export surface leaves
`libs/api/domains/tax-calculators` unbuildable, so `apps/api` stays red until
Section 6 lands.

**Superseded.** The original decision was that Sections 1–6 land together and
`apps/api` is never left red. The programmer has since accepted partial
redness — "a little redness is fine, we'll update later" — so Sections 1–5 may
land on their own, with Section 6 following separately.

What that leaves broken, so it is not discovered later: four files in
`libs/api/domains/tax-calculators` fail to build on removed exports —
`tax-calculators.service.ts`, `mapper.ts`, `models/enums.ts` and
`tax-calculators.service.spec.ts`. It is a build failure, not a runtime one, so
it surfaces the moment anything typechecks `apps/api`.

Nothing in Sections 1–5 depends on Section 6's answers, so the two can be
planned separately without either constraining the other. Section 6 gets its own
plan when this one is done.

## Registry Open Points

`input-contract-registry.md` still lists open points that this plan touches.
Their disposition:

- **Item 1 — six now-false prose sites in the domain layer** (its README twice,
  a model comment, the resolver's justification comment, a test file pointing at
  a deleted spec, and one published API description claiming field order follows
  a schema that will no longer exist). **Deferred, deliberately.** They live in
  `libs/api/domains/tax-calculators`, cross a layer boundary, and break nothing.
  A documentation-only pass in that layer once the client work is green, as the
  note itself recommends — folded into Section 6's cycle rather than done
  quietly here.
- **Item 6 — two directories would both be called "config".** **Resolved** by
  naming the contract directory `contracts/`, which `DESIGN.md`'s Module Shape
  now fixes. Recorded as resolved so it is not re-raised.
- **Item 7 — two stale build-configuration entries.** Its description needs
  correcting on two counts. They are not uncommitted, and the second is not a
  relaxation: `tsconfig.lib.json` re-asserts `strictNullChecks`, `noImplicitAny`
  and `strictBindCallApply` as `true` beneath an already-`strict: true` base, so
  they are redundant, not loosening. And the file did not exist before
  `f32b5a76db` created it — it is the unmodified NX scaffold, not something
  added for the deleted tests. **Deferred** either way: redundant-but-correct
  build config is not contract work, and changing `tsconfig` strictness while
  the library does not compile would confuse cause and effect. A separate pass
  once Sections 1–5 are green, where removal can be verified by running the
  suite rather than reverted blind.
- **Item 9 — the intended numeric bounds become unwritten.** **Addressed as
  prose**, per the D5 non-goal above: a wire-side statement on
  `CalculatorFieldSemantic.percentage` plus `README.md`, deliberately not an
  assertion.
- **Item 10 — requiredness untouched by this pass.** **Confirmed out of scope**,
  per the requiredness decision above, including the explicit
  `vehicleBenefit` divergence so the exception is recorded rather than
  discovered.
- **Item 8 — the pin/replace/trim sequencing.** **Adopted**, see The Authority,
  And The Safety Net.
- **Item 2, item 3, item 5** — already answered in the note itself.

## Open Questions

None outstanding. Everything raised during planning has been answered and
recorded in `DESIGN.md`, `ROADMAP.md`, or the decision log:

- field ordering — sort at the `getCalculator` boundary
- requiredness — non-goal, with the `vehicleBenefit` divergence preserved
- percentage conversion — non-goal
- input types — explicit per calculator; no shared `CalculatorInput` helper
- `type: 'date'` — a `yyyy-MM-dd` string, converted in the mapper
- `getWithholdingTax` — keeps its optional argument
- `utils/toRskValue.ts` — allowed, not mandatory, and restored from HEAD
- PR boundary — Sections 1–6 land together; `apps/api` is not left red
- prior-contract source — `git show HEAD:<path>`, never `archive/`
- mapper safety — key-set assertions, since return types miss omissions
- `getCalculator` return type — the simple `CalculatorContract<CalculatorKey>`;
  the generic is for pinning each definition to its literal key
