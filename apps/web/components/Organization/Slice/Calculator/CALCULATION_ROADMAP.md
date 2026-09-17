# Calculator Web Calculation Roadmap

This roadmap documents the public web renderer's calculation flow for the CMS
`Calculator` slice.

The renderer already reads metadata and config: metadata says which keyed values
exist and what type they carry; config says how inputs and outputs are laid out
and labelled. Calculation adds the runtime loop between those two halves.

## Goal

Let a visitor fill the rendered input fields, submit a calculation, and see the
returned keyed output values rendered through the CMS-authored `outputSections`
layout.

The web layer stays generic. It should not import per-calculator client types,
hand-code calculator-specific result layouts, or know RSK query parameter names.

## Flow

1. Parse `configJson` with `calculatorConfigSchema`.
2. Query `taxCalculator(type:)` metadata.
3. Render configured `inputSections` by joining configured fields to metadata by
   key.
4. Track form values under the same metadata keys.
5. Enable submit only when required applicable inputs are sufficiently present.
6. Serialize form values into GraphQL keyed typed rows.
7. Query `taxCalculatorCalculate(input:)` lazily -- submission is button-driven,
   so a plain `useQuery` would fire on mount against an empty form.
8. Normalize returned keyed output values into lookup maps.
9. Render values through `config.outputSections`, using configured labels,
   markdown, variants, accordion sections and item field placement.

## Submit Payload

The GraphQL input uses keyed rows and a one-of value wrapper:

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

Form state is react-hook-form, already wired: `Calculator.tsx` runs
`useForm({ shouldUnregister: true })` inside a `FormProvider`, and every control
registers through `Controller`. The serializer is the only place that turns that
state into GraphQL rows.

### Form state holds strings, not typed values

This is the rule the serializer is built around. Every control except the
boolean checkbox writes a **string** into form state:

| Control | Metadata `type` | Runtime value |
|---|---|---|
| `InputController` number / count / percentage | `number` | string -- `"37"` |
| `InputController currency` | `number` | string -- `"1000000"` |
| `SelectController` (year) | `number` + `year` | string -- `"2024"` |
| `SelectController` (month) | `number` + `month` | string -- `"3"` |
| `SelectController` (select) | `select` | string -- `"4%"` |
| `Checkbox` via `Controller` | `boolean` | boolean, defaulted to `false` |
| `DatePickerController` | `date` | string -- `"2026-03-14"` |

`InputController` passes react-number-format's unformatted numeric string, not
its `floatValue`, so a `number`-typed field never holds a number. Note also that
`year` and `month` are `number`-typed in metadata but rendered as selects, so
the control kind is not a reliable signal of anything.

Serialization rules:

- dispatch on metadata `type` to choose `numberValue`, `stringValue` or
  `booleanValue` -- never on which control rendered the field
- build the value object with exactly one key. A member present as `null` is
  rejected by `@oneOf` coercion just as a second populated member is -- absent
  means absent, not null
- **drop absent values first, coerce second.** `Number("") === 0`, so coercing
  before the emptiness check turns every untouched numeric field into a
  submitted `0`. For `withholdingTax`, whose fields are all optional and whose
  absent values fall back to RSK's own defaults, that silently corrupts the
  calculation rather than failing it
- absent means empty string, `null` or `undefined`
- preserve `0` and `false` once past that check
- `select` submits `stringValue`
- `date` submits `stringValue` unchanged: `DatePickerController` already emits
  `yyyy-MM-dd`, so no conversion is needed anywhere in the web layer
- submit applicable fields only, per the rule below
- do not submit stale configured input keys
- percentage number inputs submit whole percent, for example `37`, exactly as
  the control collects them. The `0-1` conversion RSK wants belongs to the
  client query mapper, so the web layer performs no scaling
- month number inputs submit `1-12`
- `count` inputs render with `min={0}` and `decimalScale={0}`. The domain
  rejects a fractional or negative count with `INVALID_VALUE`, so the control
  does not offer one. `decimalScale` rather than `step`, which NumberFormat
  ignores for `type="number"`

### Applicability, not visibility, decides submission

A field is submitted when it is **applicable**: its dependency is met, its
section's gate is open, and its section's own toggle is on.

Two of those three are already free. `shouldUnregister: true` drops any field
that unmounts, which covers both a dependency-hidden field (`CalculatorField`
returns `null`) and a section whose own toggle is off (`CalculatorSection`
renders its body conditionally).

The third is not. A section gated with `gate.disableOnly` stays **mounted and
visible** with its controls disabled, so react-hook-form still holds its values
and they would otherwise submit. The serializer must exclude them explicitly.

