# CalculatorEditor Migration Plan

## Scope

Move the Contentful calculator config editor from the old single input-only shape
to the shared calculator config contract in `@island.is/tax-calculators`.
This is greenfield for the new contract: do not add compatibility code for old
stored calculator config shapes.

In scope:

- `apps/contentful-apps/components/editors/CalculatorEditor/**`
- the editor GraphQL query and generated types it consumes
- `apps/contentful-apps/graphql/client.ts` — wire the already-generated
  `possibleTypes.json` into `InMemoryCache` (two lines, removes the
  interface-fragment trap permanently)
- read-only support in two shared components the disabled-state requirement
  reaches into — `LocalizedTextFields.tsx` and
  `components/translation-namespace/components/MarkdownEditor.tsx` (see
  "Disabled And Read-Only State"); additive only, existing callers unchanged
- editor-only validation and inline errors against live tax calculator
  metadata

No `libs/tax-calculators/ROADMAP.md` edit is needed: its Round 2 paragraph
already states both decisions taken here — "Metadata mismatches block publish,
not save" and "Do not expose `divider` in the editor in this round; dividers are
rendered between sections by convention".

Out of scope:

- web renderer changes
- calculation execution
- changing the shared `@island.is/tax-calculators` schema
- changing the tax-calculators API domain contract
- migration support for old `{ sections: [...] }` Contentful config values

## Contentful Registration

No Contentful-side work this round. This is an existing entry-field widget:
`apps/contentful-apps/pages/fields/calculator-config-field.tsx` is already
registered as an app definition and already assigned to the calculator content
type's `configJson` field appearance. Nothing here needs organization-level
permission, a new app definition, a new installation, or a new field assignment
— only the widget's own code changes.

`configJson` is **non-localized** in the space (confirmed with the programmer,
2026-09-11). That is load-bearing rather than incidental: the persisted value is
a single blob carrying `is`/`en` inside it, and `sdk.field.getValue()` on a field
widget is scoped to `sdk.field.locale` — a localized field would render one
widget instance per locale, each writing its own competing blob. Anything that
would localize this field must be treated as a breaking change to this editor.

No instance parameters are used, and this round adds none.

**Content-type validations on `configJson`.** Partly answerable from the repo:
`libs/cms/src/lib/generated/contentfulTypes.d.ts` types `ICalculatorFields` as

```ts
type: 'withholdingTaxOnWages' | 'childBenefit' | 'vehicleTax' | 'vehicleBenefit'
configJson: Record<string, any>   // non-optional -> required field
```

so `configJson` is **required** (an entry cannot be published without a value)
and `type` carries a value-list validation matching the four calculators.

Two consequences: the widget must always leave a value present — writing
`{ inputSections: [], outputSections: [] }` satisfies required, so the draft
filtering never produces an unpublishable absent value — and the existing
unknown-calculator-type warning is defence against a stale entry rather than
against free text, since the field is constrained at the content-type level.

Confirm the sibling **`type`** field's localization in the same pass. The whole
metadata query keys off `sdk.entry.fields.type?.getValue()`, which with no locale
argument returns the default-locale value — so if `type` is localized, the widget
silently reads only `is`. The plan documents the localization contract for
`configJson`; `type` belongs in it too.

One assumption behind the draft-filtering design, flagged because it has no repo
evidence: that Contentful counts `{ inputSections: [], outputSections: [] }` as
**present** for the required check. It should — the stored value is a non-null
object, and required tests presence, not emptiness — but the whole "draft rows
never block the document" design rests on it, so confirm it once in the space
rather than discovering it at first publish.

Residue for the programmer to confirm in the space before implementation: whether
`configJson` carries any *further* validations (size limits in particular), which
the generated types do not express. `onSchemaErrorsChanged` is wired up
regardless, so a validation this plan did not anticipate surfaces to the author
rather than failing silently at publish.

### Deploy sequencing — this round is inert until the API ships

The widget does not query local code. `graphql/client.ts` sends browser requests
to `/api/graphql`, and that Next route proxies server-side to
`${API_URL}/api/graphql` (`environments/runtimeEnvironment.ts`, defaulting to
`http://localhost:4444`). So the iframe always talks to whatever API deployment
`API_URL` names.

If that API still serves the round-1 schema — `taxCalculator(calculatorType:)`,
`fields`, no `inputFields`/`outputFields` — the new query errors at runtime. Under
the decision above (unverified blocks publish), calculator entries simply cannot
be published in that environment until the API ships — loudly blocked rather
than quietly unchecked, which is the intended trade.

Handover: the round-1 domain changes must be deployed to the environment
`API_URL` points at before this editor is useful there. For local verification,
point the app at a locally-running `apps/api` and confirm the metadata warning
disappears — its absence is the signal that the checks are actually live.

## Current State

The editor still assumes the old config and GraphQL shapes:

- persisted config is read from and written to `config.sections`
- each section has `fields`
- `CalculatorSectionField` / `CalculatorFieldSection` names are used in editor
  code, but the shared library now exports `CalculatorInputSectionField`,
  `CalculatorInputSection`, `CalculatorOutputSectionField`, and
  `CalculatorOutputSection`
- the GraphQL query uses `taxCalculator(calculatorType: $calculatorType)` and
  selects `fields { key inputType required options dependsOn { field equals } }`
