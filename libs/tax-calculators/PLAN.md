# Tax Calculators Shared Config — Implementation Plan

Implementer-facing plan for round 1 of `libs/tax-calculators`: the Zod schema
and tests for the Contentful `calculator.configJson` contract.

Read `ROADMAP.md` first. It is the control document and records the settled
design, including every validation rule and why it exists. This file is the
file-by-file execution plan and does not re-argue those decisions.

## Goal Checkpoint

```text
Goal: make configJson first-class for both input layout and output layout.
Current phase: rewrite the shared Zod schema and its tests.
Scope: libs/tax-calculators only -- schema, tests, and README.
Non-goals: no Contentful editor work, no web renderer work, no calculation execution, no migration of existing configJson values, no domain or client changes.
Next action: rewrite calculatorConfig.schema.ts, because every other file in this round depends on its exported names.
```

## Preconditions

- The domain contract is already shipped: `TaxCalculator.inputFields` and
  `TaxCalculator.outputFields` exist in
  `libs/api/domains/tax-calculators`. This round consumes their vocabulary
  (`key`, scalar vs array outputs, one level of `itemFields`) but touches no
  file there.
- No migration. Every `configJson` value in Contentful is dev-only and
  disposable, so the rename from `sections` to `inputSections` needs no
  compatibility shim, no dual-read and no migration script. Do not write one.
- `apps/web` and `apps/contentful-apps` will stop compiling against this
  library the moment the exported names change. That is expected and is
  rounds 2 and 3. Do not fix them here, and do not weaken the contract to keep
  them building.

## Decisions To Apply

These are mechanical choices an implementor would otherwise have to guess.
They are settled; do not revisit them mid-implementation.

**Optional, never `.default()`.** `variant`, `divider` and every `label`,
`title`, `description`, `placeholder` and `content` stay plain `.optional()`.
No Zod `.default()` anywhere in this schema. A default makes the parsed object
differ from the stored JSON, and the Contentful editor writes back what it
parsed — so every config would be silently rewritten the first time an editor
opened it. Absent and `'default'` are equivalent to a renderer; keep the
explicit `'default'` literal in the enums for editors that write it.

**Enums as `z.enum`.** `z.enum(['default', 'accordion'])`, not a union of
`z.literal`s.

**Refinement placement follows the scope of the rule.** A rule that can be
decided from one object belongs on that object's schema; only cross-section
rules go in the root `superRefine`. Zod 3.22.4 prefixes a nested
`ctx.addIssue` path with the parent path automatically, so a section-level
refinement passes `path: ['title']` and the issue surfaces as
`['outputSections', 1, 'title']`. Verified at this version.

**Every issue carries a `path` and a quoted-value message.** The Contentful
editor surfaces both, and the existing refinements set the precedent
(`path: ['sections', i, 'fields', j, 'uid']`, `Duplicate field uid "x"`). An
issue with no path points the editor at the whole field.

## File Changes

### `src/lib/calculatorConfig.schema.ts`

Rewrite. Schema objects, in declaration order:

| Const                      | Exported type                  | Notes                                                |
| -------------------------- | ------------------------------ | ---------------------------------------------------- |
| `localizedTextSchema`      | `CalculatorLocalizedText`      | `is: z.string().min(1)`, `en` optional and `.min(1)` |
| `localizedMarkdownSchema`  | `CalculatorLocalizedMarkdown`  | same shape, separate symbol — see below              |
| `sectionToggleSchema`      | `CalculatorSectionToggle`      | unchanged                                            |
| `sectionGateSchema`        | `CalculatorSectionGate`        | unchanged shape; now exported                        |
| `inputSectionFieldSchema`  | `CalculatorInputSectionField`  | unchanged shape                                      |
| `inputSectionSchema`       | `CalculatorInputSection`       | renamed from `calculatorFieldSectionSchema`          |
| `outputItemFieldSchema`    | `CalculatorOutputItemField`    | new: `uid`, `key`, optional `label`                  |
| `outputSectionFieldSchema` | `CalculatorOutputSectionField` | new; owns the item-field refinements                 |
| `outputSectionSchema`      | `CalculatorOutputSection`      | new; owns the accordion-title refinement             |
| `calculatorConfigSchema`   | `CalculatorConfig`             | root: `inputSections`, `outputSections`              |

`localizedMarkdownSchema` is structurally identical to `localizedTextSchema`.
Declare it as its own `z.object` rather than aliasing, so the two can diverge
(a markdown length cap, a stricter text rule) without a rename, and so the
exported type names say which one a consumer is holding.

Rename the exported helper and add the three new ones:

```ts
collectInputSectionToggles(config: CalculatorConfig): CalculatorSectionToggle[]
collectInputFieldKeys(config: CalculatorConfig): string[]
collectOutputFieldKeys(config: CalculatorConfig): string[]
collectOutputItemFieldKeys(field: CalculatorOutputSectionField): string[]
```

- `collectInputSectionToggles` is today's `collectSectionToggles`, renamed.
- `collectInputFieldKeys` returns keys in document order. Validation already
  makes them unique, so no dedupe step.
- `collectOutputFieldKeys` **dedupes**, keeping first-appearance order: output
  keys may legitimately repeat across placements, and every caller wants "which
  outputs are placed" for stale-key warnings, not a placement count.
- `collectOutputItemFieldKeys` returns `[]` when `itemFields` is absent.

Refinements, by owning schema:

