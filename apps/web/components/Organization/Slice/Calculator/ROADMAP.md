# Calculator Web Renderer Roadmap

This roadmap covers the remaining public web work for the CMS `Calculator`
slice after the shared config, API metadata domain and Contentful editor
refactor.

The renderer is restored to a metadata-driven input-rendering state. The
calculation operation is a separate API/domain design problem and is not part of
this roadmap.

## Scope

In scope:

- `apps/web/components/Organization/Slice/Calculator/**`
- the web GraphQL metadata query in `apps/web/screens/queries/TaxCalculators.ts`
- generated web GraphQL operation types consumed by the renderer
- focused tests for config parsing, input rendering, output metadata diagnostics
  and omission rules

Out of scope for the first renderer pass:

- Contentful editor changes
- shared `@island.is/tax-calculators` schema changes
- old `{ sections: [...] }` config compatibility
- browser-side calculation logic
- API/domain calculation operation design
- calculator-specific bespoke layouts

## Current State

The renderer parses the shared `configJson`, queries the current metadata shape,
normalizes input/output metadata locally, renders configured input sections, and
keeps submit disabled until a calculation operation exists.

Settled limitations:

- Submit is disabled and no calculation is executed.
- `outputSections` are used for metadata/config diagnostics only; calculated
  output value rendering waits for the calculation boundary.
- Raw keys are acceptable for diagnostics, not public rendering.
- `libs/clients/rsk/calculators` can calculate through calculator-specific
  typed methods, but `libs/api/domains/tax-calculators` deliberately exposes
  metadata only.

## Target Behavior

The renderer should:

- parse `configJson` with `calculatorConfigSchema`
- render fields placed in `inputSections`
- omit fields not placed in `inputSections`
- validate and prepare output metadata/config joins from `outputSections`
- prepare omission diagnostics for output fields not placed in `outputSections`
- join authored config to domain metadata by `key`
- omit stale configured keys instead of guessing presentation
- never fall back to raw keys for public labels; omit unlabeled fields instead
- keep dev-only diagnostics for stale config and metadata mismatches

## Metadata Query

Replace the old web query with the new domain shape. This is the same operation
shape already used by the Contentful calculator editor; keep the inline
fragments on concrete object types and keep dependency value aliases, otherwise
GraphQL codegen will reject the query.

```graphql
query GetTaxCalculator($type: TaxCalculatorType!) {
  taxCalculator(type: $type) {
    type
    inputFields {
      __typename
      key
      type
      required
      dependsOn {
        fieldKey
        equals {
          __typename
          ... on TaxCalculatorBooleanInputDependencyValue {
            booleanValue: value
          }
          ... on TaxCalculatorStringInputDependencyValue {
            stringValue: value
          }
          ... on TaxCalculatorNumberInputDependencyValue {
            numberValue: value
          }
        }
      }
      ... on TaxCalculatorNumberInputField {
        semantic
      }
      ... on TaxCalculatorSelectInputField {
        options {
          value
        }
      }
    }
    outputFields {
      __typename
      key
      type
      ... on TaxCalculatorNumberOutputField {
        semantic
      }
      ... on TaxCalculatorArrayOutputField {
        itemFields {
          __typename
          key
          type
          ... on TaxCalculatorNumberOutputField {
            semantic
          }
        }
      }
    }
  }
}
```

Regenerate `apps/web/graphql/schema.ts` after changing the operation. Generated
operation types should remain the source of truth for renderer-local metadata
view models.

## Calculation Boundary

The current `libs/api/domains/tax-calculators` GraphQL domain is metadata-only.
Its `taxCalculator` query explicitly does not run calculations.

That is not a renderer implementation detail. It is a domain/API design choice
that must be handled outside this roadmap. The underlying RSK client has
calculator-specific typed methods, while this renderer is intentionally generic
and config-driven. A future calculation operation must choose between at least
these two shapes:

- Generic: one operation taking `{ type, values }` and returning keyed output
  values. This fits the renderer but moves dispatch and coercion into the API
  boundary.
- Per-calculator: one typed operation per calculator. This keeps the client type
  safety, but pushes calculator-specific branching back into a generic renderer.

That future operation also owns input/output boundary decisions such as month
indexing and percentage scale. The renderer should not guess those rules.

For this roadmap, the buildable work is:

- metadata query migration
- metadata normalizers
- input rendering
- output metadata/config helpers that join config to output metadata by key
- tests around rendering and omission rules

Submit and calculated output values stay blocked until the separate calculation
boundary exists. When that boundary is decided, it should:

- accept a `TaxCalculatorType`
- accept submitted input values
- execute through the backend/domain boundary
- return calculated output values keyed by the same output keys exposed in
  `outputFields`

Do not invent a client-only result shape in the renderer.

## Renderer View Models

Normalize generated GraphQL unions once and make components consume flat maps.

Input metadata:

```ts
type InputContractField = {
  key: string
  type: TaxCalculatorInputFieldType
  semantic?: TaxCalculatorInputFieldSemantic
  options?: string[]
  required: boolean
  dependsOn?: {
    fieldKey: string
    equals: string | number | boolean
  }
}
```

Output metadata:

```ts
type OutputContractField = {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
  itemFields?: OutputContractItemField[]
}

type OutputContractItemField = {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
}
```

Rules:

- normalize `null` semantics to `undefined`
- collapse option objects to `string[]`
- collapse typed dependency values to scalar values
- switch on `__typename` in one normalizer module
- use exhaustiveness guards so schema drift fails loudly
- avoid passing generated GraphQL unions into render components
- use the shared placement collectors instead of hand-rolled traversal where
  applicable: `collectInputFieldKeys`, `collectOutputFieldKeys` and
  `collectOutputItemFieldKeys`
- transcribe the editor normalizer pattern, not every defensive runtime
  assertion: `apps/web` has `strict: true`, while `apps/contentful-apps` has
  `strict: false`
- duplicate these web-local normalizers for now; extract to shared code only if
  a third consumer appears or the two existing consumers converge
- keep dependency comparison strict for this pass. Current data uses boolean
  dependencies; if future metadata compares a number dependency against a
  string-valued form control, the calculation-boundary work must define the
  coercion rule instead of guessing here.

## Input Rendering

The renderer uses the current shared config names: `inputSections`,
`collectInputSectionToggles`, `CalculatorInputSection`, and
`CalculatorInputSectionField`.

Keep the existing input section behavior:

- section `toggle` controls whether that section body is shown
- section `gate` hides or disables a downstream section based on another
  section's toggle
- `span` maps to the existing `GridColumn` twelfths table
- unplaced domain input fields are not rendered; use `collectInputFieldKeys`
  for placement diagnostics instead of hand-rolled sets
- stale configured input keys are omitted and reported only in dev logs

Update field rendering for new metadata:

- `type` replaces `inputType`
- number `semantic` decides year, month, currency, percentage, count or plain
  number presentation
- select options use normalized option values
- dependencies use `fieldKey`
- dependency equality compares against normalized scalar values

Public labels:

- input fields without authored labels are omitted from public rendering and
  reported with a development-only warning
- section toggle labels are required by the shared schema, so the
  `?? section.toggle.key` fallback at `CalculatorSection.tsx:97` is dead at
  runtime -- but it is load-bearing at the type level (`ToggleSwitchCheckbox`
  requires `label`, `localized()` returns `string | undefined`). Replace it with
  `?? ''`; deleting it outright does not compile under `strict: true`.
- placeholders remain optional

## Submit Placeholder

Keep submit disabled until a calculation operation exists. Do not include submit
execution or payload coercion in this renderer roadmap.

When a separate calculation roadmap/API operation exists, the renderer should
then:

- enable only after metadata is loaded and config parsed
- collect values from rendered and applicable fields only
- do not submit disabled gated fields
- preserve `0` and `false`
- omit empty strings, `null`, `undefined` and dependency-inapplicable fields
- convert values to the scalar types expected by the operation
- keep form values visible on calculation failure
- show a calculation-specific error near submit/results

## Output Metadata Preparation

Do not build the full output value renderer in this roadmap. The result value
shape depends on the separate calculation-boundary decision. If that decision
lands on per-calculator operations, a generic by-key value renderer may need to
change substantially.

Build only the metadata/config pieces that are stable now:

- helpers that join `config.outputSections` to `outputFields` metadata by key
- diagnostics for stale output field keys and stale array item keys
- tests for omission/diagnostic behavior with metadata only

When a calculation result shape exists, add dedicated output value components
such as:

- `CalculatorOutput.tsx`
- `CalculatorOutputSection.tsx`
- `CalculatorOutputField.tsx`

Future behavior:

- render nothing before calculated result values exist
- iterate `config.outputSections` in authored order
- omit output sections with no visible content and no visible fields
- render section `content` with `MarkdownText` and
  `replaceNewLinesWithBreaks={false}`
- render `variant: 'accordion'` with the appropriate island-ui accordion
  primitive, likely `AccordionCard` or `Accordion` / `AccordionItem`
- render output field `variant: 'emphasis'` with prominent result styling
- output keys may repeat; use configured `uid` for React identity

Field behavior:

- join configured output fields to output metadata by `key`
- join configured array item fields to parent item metadata by `key`
- scalar result values, once supplied by a future operation, render as labeled
  rows
- array result values, once supplied by a future operation, render as a
  list/table in authored item field order
- omitted item fields are not rendered
- stale output keys and stale item keys are omitted and reported only in dev logs

Public labels:

- output fields without authored labels follow the same omit-and-warn policy as
  input fields
- output item fields without authored labels are the same policy
- accordion section titles are schema-required and should come from config

## Future Formatting

Formatting matters once calculated result values exist. It should derive from
metadata and locale, not from config.

Initial rules:

- currency semantics use Icelandic krona formatting
- percentage semantics render as percentages in the active locale
- count and plain numbers use locale-aware number formatting
- date values use locale-aware date formatting
- booleans render localized yes/no if boolean outputs exist
- strings render as plain text

Keep future formatting helpers local to this renderer until another consumer
needs them.

## Error And Empty States

Invalid or absent config:

- render `null`, matching current behavior
- log Zod issues in development with paths

Metadata load failure:

- show the existing load error alert
- do not render a half-configured form

No output sections:

- allow the input form to render
- once calculation exists, allow calculation to run without rendering a generic
  result layout unless product/design asks for one

## Testing

Recommended focused coverage:

- invalid config renders nothing
- input sections render from `inputSections`
- toggle and gate behavior still works
- stale input keys are omitted
- required unplaced input fields warn only in development
- unlabeled input fields are omitted and warn in development; they never render
  raw keys
- output metadata/config helpers report stale output keys
- output metadata/config helpers report stale array item keys

Run at least:

```bash
yarn nx test web --testPathPatterns=Organization/Slice/Calculator --coverage=false
yarn nx build web
```

`yarn tsc -p apps/web/tsconfig.json --noEmit` is not a useful gate in the
current repo state: the app tsconfig references `tsconfig.spec.json`, which
extends it, and there is no dedicated `tsc` target in `apps/web/project.json`.
`nx test web` uses `babel-jest`, so it does not type-check either. Use
`yarn nx build web` as the practical type/build gate.

`apps/web` also has little component-test precedent. Its Jest config has no
setup file registering jest-dom matchers, and the existing
`MarkdownText.spec.tsx` uses React Testing Library queries with native Jest
assertions. Expect some test setup friction and avoid assuming
`toBeInTheDocument()` is available.

## Implementation Order

1. Rename old shared config usage to current exports and `inputSections`.
2. Update the tax calculator metadata query and regenerate web GraphQL types.
3. Transcribe the metadata normalizers from the Contentful editor and replace
   direct generated-union usage.
4. Restore input rendering against `inputFields`.
5. Keep submit disabled.
6. Add output metadata/config helpers that join config to `outputFields`
   metadata for diagnostics only.
7. Add focused tests for omission rules, labels, input rendering and output
   metadata diagnostics.
8. Run TypeScript, focused tests and the strongest practical web check.

## Open Questions

- Are year and month input ranges still intentionally web-owned defaults, or
  should the domain expose bounded options later?
- ~~Should optional input/output field labels cause omission in the web
  renderer?~~ **Decided:** omit and warn in development for the first pass.
  Making labels required in the shared schema is a later step, gated on
  verifying existing content.
- Should select option display labels remain raw values for now, or do they need
  an authored label model before launch?
- ~~Should section `divider` be ignored in the first renderer pass or honored
  immediately?~~ **Decided:** neither. Dividers render automatically between
  output sections by convention, matching what the shared roadmap already said
  the editor should never expose. The `divider` field on the config schema is
  vestigial and is being removed, along with its specs and the editor's
  preservation logic.
