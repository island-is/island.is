# Tax Calculators Shared Config Roadmap

This roadmap is the control document for `libs/tax-calculators`, the shared
configuration contract for the Contentful `calculator.configJson` field. It
records the settled design; `PLAN.md` is the file-by-file execution plan for
the current round.

The domain/client rebuild is the current baseline:

- `libs/clients/rsk/calculators` owns RSK-facing input/output metadata and
  mappers.
- `libs/api/domains/tax-calculators` exposes public metadata as
  `TaxCalculator.inputFields` and `TaxCalculator.outputFields`.
- The domain does not execute calculations and does not publish labels or
  layout.
- Contentful and web are allowed to break while they move to the new contract.

## Goal

Make the shared config first-class for both calculator input layout and output
layout.

The config should continue to contain editor-authored display structure only:

- grouping
- ordering
- public labels
- public explanatory content
- form layout spans for inputs
- output presentation hints that cannot be derived from domain metadata

It must not duplicate domain metadata:

- input/output field type
- number semantic
- requiredness
- options
- input dependencies
- calculated values
- RSK source keys

All input and output fields join to the domain metadata by `key`.

## Target Root Shape

Use the same vocabulary as the domain contract:

```ts
type CalculatorConfig = {
  inputSections: CalculatorInputSection[]
  outputSections: CalculatorOutputSection[]
}
```

Do not keep `sections` as the long-term input name. The new config is
greenfield, and `inputSections` / `outputSections` makes both halves explicit.

## Input Sections

Input sections are the renamed version of the current `sections` model:

```ts
type CalculatorInputSection = {
  key: string
  title?: CalculatorLocalizedText
  description?: CalculatorLocalizedText
  toggle?: CalculatorSectionToggle
  gate?: CalculatorSectionGate
  fields: CalculatorInputSectionField[]
}

type CalculatorInputSectionField = {
  uid: string
  key: string
  label?: CalculatorLocalizedText
  placeholder?: CalculatorLocalizedText
  span: number
}
```

Input-only decisions:

- `span` stays input-only because form controls need grid placement.
- input field keys are unique: two controls writing the same submitted value
  is ambiguous, so the same input field may not be placed twice. `uid` is
  still needed because `key` may be empty in the editor draft state before
  save, but the current schema comment justifying `uid` by "`key` repeats when
  the same backend field is placed twice" is now wrong and must be rewritten.
- `toggle` and `gate` stay input-only.
- conditional visibility remains based on editor-authored section toggles, not
  on calculated values.

## Output Sections

Output sections model the result/report layout shown in the calculator designs:

```ts
type CalculatorOutputSection = {
  key: string
  title?: CalculatorLocalizedText
  content?: CalculatorLocalizedMarkdown
  variant?: 'default' | 'accordion'
  divider?: 'none' | 'before' | 'after' | 'both'
  fields: CalculatorOutputSectionField[]
}

type CalculatorOutputSectionField = {
  uid: string
  key: string
  label?: CalculatorLocalizedText
  variant?: 'default' | 'emphasis'
  itemFields?: CalculatorOutputItemField[]
}

type CalculatorOutputItemField = {
  uid: string
  key: string
  label?: CalculatorLocalizedText
}
```

Output decisions:

- array item fields carry a `uid` for the same reason input and output fields
  do: `key` may be empty in the editor draft state before save, so it cannot
  serve as row identity
- output fields do not have `span`
- output sections do not have input `toggle` or `gate`
- `variant: 'emphasis'` is for prominent result values
- `variant: 'accordion'` is for disclosure sections such as calculation
  assumptions, and requires a `title`: without one the disclosure has no
  label, and raw keys must never be shown publicly
- an output `key` may be placed more than once. Unlike an input there is
  nothing to submit, and the result layouts repeat a value deliberately --
  a total shown with `variant: 'emphasis'` at the top and again inside an
  accordion breakdown. `uid` is what distinguishes the two placements
- dividers are section-level presentation, not standalone blocks
- `content` is section-level markdown for explanatory copy, paragraphs, lists
  and links
- no formatting overrides initially; formatting comes from domain `type`,
  number `semantic`, and locale-aware web defaults