- the generated `apps/contentful-apps/graphql/schema.ts` still reflects that old
  query shape

The shared config schema now requires:

```ts
{
  inputSections: CalculatorInputSection[]
  outputSections: CalculatorOutputSection[]
}
```

The API domain already exposes the target metadata shape:

```graphql
taxCalculator(type: TaxCalculatorType!): TaxCalculator!

type TaxCalculator {
  type: TaxCalculatorType!
  inputFields: [TaxCalculatorInputField!]!
  outputFields: [TaxCalculatorOutputField!]!
}
```

Input metadata is now `type` plus optional `semantic`, not `inputType`.
Select options are structured as `{ value }`.
Dependencies use `fieldKey` plus a typed `equals` union.
Output metadata distinguishes scalar output fields from array output fields, and
array fields expose scalar `itemFields`.

## Existing APIs To Use

Do not recreate shared/domain concepts locally. The editor should lean on the
APIs already introduced by the previous rounds.

From `@island.is/tax-calculators`:

- `calculatorConfigSchema`
- `CalculatorConfig`
- `CalculatorInputSection`
- `CalculatorInputSectionField`
- `CalculatorOutputSection`
- `CalculatorOutputSectionField`
- `CalculatorOutputItemField`
- `CalculatorLocalizedText`
- `CalculatorLocalizedMarkdown`
- `CalculatorSectionToggle`
- `CalculatorSectionGate`
- `collectInputSectionToggles`
- `collectInputFieldKeys`
- `collectOutputItemFieldKeys`

`collectOutputFieldKeys` is deliberately **not** used: it dedupes, which makes it
unusable for per-row inline error routing, and this round does not remove used
output keys from dropdowns (repeated output keys are allowed).

From the tax-calculators GraphQL domain:

- root query argument is `type`, not `calculatorType`
- input metadata is `inputFields`
- output metadata is `outputFields`
- input fields expose `type`, optional number `semantic`, structured select
  `options`, `required`, and typed `dependsOn`
- output fields expose `type`, optional number `semantic`, and array
  `itemFields`

Rules for local types:

- generated operation types are still the source
- the raw generated field **unions** are normalized once, at contract-map
  construction
- components consume flat editor view models, never the union
- do not duplicate API enums or persisted config schema shapes

## Contract View Models

`inputFields`, `outputFields` and `itemFields` are interface-typed, so codegen
emits a union of per-`__typename` shapes. `type` is declared as the same
non-literal enum on every member, so **it is not a discriminant — only
`__typename` is**. Reading `semantic`, `options` or `itemFields` straight off the
union is a compile error on every member that lacks them, `strict: false`
notwithstanding.

Normalize once into flat view models:

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

