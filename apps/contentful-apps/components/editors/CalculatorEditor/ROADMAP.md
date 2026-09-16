# Calculator Editor Roadmap

This roadmap is the durable design document for the Contentful calculator config
editor. The editor writes the shared `@island.is/tax-calculators`
`configJson` contract for calculator entries.

## Goal

Move the editor from the old input-only shape to the shared calculator config
contract:

```ts
{
  inputSections: CalculatorInputSection[]
  outputSections: CalculatorOutputSection[]
}
```

This is greenfield for the new contract. Do not add compatibility code for old
stored `{ sections: [...] }` values.

## Scope

In scope:

- `apps/contentful-apps/components/editors/CalculatorEditor/**`
- the editor GraphQL metadata query and generated operation types
- `apps/contentful-apps/graphql/client.ts` cache support for generated
  `possibleTypes.json`
- read-only support in shared controls reached by this editor
- editor-side validation against live tax calculator metadata

Out of scope:

- web renderer behavior
- calculation execution
- changing the shared config schema
- changing the tax-calculators API domain contract
- migrating old `configJson` values

## Contract Boundaries

The API supplies metadata only: input/output keys, types, requiredness,
dependencies, select option values, output array item fields and number
semantics. It supplies no display text.

The editor authors display structure only: section titles, descriptions, field
labels, placeholders, output markdown content, output field placement and output
presentation hints. Config fields join to API metadata by `key`.

The query uses the current domain shape:

```graphql
taxCalculator(type: TaxCalculatorType!) {
  inputFields { key type required dependsOn { fieldKey equals { __typename } } }
  outputFields { key type }
}
```

Concrete fragments select number `semantic`, select `options`, dependency union
values, and array `itemFields`. Generated operation types remain the source of
truth, but editor components consume normalized local view models rather than
raw GraphQL unions.

## Editor UX

The editor is split into input and output tabs.

Input sections keep the existing toggle/gate model, spans and field placement.
Input field controls resolve first by metadata `type`, then by optional number
`semantic`. Select option values and dependency hints are read-only metadata.

Output sections author localized titles, markdown content, accordion mode, and
field rows. Output field rows author labels and optional emphasis. Array output
fields may author explicit scalar `itemFields`; selecting a different output key
clears nested item fields. Repeated output field keys are allowed.

The editor does not expose `divider` controls in this round. Existing stored
dividers are preserved by the filtering pass; newly authored config omits them.

## Persistence

Schema-valid config saves; schema-invalid config does not. Metadata mismatches
block publish, never save, so authors can keep repairing stale drafts.

Unverified metadata is treated like mismatched metadata for publish blocking:
loading, failed query and unknown calculator type all keep the field invalid
until the contract can be checked.

Draft rows do not block the document. Rows with empty keys, unpersistable
localized values, unlabelled toggles, and gates pointing at unpersisted toggles
stay in React state but are omitted from the payload passed to the shared Zod
schema and to Contentful.

The persistence path compares the filtered serialized payload to the stored
field value before calling `setValue`, so opening an entry or changing Slate
selection does not dirty the entry without a real config change.

`useCalculatorConfig` is the single owner of `sdk.field.setInvalid`, combining
schema invalidity, metadata invalidity and duplicate-key checks.

## Validation

The shared schema validates structural config rules. The editor adds checks that
require live calculator metadata:

- configured input key exists in `inputFields`
- configured output key exists in `outputFields`
- configured output item key exists on the selected array output field
- scalar output fields do not carry configured item fields
- required input fields are placed in input sections
- duplicate on-screen keys are caught against unfiltered draft state

Errors should be routed to the owning control, with tab-level indicators and a
concise top-level summary.

## Drag And Drop

Use `@dnd-kit` with explicit drag handles and keyboard support. Sections reorder
within their tab; input and output fields reorder within and move between
sections of the same tab; output item fields reorder only inside their parent
array field. Empty sections expose droppable targets. Disabled/read-only state
suppresses drag and disables every control.

## Verification

Use focused Contentful-app checks when changing this editor:

```bash
yarn nx run contentful-apps:codegen/frontend-client
npx tsc --noEmit -p apps/contentful-apps/tsconfig.json
yarn nx lint contentful-apps
yarn nx test contentful-apps
yarn nx build contentful-apps
```
