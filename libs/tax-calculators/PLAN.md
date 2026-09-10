# Tax Calculators Shared Config Plan

This plan covers `libs/tax-calculators`, the shared configuration contract for
the Contentful `calculator.configJson` field.

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
  key: string
  label?: CalculatorLocalizedText
}
```

Output decisions:

- output fields do not have `span`
- output sections do not have input `toggle` or `gate`
- `variant: 'emphasis'` is for prominent result values
- `variant: 'accordion'` is for disclosure sections such as calculation
  assumptions
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
- output field keys are globally unique across output fields
- output array item keys are unique within their parent output field
- input `span` is an integer from 1 to 12
- input gates must reference toggles declared by another input section

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

## Implementation Order

1. Update `calculatorConfig.schema.ts`
   - rename `sections` to `inputSections`
   - add `outputSections`
   - add output section/field/item schemas
   - add markdown content schema
   - add structural refinements
   - rename exported types

2. Update shared schema tests
   - minimal empty config
   - valid input/output config
   - duplicate section keys per group
   - duplicate input/output field keys
   - duplicate input/output field `uid`s
   - duplicate array item keys
   - gate reference validation still input-only
   - unknown extra keys are stripped

3. Update Contentful editor design
   - query `inputFields` and `outputFields`
   - edit input sections from `inputSections`
   - add output section editor
   - allow output field placement by key
   - support output section `variant`, `divider` and markdown `content`
   - support explicit array `itemFields`
   - warn for stale keys using live GraphQL metadata

4. Update web renderer design
   - render form from `inputSections`
   - later render calculation results from `outputSections`
   - join output fields to `outputFields` metadata by key
   - render markdown content with `MarkdownText`
   - apply section accordion/divider presentation
   - never expose raw keys as public labels

5. Keep calculation execution out of this round unless explicitly requested.