type OutputContractField = {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
  itemFields?: OutputContractItemField[]
}
```

with

```ts
type OutputContractItemField = {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
}
```

Note both flattenings: `options` collapses `{ value }[]` to `string[]`, and
`dependsOn.equals` collapses the typed union to its scalar value.

`codegen.yml` sets `avoidOptionals: { object: true }`, which applies to the
`typescript` plugin's schema types, not to operation selections — so the
generated operation keeps `semantic?: X | null`. The view model's `semantic?` is
right, but the normalizer must map `null` -> `undefined` explicitly, otherwise
`'semantic' in field` style checks downstream are misleading.

The normalizer is the **only** place that switches on `__typename`, and it closes
with a `const unhandled: never = field` exhaustiveness guard — the same pattern
`libs/api/domains/tax-calculators/src/lib/models/inputField.model.ts` uses in its
`resolveType`. That is what makes schema drift loud and localized: a sixth input
field type added to the API produces one compile error, at the normalizer,
instead of silently falling through five unmatched `__typename` checks spread
across row components.

**Verify the emitted member list against the regenerated file rather than
assuming five members.** `typescript-operations` merges concrete types whose
selection sets are identical into one member with a union `__typename`:
`TaxCalculatorStringInputField`, `TaxCalculatorBooleanInputField` and
`TaxCalculatorDateInputField` all select only
`__typename key type required dependsOn`, so they will likely emit as a single
member typed
`__typename: 'TaxCalculatorStringInputField' | 'TaxCalculatorBooleanInputField' | 'TaxCalculatorDateInputField'`,
and the three non-number scalar output types the same way. The exhaustive switch
and its `never` guard still work, but their case list must match what codegen
actually produced. This app has no existing precedent to copy — there is no
collapsed-union member anywhere in the current `graphql/schema.ts`.

## Main Design

Split the editor state and UI into input and output halves:

- `useCalculatorConfig` owns the full `CalculatorConfig`
- input section actions mutate `config.inputSections`
- output section actions mutate `config.outputSections`
- input toggle/gate controls only apply to input sections
- output sections get their own editor, because their fields and section
  metadata differ from input sections
- the UI uses tabs: `Input sections` and `Output sections`
- pass **`forceMount`** to both `Tabs.Panel`s. Forma 36's panel is Radix
  `Tabs.Content` (`TabPanelProps extends Pick<TabsContentProps, 'forceMount'>`),
  so the inactive panel unmounts by default — and because `MarkdownEditor` is
  uncontrolled and seeds `useState(value)` once, every tab switch would destroy
  Slate selection and undo history for all output markdown editors, and remount
  both `DndContext`s. No data is lost (content re-seeds from config), but the
  authoring experience is, so this is chosen rather than inherited.
- when a calculator type is selected and the stored field value is absent, create
  one input section and one output section
- each tab can show a section count in its label
- add-section buttons live at the bottom of each tab

## Output UX

Output section editor:

- show compact controls for title, markdown content, accordion mode and fields
- use the existing `LocalizedTextFields` component for `title`
- use the existing Slate markdown editor for `content`, one editor per locale,
  each with its own `FormControl.Label` naming the locale — `MarkdownEditor`
  renders a bare `Editable` with no label, so two unlabelled identical rich-text
  boxes is the default outcome. Forward an `aria-label` to `Editable` as part of
  the same additive change that adds `readOnly`.
- use a checkbox labelled `Accordion` for `variant: 'accordion'`; unchecked
  omits `variant`
- `outputSectionSchema` rejects `variant: 'accordion'` without a persistable
  `title`, so the `Accordion` checkbox is disabled while `title.is` is empty,
  with a hint saying why. If an author clears `title.is` after enabling
  Accordion, omit `variant` from the filtered payload as well. Ticking Accordion,
  or later clearing the title, must never be able to invalidate the document.
- do not expose `divider` in the editor; omit it from newly authored config.
  Dividers are presentation-only and the product convention is to render them
  between output sections, so no per-section authoring control is needed in this
  round.
- place markdown content before output field rows

Existing markdown editor pieces:

- `apps/contentful-apps/components/translation-namespace/components/MarkdownEditor.tsx`
- `apps/contentful-apps/components/translation-namespace/utils/deserialize.ts`
- `apps/contentful-apps/components/translation-namespace/utils/serialize.ts`

Use `unifyAndDeserialize(markdown)` before rendering the editor and
`serializeAndFormat(nodes)` when saving back to localized markdown strings. Pass
`sdk.dialogs` through to `MarkdownEditor` for link editing.

`MarkdownEditor` is uncontrolled and noisier than it looks — two consequences to
design for rather than discover:

- it seeds `useState<Node[]>(value)` and never syncs the `value` prop after
  mount, and `<Slate onChange>` fires on **selection** changes, not just edits.
  Clicking into a markdown editor would otherwise run
  `serializeAndFormat` -> `setConfig` -> debounce -> `setValue`, marking a clean
  published entry as changed on mere focus. Compare the serialized string to the
  stored value and skip `setConfig` when unchanged.
- because the prop is ignored post-mount, mount each editor with a stable React
  key of section `key` + locale, and do not expect the "clear empty localized
  values" rule to visually reset an already-mounted editor.
- `serializeAndFormat` on an empty document can return whitespace rather than
  `''`; treat whitespace-only markdown as empty when deciding to omit `content`
  or its `en` half.
- signature mismatch to bridge deliberately: `MarkdownEditor.onChange` yields
  `Node[]`, while `serializeAndFormat` takes `(LeafType | BlockType)[]`. The
  existing caller at `components/translation-namespace/index.tsx:193` only
  compiles because this app sets `strict: false`. Decide how the new call sites
  bridge it rather than discovering a cast mid-implementation.

### The debounce writes on mount — guard persistence

`useCalculatorConfig` uses `useDebounce(..., [config])`, which **fires its initial
run**. On mount `config` is the parsed, uid-backfilled stored value, and
`setValue(result.data)` runs unconditionally — so simply opening an entry marks
it changed. Narrowing the auto-create effect does not help, because the debounce
does it independently.

This round makes it worse: the filtering pass means the first payload routinely
differs from what is stored (draft rows dropped, empty localized values omitted,
`variant` stripped), so the mount write is near-guaranteed rather than
occasional.

Guard it: skip `setValue` when the serialized filtered payload equals the
serialized `sdk.field.getValue()`. Keep the separate `setConfig`-level guard for
`MarkdownEditor`'s selection-change `onChange` as well — they catch the same
class of spurious write at different layers, and the cheap one should fire first.

### One owner for `setInvalid`

`useCalculatorConfig`'s debounce already calls `sdk.field.setInvalid(isInvalid)`.
Adding a second call site in `CalculatorConfigEditor` for metadata failures — plus
a third implicit input for "metadata not yet checked" — gives three independent
writers on a last-one-wins API: a debounce firing with schema-valid config would
clear a metadata-driven invalid, and a metadata result would clear a
schema-driven one.

The owner is **`useCalculatorConfig`**. It already runs the debounce that calls
`setInvalid` today, so it takes `metadataInvalid` and `duplicateKeys` as
arguments and computes `schemaInvalid || metadataInvalid || duplicateKeys`
inside that same debounce. That leaves exactly one `setInvalid` call site in the
feature; `CalculatorConfigEditor` computes the metadata verdict and passes it
down, but never calls the SDK itself.

**The dependency array must widen to
`[config, metadataInvalid, duplicateKeys]`.** It is `[config]` today, and
`metadataInvalid` changes independently of `config` — when the query resolves
after mount, when `refetch()` succeeds, and when the entry's `type` changes and
every key goes stale at once. Left at `[config]`, the debounce never re-fires on
those transitions and `setInvalid` goes stale in both directions that matter:
publish stays allowed after a mismatch is discovered, and stays blocked after one
is repaired.

Widening it means the write path now also runs on metadata transitions. That is
safe **only** because of the serialized-equality guard above — without it, a
metadata result would trigger a redundant `setValue` and dirty the entry.

Output field row:

- select output field by key
- dropdown option labels may include compact metadata, for example
  `totalTax · number` or `rows · array`
- use `LocalizedTextFields` for `label`
- use a checkbox labelled `Bold` for `variant: 'emphasis'`; unchecked omits
  `variant`
- if selected metadata is an array, show nested item field rows inline
- selecting an output array does not auto-populate item fields
- offer both `Add item field` and `Add all item fields`
- changing an output field key clears nested `itemFields`
- repeated output field keys are allowed, matching the shared schema

Output item field row:

- select from the selected array output field's scalar `itemFields`
- dropdown option labels may include compact metadata, for example
  `amount · number`
- remove already-used item keys in that array from the dropdown, except the
  current row's selected key
- use `LocalizedTextFields` for `label`

Localized optionality:

- English is optional
- clear empty localized values instead of saving empty strings
- if both markdown locales are empty, omit `content`
- if English markdown is empty, omit `en`

## Input UX

Input field row:

- update metadata handling from old `inputType` to new `type` plus optional
  `semantic`
- input dropdown labels keep the required marker, for example `income *`
- remove already-used input keys from dropdowns, except the current row's
  selected key
- resolve the control on `type` first, `semantic` second. The old
  `CONTROL_BY_INPUT_TYPE` map covered one flat enum; the new metadata splits it
  in two, and a semantic-only lookup silently loses the cases that are types
  rather than semantics:
  - `Boolean` and `Select` are choice-like by `type` (old `Boolean` / `Enum`)
  - `Date` is text by `type`, with the existing "dagsetning" / "date" hint
  - `Year` and `Month` are choice-like by `semantic`
  - `Currency`, `Percentage`, `Count` keep their existing unit hints
  - **fallback:** `Number` with no `semantic`, and `String`, are text with no
    unit hint. State this rather than letting the lookup fall through to
    `undefined` — that would render no placeholder editor at all for a plain
    number field, which is the most common field there is.
- enum members are **PascalCase** in the generated types, not SCREAMING_CASE:
  codegen produces `TaxCalculatorInputFieldType.Boolean` and
  `TaxCalculatorInputFieldSemantic.Year`, matching the existing
  `ApiTaxCalculatorType.WithholdingTaxOnWages` in `constants.ts`. Verify the
  generated names after codegen for the type/semantic maps, not just for
  `toApiCalculatorType`.
- the old map was an exhaustive `Record<TaxCalculatorFieldInputType, Control>`.
  Because `semantic` is optional, a two-stage lookup cannot be exhaustive the
  same way — keep exhaustiveness on the `type` map and treat `semantic` as an
  override layer over it.
- do not show a placeholder editor for any choice-like control
- do not auto-save semantic placeholders
- show semantic-based suggestions only as UI placeholder text when the authored
  placeholder is empty
- for `SELECT` fields, show raw option values as a compact read-only hint
- for `dependsOn`, show a read-only condition hint using `fieldKey` and the typed
  `equals.value`

Input sections keep the existing toggle/gate authoring model, but through
`inputSections` and `collectInputSectionToggles`.

## Drag And Drop

Use the repo's existing `@dnd-kit` dependency and Contentful-app precedent.

Existing examples:

- `apps/contentful-apps/components/sortable/CustomSortableContext.tsx`
- `apps/contentful-apps/components/sortable/SortableEntryCard.tsx`
- `apps/contentful-apps/components/sitemap/SitemapTreeField.tsx`
- `apps/contentful-apps/components/sitemap/SitemapNode.tsx`

The existing single-list wrapper is useful precedent, but CalculatorEditor needs
custom sortable wrappers because fields must move across sections.

Required behavior:

- input sections reorder within the input tab
- output sections reorder within the output tab
- input fields reorder within and move between input sections
- output fields reorder within and move between output sections
- output item fields reorder within their parent array output field only
- fields do not move between input and output tabs
- empty sections have visible drop zones
- dragging uses explicit drag handles only, not whole panels
- stable IDs are section `key` and field/item `uid`

Mechanics, so these are not discovered mid-implementation:

- `CustomSortableContext.tsx` is a single-list `arrayMove` wrapper. It is the
  right precedent for reordering, but it provides no droppable target for an
  empty container, so "empty sections have visible drop zones" needs an explicit
  `useDroppable` per section rather than `SortableContext` alone.
- cross-section moves need an `onDragOver` / `onDragEnd` pair that distinguishes
  a same-container reorder from a cross-container move; `arrayMove` alone cannot
  express the latter.
- give the input tab and the output tab their own `DndContext`. That makes
  "fields do not move between input and output tabs" structural rather than a
  runtime guard.
- `CustomSortableContext` registers only `PointerSensor`, so inheriting it
  wholesale makes reordering **mouse-only** — and this round makes drag the sole
  reordering affordance for sections, fields and item fields. Register
  `KeyboardSensor` with `sortableKeyboardCoordinates`, and use Forma 36's
  **`DragHandle`** (`@contentful/f36-drag-handle`, already a dependency of
  `f36-components`) rather than hand-rolling a button: it takes
  `as?: 'button' | 'div'`, a required screen-reader `label`, and
  `isActive`/`isFocused`/`isHovered` styling props — the accessible, styled
  version of exactly this. Hang `useSortable`'s `listeners`/`attributes` on it.
  If that proves awkward for nested item rows, provide up/down buttons as the
  accessible path instead — but do not ship drag as the only way.
- keep the existing plain `startAutoResizer()`. Do not "fix" a clipped drag
  preview by switching to `startAutoResizer({ absoluteElements: true })`: the SDK
  documents an infinite resize loop for that option with absolutely-positioned or
  transformed children, which is exactly what a DnD overlay is.

## Disabled And Read-Only State

Neither the current editor nor the original plan reads
`sdk.field.onIsDisabledChanged` / `sdk.field.getIsDisabled()`. This round adds
drag handles, checkboxes, markdown editors and add/remove buttons, so an author
without edit permission — or on a locked entry — could otherwise drag sections
and type markdown while saves fail or succeed against their permission.

Subscribe to `onIsDisabledChanged` and thread the flag through: disable every
control, and suppress drag handles and drop zones entirely when disabled. No
control stays active while the field is disabled.

Two shared components have no read-only path today, so this requirement reaches
**outside** `CalculatorEditor/**` — listed here so it is an approved part of the
plan rather than a mid-implementation discovery:

- `components/editors/CalculatorEditor/components/LocalizedTextFields.tsx` takes
  no `isDisabled` and passes none to `TextInput` — add the prop and forward it.
  While this file is open, fix its labelling in the same edit: it renders one
  `FormControl.Label` over two unassociated `TextInput`s (no `id`/`htmlFor`), so
  the label points at nothing and both inputs are announced unlabelled. This
  round adds three more callers of it (output section title, output field label,
  item label), so the defect multiplies if left. Add `id`/`htmlFor` and a
  per-input `aria-label` distinguishing the locales.
- `components/translation-namespace/components/MarkdownEditor.tsx` does not
  plumb `readOnly` through to Slate's `Editable`, and renders its toolbar and
  `LinkButton` unconditionally. Either forward a `readOnly` prop (also hiding the
  toolbar) or render the markdown as static text when disabled, whichever proves
  smaller once the component is open.

`MarkdownEditor` is shared with the translation-namespace editor, so any prop
added must default to the current behaviour and leave that caller untouched.

**Disabled must also gate the write path, not just the controls.** The
auto-create effect and the debounce are unconditional today. Opening a locked or
read-only entry with no stored value would create two sections, attempt
`setValue`, fail, and fire `sdk.notifier.error('Could not save…')` at an author
who did nothing at all. Gate both the auto-create effect and the `setValue` call
on `!isDisabled`.

## Metadata Validation

Keep the shared Zod schema as the persisted structural gate. Add editor-side
validation for metadata-dependent problems that the shared schema deliberately
does not validate:

- configured input key not present in `inputFields`
- configured output key not present in `outputFields`
- output scalar/array mismatch for `itemFields`
- configured array item key not present in the selected output field's
  `itemFields`
- required input field not placed in any input section

**Metadata problems block publish, never save.** Once metadata has loaded
successfully, a metadata problem sets `sdk.field.setInvalid(true)` and renders an
inline error on the offending control — but the value still persists via
`setValue`. These are two different levers and must not be conflated:
`setInvalid(true)` blocks publish while keeping the value; skipping `setValue`
loses the author's work on the next iframe reload.

Non-persistence is reserved for schema-invalid config, where `safeParse` yields
nothing valid to write.

This matters because "required input field not placed in any input section" is
the definition of work in progress, and because changing the entry's calculator
`type` makes every configured key go stale at once — blocking save there would
strand the entry until every key was repaired by hand.

**Unverified is treated exactly like mismatched: both block publish.** Publishing
is a release to production, so it must never be possible for content that is
unfinished *or* unverified. "We could not check" therefore carries the same
weight as "we found a problem".

Publish is blocked when metadata is loading, when the query failed, and when the
calculator type is unknown — the query is skipped in that last case, so nothing
is ever checked and the verdict must not fall through as if it had been. Saving
is unaffected in every one of those states; the draft keeps the author's work.

This reverses an earlier draft of this plan, which allowed publish on a failed
query so an outage could not block releases. The governing principle is the
stronger one: never release unverified content. `libs/cms`'s `mapCalculator`
rests on the same assumption — it degrades instead of throwing on an invalid
config precisely because "editors are gated at authoring time by the Contentful
widget's `setInvalid`".

Accepted cost, stated plainly: while this round is deployed ahead of its API (see
"Deploy sequencing"), metadata never loads, so calculator entries cannot be
published until the API ships. Intended behaviour, not a regression.

`setInvalid` only ever *blocks*. Nothing in this widget calls `publish()` —
clearing the flag merely permits a human to release, and releasing stays a human
decision.

Because Apollo will not re-run a failed `useQuery`, expose `refetch()` behind a
"Try again" button in the warning `Note` — otherwise the author's only recovery
is reloading the whole entry editor.

Memoize the metadata verdict on `[config, inputContract, outputContract]` rather
than recomputing it in the render path: it walks every section in both tabs, and
would otherwise run on every keystroke.

### Draft rows must not block the document

The shared schema requires `key` and localized `is` at `min(1)`, and the config
is a single blob: one incomplete row currently fails `safeParse` for the whole
document, so nothing persists. With two tabs, an unfinished row in the Output tab
would silently block unrelated work in the Input tab.

Persist a filtered copy instead of the raw draft state:

- a row whose `key` is empty is a draft — keep it in React state so it stays on
  screen and editable, but omit it from the payload handed to `safeParse` /
  `setValue`
- mark each draft row visibly ("not saved yet — pick a field key") so its absence
  from the stored value is never silent
- `sectionToggleSchema` requires `label` (not optional, `is` at `min(1)`), so an
  unlabelled toggle cannot be rescued by omitting a sub-field: persist a toggle
  only once it is labelled, and suppress any `gate` pointing at a toggle that is
  not yet persisted — otherwise the gate refinement fires with "Gate references
  toggle X, which no input section declares"
- this replaces the current `newToggle()` behaviour, which returns
  `label: { is: '' }` and so invalidates the entire config the moment a section
  toggle is enabled

Empty localized values must be filtered by the same pass. `LocalizedTextFields`
calls `onChange({ is: nextIs, en: nextEn || undefined })` and clears only when
*both* locales are blank **and only if the caller passes `clearWhenEmpty`** —
without it, `{ is: '', en: '' }` persists, so every new output-side caller must
pass the prop explicitly. Either way the filtering pass is still required:
typing an English label before an Icelandic one
produces `{ is: '', en: 'x' }` — which fails `localizedTextSchema`'s
`is: z.string().min(1)` and invalidates the whole config. This applies to output
section `title`, output field `label`, item `label`, toggle `label`, and markdown
`content` alike. Rule: a localized value whose `is` is empty is omitted from the
payload and its row marked not-yet-saved; never written as `{ is: '' }`.

The filter is a **passthrough, not a whitelist**: it removes only draft rows and
empty localized values, and never strips a schema-valid key it does not know
about. That matters for `divider` — this round authors no new ones, but an entry
that already carries one keeps it, and round 3 renders it.

The known cost: a row where the author typed a label but no key is dropped on
reload. That is bounded to the one row, where the alternative loses every edit
made since the draft row appeared, across both tabs.

### Filtering breaks positional issue paths — map them

Zod issue paths are positional (`inputSections.1.fields.3.key`) and index the
**filtered** payload, while the UI renders the **unfiltered** state. Any draft row
preceding an erroring row shifts every later index, so routing an inline error by
position alone lands it on the wrong control — silently, and only sometimes.

While filtering, build a payload-index -> identity map and resolve every issue
path through it before rendering. Position is not a usable identity here.

The map needs **three** levels, not two — draft *item* rows are filtered too:
section `key` -> field `uid` -> item `uid`.

Verify the emitted path shapes empirically rather than assuming them.
`outputSectionFieldSchema`'s `superRefine` raises issues with paths relative to
the field (`['itemFields', i, 'uid']`) which zod then prefixes at assembly, so
confirm the assembled path really is
`outputSections.a.fields.b.itemFields.c.uid` before building the resolver
against that shape.

Put the filtering pass and the path resolver in `utils.ts` as **pure functions
with a spec**, not inside the hook. This app already runs jest (see
`components/translation-namespace/utils/*.spec.ts`), and these are precisely the
two pieces the plan itself describes as failing "silently, and only sometimes" —
they are the parts that most need tests and the easiest to test once they are
outside React.

### Duplicate keys must be checked against the unfiltered state

The schema enforces globally-unique input `key`s and `uid`s — but it only ever
sees the filtered payload. Two on-screen rows carrying the same key therefore
produce no error at all until the second one is complete, which is precisely
when the author is looking at them.

Duplicate detection runs as an editor-side check over the **unfiltered** state,
alongside the metadata checks below, and is subject to the same publish-not-save
rule.

### `uid` and `key` are not type-guaranteed in this app

`apps/contentful-apps/tsconfig.json` sets `strict: false`, so `z.infer` yields
all-optional types inside this app: `CalculatorConfig` reads as
`{ inputSections?: { key?: string; fields?: { uid?: string; ... }[] }[]; ... }`.
`key={field.uid}` therefore compiles when `uid` is `undefined`, and dnd-kit given
an `undefined` id degrades into silently broken dragging.

So the schema type cannot be leaned on: every row-creation path assigns a `uid`
at construction, and the DnD id derivation asserts presence at runtime rather
than trusting the type. Same root cause as the known `'error' in result` pitfall,
with a second consequence.

### Schema errors must point at their own control

`invalidPaths` is currently joined into a single top-level `Note`. With tabs, a
path like `outputSections.1.title` can render while the author is on the Input
tab, pointing at a control they cannot see.

- route each schema issue path to the control that owns it and render the message
  inline there
- show an error indicator on the tab label when that tab holds any issue
- keep a concise top-level note as a summary, not as the only signal

## GraphQL Work

Replace the editor query with the new argument and metadata fields:

```graphql
query GetTaxCalculatorFieldsForContentfulApp($type: TaxCalculatorType!) {
  taxCalculator(type: $type) {
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
            value
          }
          ... on TaxCalculatorStringInputDependencyValue {
            value
          }
          ... on TaxCalculatorNumberInputDependencyValue {
            value
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

After changing the query, regenerate `apps/contentful-apps/graphql/schema.ts`
with:

```bash
yarn nx run contentful-apps:codegen/frontend-client
```

`apps/contentful-apps/graphql/client.ts` creates `InMemoryCache` without
`possibleTypes`, and the generated `possibleTypes.json` is currently unused.
That is acceptable for this query, but the reason is narrower than "it queries no
interfaces" — `inputFields`, `outputFields` and `itemFields` are all abstract-typed
fields. What makes `possibleTypes` unnecessary is that every inline fragment's
**type condition** is a concrete object type (`TaxCalculatorNumberInputField`,
`TaxCalculatorSelectInputField`, `TaxCalculatorNumberOutputField`,
`TaxCalculatorArrayOutputField`), and Apollo's `fragmentMatches` short-circuits on
`typename === condition` before consulting the supertype map.

So the rule is about the **condition**, not the field: the moment a fragment
condition is itself an interface or union — `... on TaxCalculatorOutputScalarField`
is the tempting one here — matching silently fails until `possibleTypes` is wired
into the cache.

**Wire it, rather than documenting the footgun.** `possibleTypes.json` is already
generated by `codegen.yml` and merely unused; passing it to `new InMemoryCache()`
in `apps/contentful-apps/graphql/client.ts` is a two-line change that removes the
trap permanently instead of leaving a comment for the next person to not read.
Add `graphql/client.ts` to the touched-file list for this round.

## File-Level Plan

### `constants.ts`

- rename `GET_TAX_CALCULATOR_FIELDS` only if needed; the operation can keep the
  same exported constant name
- change query argument from `calculatorType` to `type`
- select `inputFields` and `outputFields`
- update comments from "input contract only" to "input and output metadata"
- keep `toApiCalculatorType`, but verify generated enum names after codegen
- run `yarn nx run contentful-apps:codegen/frontend-client` after changing the
  query

### `types.ts`

- replace `ContractField`/`FieldContract` with separate input/output contracts.
  Keep the existing element/map distinction rather than collapsing it — the
  current pair is `ContractField` (element) / `FieldContract` (map), so this
  needs four names: `InputContractField` / `InputFieldContract` and
  `OutputContractField` / `OutputFieldContract`.
- the map element is the **view model** (see "Contract View Models"), not the raw
  generated union. The generated operation stays the source: the normalizer's
  input type is read off the operation's selection set, so widening the query
  still widens what the normalizer sees.
- add action types for input sections, output sections, output fields, and output
  item fields

### `utils.ts`

- change `createEmptyConfig` to return `{ inputSections: [], outputSections: [] }`
- keep `generateKey`
- add small helpers only if they remove repeated contract-map or field-type logic

### `hooks/useCalculatorConfig.ts`

- normalize stored config from the new shape
- do not read or migrate old `{ sections: [...] }` config values. Note the effect
  is stronger than "ignore": the `createEmptyConfig()` fallback plus the
  auto-create effect plus the debounce means opening an entry holding an old
  value silently **overwrites** it with no author action. That is acceptable here
  because dev entries are disposable, but it is a chosen behaviour, not a
  side effect to discover later.
- guard `inputSections` and `outputSections` independently. A single
  `if (!Array.isArray(stored?.inputSections)) return createEmptyConfig()` would
  discard authored `outputSections` on any entry holding only one half.
- backfill section keys and field/item `uid`s in both input and output sections
- persist a filtered copy per "Draft rows must not block the document": drop
  empty-`key` rows and unlabelled toggles (and gates pointing at them) from the
  payload, while keeping them in state
- subscribe to `sdk.field.onIsDisabledChanged` and expose the disabled flag
- validate/save the full `CalculatorConfig`
- create one default input section and one default output section when a
  calculator type is selected and the stored field value is **absent** — not
  merely when the arrays are empty. Auto-creating on an entry that stores an
  explicitly empty array writes sections back with no author action, which marks
  a clean published entry as changed just by opening it. This round doubles the
  old effect (two sections instead of one), so the trigger is narrowed here
  deliberately. Evaluate "absent" against a ref captured in the `useState`
  initializer **at mount** — not a live `sdk.field.getValue()` and not `config`
  state. The effect keys on `calculatorTypeValue`, which can change after mount,
  by which time the debounce has already populated the stored value and a live
  read would report it present.
- remove the `?? ''` fallback in `toggleGateDisableOnly`: it writes
  `gate: { toggle: '' }`, and `sectionGateSchema.toggle` is `min(1)`. It is
  unreachable today only because `SectionToggleControl` renders that checkbox
  solely when `gate` exists — a guard this round rewrites, so the defect would
  outlive the thing making it safe. Same class as the `newToggle()` defect above.
- surface Contentful's own field validations via `onSchemaErrorsChanged`, so an
  author blocked at publish by a content-type validation gets an explanation
  from the widget rather than silence.
- both `onIsDisabledChanged` and `onSchemaErrorsChanged` **fire immediately with
  the current value**, so no separate `getIsDisabled()` / `getSchemaErrors()`
  initial read is needed — do not add a competing one. Both return an
  unsubscribe function, which must be returned from the `useEffect`.
- replace `collectSectionToggles` with `collectInputSectionToggles`
- expose separate `inputSections`, `outputSections`, `inputSectionActions`, and
  `outputSectionActions`
- expose reorder/move actions for sections, fields and item fields
- clear output field `itemFields` whenever its selected key changes

### `CalculatorConfigEditor.tsx`

- change the `useQuery` `variables` from `{ calculatorType: apiCalculatorType }`
  to `{ type: apiCalculatorType }` — the argument rename is not confined to
  `constants.ts`
- build two metadata maps, replacing the single `data?.taxCalculator.fields`
  read:
  `inputContract` from `data.taxCalculator.inputFields`
  `outputContract` from `data.taxCalculator.outputFields`
- update empty-contract warnings for input and output separately
- render input and output editors in tabs
- pass the right contract and action objects to each child editor
- thread `isLoading` into the output components too, not just `ConfigSection` —
  the output tab otherwise has no loading affordance while metadata is in flight.
  `@contentful/f36-skeleton` is installed.
- keep the unknown calculator type and save-error behavior
- run metadata validation when metadata is loaded
- set `sdk.field.setInvalid(true)` when either schema validation or loaded
  metadata validation fails — but only schema failure suppresses `setValue`
- route schema issue paths and metadata errors to the owning control, and mark
  the tab label when that tab holds an issue; keep the top-level `Note` as a
  summary only

### Input Components

- rename or adapt `ConfigSection` and `SectionFieldRow` to be input-specific
- update field metadata handling from old `inputType` enum to new `type` +
  optional `semantic`
- update select options from strings to `{ value }`
- update dependency display from `dependsOn.field` / scalar `equals` to
  `dependsOn.fieldKey` / union `equals.value`
- keep section toggle/gate UI on input sections only
- keep `span` for input fields
- add DnD drag handles and drop zones

### Output Components

Add output-specific components rather than overloading the input row:

- output section editor
  - title localized text
  - markdown `content`
  - `Accordion` checkbox for `variant: 'accordion'`, disabled while `title.is` is
    empty; filtered payload omits `variant` if `title.is` becomes empty
  - no `divider` control
  - output field rows
- output field row
  - select output field by key
  - localized label
  - `Bold` checkbox for `variant: 'emphasis'`
  - stale-key inline error
  - if selected metadata is an array, edit explicit `itemFields`
  - if selected metadata is scalar, clear stored `itemFields`
  - add all item fields action for array fields
  - do not remove already-used output keys from this dropdown; repeated output
    field keys are allowed
- output item field row
  - select from the selected array output field's scalar `itemFields`
  - localized label
  - stale item-key inline error
  - DnD within the parent array field

## Validation And UX Notes

- Schema invalidity blocks both save and publish: `setInvalid(true)` and no
  `setValue`.
- Metadata mismatches block publish only: `setInvalid(true)`, value still
  persists. So does metadata that could not be verified at all — loading, failed
  query, or unknown calculator type. See "Metadata Validation" for why.
- Incomplete draft rows block neither — they are filtered out of the payload.
- Show inline errors next to affected controls, with the top-level note as a
  summary and an error marker on the owning tab. Use the Forma 36 mechanism —
  `isInvalid` on the control plus `FormControl.ValidationMessage` beneath it —
  rather than loose `Note`s dropped next to rows.
- Preserve the current selected key in a row's own dropdown so editors can see
  and repair an invalid value, while removing already-used valid keys from other
  dropdowns.
- For output array fields, preserve `itemFields` only while the selected output
  key itself is stale. Clear them immediately when the user changes the output
  key.
- For dependencies, display the typed value plainly. Current data is boolean, but
  the API contract allows boolean, string, and number.
- If the metadata query fails, is still loading, or the calculator type is
  unknown, show a warning and keep publish blocked — saving continues normally.
  Unverified and mismatched are treated alike.

## Verification

In order — codegen first, since everything downstream types against it:

```bash
yarn nx run contentful-apps:codegen/frontend-client
npx tsc --noEmit -p apps/contentful-apps/tsconfig.json
yarn nx lint contentful-apps
yarn nx test contentful-apps
yarn nx build contentful-apps
```

`apps/web/components/Organization/Slice/Calculator/*` still imports the names
removed in round 1, so `yarn nx build web` stays red after this round **by
design** (ROADMAP round 3 moves the renderer). That is not a regression
introduced here.

**Baseline: the app does not currently type-check** — 12 errors, all in
`CalculatorEditor/**`, all from the round-1 renames. There is no green baseline
to regress from, so the first clean `tsc` run *is* this migration's completion
signal.

`tsc --noEmit` is the fast compile gate (there is no nx `tsc` target for this
app, but the direct invocation works and is far cheaper than a build);
`nx build` stays as the final gate. Inspect the regenerated
`GetTaxCalculatorFieldsForContentfulAppQuery` type directly as well — with
`strict: false` in this app's tsconfig, some shape errors surface as `any`
rather than as a build failure.

`yarn nx test tax-calculators` is not the gate for this round — the shared schema
is unchanged here — though it is cheap insurance that nothing drifted in
`libs/tax-calculators`.