| Rule                                                | Owner                      | Issue path                                  |
| --------------------------------------------------- | -------------------------- | ------------------------------------------- |
| accordion section has a `title`                     | `outputSectionSchema`      | `['title']`                                 |
| item `uid`s unique within the field                 | `outputSectionFieldSchema` | `['itemFields', i, 'uid']`                  |
| item keys unique within the field                   | `outputSectionFieldSchema` | `['itemFields', i, 'key']`                  |
| input section keys unique                           | root                       | `['inputSections', i, 'key']`               |
| output section keys unique                          | root                       | `['outputSections', i, 'key']`              |
| input toggle keys unique across sections            | root                       | `['inputSections', i, 'toggle', 'key']`     |
| gate resolves to a toggle on a _different_ section  | root                       | `['inputSections', i, 'gate', 'toggle']`    |
| input field `uid`s unique across all input fields   | root                       | `['inputSections', i, 'fields', j, 'uid']`  |
| input field keys unique across all input fields     | root                       | `['inputSections', i, 'fields', j, 'key']`  |
| output field `uid`s unique across all output fields | root                       | `['outputSections', i, 'fields', j, 'uid']` |

Output field **keys** are deliberately absent from that table. They may repeat;
only `uid`s are unique. Do not add a key-uniqueness check for outputs.

The gate rule is a tightening, not a port: today's check only asks whether the
toggle exists anywhere, so a section gating on its own toggle passes. Resolve
gates against a map of `toggle.key -> declaring section key` and reject when the
declaring section is the gated section itself, with a message that says so.

Rewrite the `uid` comment on `inputSectionFieldSchema`. It currently justifies
`uid` with "`key` ... repeats when the same backend field is placed twice",
which the new input-key uniqueness rule forbids. The surviving reason is that
`key` may be empty in the editor draft state before save, even though saved
config still requires a non-empty key. The same one-line reason applies to
`outputSectionFieldSchema` and `outputItemFieldSchema`; state it once and
cross-reference.

Keep the existing comment style: the file explains why a rule exists, not what
the code does. Carry over the existing explanations for `sectionGateSchema`,
`localizedTextSchema`, `sectionToggleSchema` and the gate-resolution block
rather than rewriting them; only the `uid` comment is factually stale.

### `src/index.ts`

No change needed — it re-exports `./lib/calculatorConfig.schema` and
`./lib/calculatorType` wholesale, so the renamed and added symbols flow through
automatically. Confirm this rather than assuming it: if a consumer imported a
type this round renames, the break belongs in round 2 or 3, not in a
compatibility alias here.

## Tests

### `src/lib/calculatorConfig.schema.spec.ts`

Rewrite. Keep the existing factory style (`field()`, `section()` with an
`overrides` spread) and add output equivalents: `outputField()`,
`outputSection()`, `itemField()`. Keep asserting on `result.success`, and on
`result.error.issues[0].path` for the rules whose path the editor depends on.

Cases, grouped as the file already groups them:

**Root shape**

- a minimal config (`{ inputSections: [], outputSections: [] }`) is accepted
- a config with valid input and output sections is accepted
- undeclared keys are stripped, on both an input and an output section

**Identity**

- an input field with no `uid` is rejected
- duplicate input field `uid`s across sections are rejected
- duplicate output field `uid`s across sections are rejected
- duplicate input field keys across sections are rejected
- **repeated output field keys across sections are accepted** — the positive
  case that pins the input/output asymmetry
- duplicate input section keys are rejected
- duplicate output section keys are rejected
- duplicate item `uid`s within one output field are rejected
- duplicate item keys within one output field are rejected

**Toggles and gates**

- a gate pointing at a toggle another section declares is accepted
- a gate pointing at a toggle no section declares is rejected, with path
  `['inputSections', 0, 'gate', 'toggle']`
- a gate pointing at a toggle its own section declares is rejected
- a gate left dangling by removing the section that owned the toggle is
  rejected (keep the existing before/after assertion — it documents the silent
  failure)
- two sections declaring the same toggle key are rejected

**Output presentation**

- an accordion section with a title is accepted
- an accordion section with no title is rejected, with path
  `['outputSections', i, 'title']`
- a default-variant section with no title is accepted
- a section with `content` and no fields is accepted
- a section with neither content nor fields is accepted
- each `divider` value is accepted

**Localized text**

- `{ is: '' }` is rejected
- `{ is: 'Titill', en: '' }` is rejected
- `{ is: 'Titill' }` with no `en` is accepted

**Span** — keep the existing `it.each([0, 13, 1.5])` rejection case.

### Helper tests

Keep the existing `collectSectionToggles` describe block, renamed. Add:

- `collectInputFieldKeys` returns keys in document order across sections
- `collectOutputFieldKeys` dedupes a key placed in two sections
- `collectOutputItemFieldKeys` returns `[]` for a field with no `itemFields`

## Verification

```bash
yarn nx test tax-calculators
yarn nx lint tax-calculators
npx prettier --check libs/tax-calculators/src libs/tax-calculators/*.md
```

All three must pass before reporting done. `yarn nx test tax-calculators` is
the load-bearing one: every rule in this plan is a refinement, and a refinement
that never fires is invisible without a test that expects a rejection.

Do not run a repo-wide typecheck or build to "check nothing broke" —
`apps/web` and `apps/contentful-apps` are expected to fail against the new
names, and their breakage is rounds 2 and 3.

## Documentation Updates

After implementation:

- update `README.md`. Its summary says the schema is the source of truth for
  "the calculator form", which becomes half the story once `outputSections`
  ships; and it states that `apps/web` parses against the schema "before
  rendering the calculator form", which stays true only for the input half.
  Name both halves.
- leave `ROADMAP.md`'s round list alone. Mark round 1 done there only once the
  verification block passes.