Visibility is the wrong test precisely because of that case: `disableOnly` is a
presentational choice by the editor -- showing a greyed-out preview of what a
toggle unlocks. Keying submission off visibility would let two configs of the
same calculator produce different RSK requests from identical user input, based
only on a cosmetic flag.

The domain remains the authority for final validation. Web gating is for user
experience and to avoid obviously incomplete requests, not to replace API
validation.

## Submit State

Submit should be disabled until:

- config parses
- metadata loads
- required applicable fields have values
- no rendered input key is stale
- no calculation request is already in flight

Note that `withholdingTax` declares no required fields at all -- every one is
`required: false`, because RSK supplies its own defaults for anything absent.
The required-field gate is therefore a no-op for that calculator, and its submit
button is enabled as soon as metadata loads. That is correct, not a gap.

Calculate on button click first. Do not auto-calculate on every sufficiently
filled form state unless a later product decision asks for it.

After a successful calculation, if the user edits any submitted input, clear the
displayed result immediately. The visible result should not drift away from the
visible inputs.

## Output Rendering

The domain returns typed keyed output rows. Web normalizes them into a lookup by
output key, then renders only fields placed in `config.outputSections`.

Rendering rules:

- raw output keys never appear as public labels
- output fields with no authored label are omitted and warned in development
- stale configured output keys are omitted and warned in development
- sections with no visible content and no visible fields are omitted
- markdown `content` renders with `MarkdownText`
- accordion sections render only when they have a title, as required by the
  shared schema
- dividers are rendered automatically between output sections, by convention.
  They are not authored: the `divider` field on the config schema is vestigial,
  never exposed by the editor, and is being removed
- `variant: 'emphasis'` controls prominent result styling
- array fields render rows using configured `itemFields` order
- omitted item fields are not rendered
- repeated output field keys are allowed; configured `uid` remains the render
  identity

Formatting derives from output metadata, not from config:

- currency uses Icelandic krona formatting
- percentage values are whole percent (`37.45`), the same scale the inputs use,
  so the renderer appends the sign and performs no scaling
- count/plain numbers use locale-aware number formatting
- booleans render localized yes/no
- dates render localized dates. No contract declares a date output today, so
  this is unexercised -- and before the first one renders, read the note in the
  domain's `mappings/outputValue.ts`: the client generates with `{ dates: true }`
  and a date-typed response arrives as a `Date`, which that mapper omits. The
  value would never reach the renderer to be formatted
- strings render as plain text

## Error States

The renderer should distinguish:

- metadata load failure
- invalid config
- client-side incomplete form state
- domain validation errors
- RSK/network calculation failure
- empty or missing calculation result

On calculation failure, keep the user's form values visible. Show the failure
near submit/results, not as a metadata load error.

If the domain returns structured field errors, map them back to input controls by
key. Calculation-level errors render as a result-area alert.

Because `taxCalculatorCalculate` is nullable, two failure paths exist and both
need handling: a null or thrown transport error (RSK unreachable, timeout), and
a populated `errors` array on an otherwise successful response.

### Where the words come from

These messages are the slice's own chrome, not editor-authored content, so they
go in `CHROME_TEXT` in `text.ts` alongside `submit` and `loadError`, and render
through `localized(value, activeLocale)`.

Not react-intl: organization slices do not sit inside an `IntlProvider`, so
`useIntl` throws at runtime. Not `configJson` either -- an editor should not have
to author failure text for every calculator.

Hardcoded for now. Moving this copy to a Contentful translation namespace via
`useNamespace` is a later step, deliberately deferred.

Any returned error means no calculation should be rendered. Field-level errors
include `key` and should attach to the matching input control where practical.
A `key` naming a field that is not currently rendered -- dependency-hidden, or
in a closed `disableOnly` section -- falls back to the result-area alert rather
than being dropped. Calculation-level errors have no `key`. Keep the user's form
values visible for both validation failures and RSK/network failures.

## Verification

Web implementation should include focused tests for:

- submit disabled while required applicable values are missing
- serializer chooses the correct one-of value field
- serializer coerces string form values by metadata `type`, including a
  `number`-typed field rendered as a select (`year`, `month`)
- serializer preserves `0` and `false`
- an untouched numeric field is omitted rather than submitted as `0`
- dependency-hidden values are not submitted
- values in a `gate.disableOnly` section are not submitted while the gate is
  closed, though they remain mounted and visible
- date values submit unchanged as `yyyy-MM-dd`
- successful calculation renders scalar output values in CMS order
- array output rows render configured item fields in CMS order
- unlabelled and stale output rows are omitted
- calculation errors preserve form state
- loading state during calculation

`yarn nx build web` remains the practical type/build gate for the renderer.