## Markdown Content

Use markdown strings for output section content:

```ts
type CalculatorLocalizedMarkdown = {
  is: string
  en?: string
}
```

Reasoning:

- the examples need paragraphs and bullet lists
- `apps/contentful-apps` already has a Slate-based markdown editor that
  serializes to markdown
- `apps/web` already has `MarkdownText` for rendering markdown in organization
  and connected calculator contexts
- storing Contentful Rich Text JSON inside `configJson` would couple this
  shared library to Contentful's document model

Labels and titles remain plain localized text, not markdown.

`is` must be a non-empty string. The current schema allows `''`, which
renders as a blank label -- the same silent failure the "no raw keys as public
labels" rule exists to prevent. `en` stays optional, and non-empty when
present.

## Omission Rules

Omission means "do not render".

- input field not placed in `inputSections`: not rendered
- output field not placed in `outputSections`: not rendered
- array item field not placed in `itemFields`: not rendered

Do not add a `hidden` flag initially.

Public web rendering must not fall back to raw keys as labels. Raw keys are
acceptable in editor dropdowns, stale-key warnings, dev diagnostics and logs.

## Validation Rules

The shared Zod schema should validate config structure only.

Structural rules:

- input section keys are unique within `inputSections`
- output section keys are unique within `outputSections`
- input field `uid`s are globally unique across input fields
- output field `uid`s are globally unique across output fields
- input field keys are globally unique across input fields
- output field keys may repeat; only output `uid`s are unique
- output array item `uid`s are unique within their parent output field
- output array item keys are unique within their parent output field
- input toggle keys are unique across input sections. Two sections declaring
  the same toggle key makes every gate referencing it ambiguous, and a plain
  set of collected toggles accepts it silently
- input `span` is an integer from 1 to 12
- input gates must reference a toggle declared by a _different_ input section.
  This is a tightening, not a restatement: the current check only verifies the
  toggle exists somewhere, so a section gating on its own toggle passes today
- an output section with `variant: 'accordion'` must have a `title`
- localized text `is` is non-empty, and `en` is non-empty when present

Permissive rules:

- allow empty `inputSections`
- allow empty `outputSections`
- allow sections with empty `fields`
- allow output sections with `content` and no fields
- allow output sections with neither content nor fields; web can render nothing

Rules that need live domain metadata do not belong in the shared schema:

- whether a configured input key exists in `inputFields`
- whether a configured output key exists in `outputFields`
- whether an output field is scalar or array
- whether `itemFields` is present for arrays and absent for scalars
- whether configured array item keys exist in the selected output field

Those checks belong in the Contentful editor and web runtime, because they
depend on the selected calculator type and GraphQL metadata.

## Helper API

Rename current input helpers and add output helpers:

```ts
collectInputSectionToggles(config)
collectInputFieldKeys(config)
collectOutputFieldKeys(config)
collectOutputItemFieldKeys(outputField)
```

The exact helper set can stay small, but consumers should not repeatedly walk
the config by hand for common validation/warning paths.

## Rounds

**Round 1 -- the shared contract (current).** Rewrite the Zod schema and its
tests in this library: rename `sections` to `inputSections`, add
`outputSections` with its section/field/item and markdown schemas, add the
structural refinements above, and rename the exported types and helpers.
Scope is `libs/tax-calculators` only. See `PLAN.md`.

**Round 2 -- the Contentful editor.** Query `inputFields` and `outputFields`,
edit input sections from `inputSections`, add an output section editor with
field placement by key, `variant`/`divider`/markdown `content` support and
explicit array `itemFields`, and warn for stale keys against live GraphQL
metadata.

**Round 3 -- the web renderer.** Render the form from `inputSections`, join
output fields to `outputFields` metadata by key, render markdown `content`
with `MarkdownText`, apply section accordion/divider presentation, and never
expose raw keys as public labels.

**Later.** Calculation execution. `outputSections` describes how a result is
laid out; producing one is a separate round and must not be designed from the
old output handling.

Rounds 2 and 3 are deliberately out of scope for round 1. This library is
allowed to publish a contract that breaks the current editor and renderer;
they move to it in their own rounds.
