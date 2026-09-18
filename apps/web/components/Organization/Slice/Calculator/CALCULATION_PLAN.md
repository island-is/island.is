# Calculator Slice Calculation — Implementation Plan

The file-level plan for building what `CALCULATION_ROADMAP.md` specifies. The
roadmap owns the rules and the decisions; this owns where the code goes. Read
the roadmap first — every rule referenced here is stated there in full.

Scope: first pass, functionality over design. The result area renders labels,
values and rows plainly. Styling refinement, focus management and layout
iteration are deliberately deferred.

## Starting state

Metadata rendering ships: config parsing, the `taxCalculator` query, contract
normalization, diagnostics, section and field rendering, chrome text, and the
`toTypedValue` coercion helper. The submit button is `<Button disabled>` wired
to nothing and there is no `<form>` element.

Verified before planning, so none of it is work:

- `taxCalculatorCalculate` is live and its types are in the generated web schema
- RSK is a plain public API, not X-Road; `RSK_CALCULATORS_BASE_URL` is wired in
  `apps/api/infra/api.ts` and all three chart envs
- `TaxCalculatorsModule` is registered in `apps/api/src/app/app.module.ts`
- The slice is registered at `SliceMachine.tsx` and wrapped in
  `dynamic(..., { ssr: false })`, so there are no SSR concerns
- The Contentful editor authors `outputSections`

No fragment or `richText.tsx` change: this work is entirely component-internal.

## Changes

| File                                                                                                                 | What & why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/screens/queries/TaxCalculators.ts`                                                                         | Add `GET_TAX_CALCULATOR_CALCULATION` (operation `GetTaxCalculatorCalculation`), selecting `calculation { type values { key type numberValue stringValue booleanValue arrayValue { values { … } } } }` and `errors { code key message }`. No aliases needed — unlike the metadata query, these are flat object types. `message` is for a dev-only log, never rendered                                                                                                                                     |
| — codegen                                                                                                            | `yarn nx run api:codegen/backend-schema` **then** `yarn nx run web:codegen/frontend-client`. `apps/api/src/api.graphql` is gitignored with no `dependsOn`, so skipping the first step surfaces as a type error in an untouched file                                                                                                                                                                                                                                                                      |
| `applicability.ts`                                                                                                   | NEW. Single owner of "is this field in play" and of the submit gate. `collectApplicableFields(config, contract, toggles, formValues)`, `isDependencyMet(...)`, `canSubmit(applicableFields, formValues)`. Five exclusions, mirroring every render-time omission: key absent from the contract, no authored label, dependency unmet, section's own toggle off, section gated closed — including `disableOnly`, which stays mounted and would otherwise submit                                             |
| `serialize.ts`                                                                                                       | NEW. `toInputFieldValues(applicableFields, formValues)`. Drops absent before coercing via `toTypedValue`, builds exactly one `@oneOf` member per row — a member present as `null` is rejected by coercion just as a second populated one is                                                                                                                                                                                                                                                              |
| `outputValues.ts`                                                                                                    | NEW. Normalizes the response into a `Map<string, OutputValue>` lookup, plus a row accessor. Rows may omit keys RSK returned nothing for, so the accessor tolerates a missing item key rather than assuming every row is the same shape                                                                                                                                                                                                                                                                   |
| `format.ts`                                                                                                          | NEW. Scalar formatter, parameter typed to the scalar output subset so `ARRAY` cannot reach it. Outer `type` switch closed with a `never` guard; the inner number-`semantic` switch ends in `default`, since an undefined semantic is a real case. Currency via the shared helper, percentage as whole percent + `%`, count grouped, year bare, month plain, boolean localized yes/no, date localized, string as-is. `LOCALE_TAG` is lifted out of `optionSources.ts` and exported rather than duplicated |
| `CalculatorResults.tsx`                                                                                              | NEW. Renders `config.outputSections` from the lookup: title, `MarkdownText` content, `accordion` variant, automatic dividers. Omits unlabelled rows, stale rows, rows with no value in the response, and sections left with nothing to show                                                                                                                                                                                                                                                              |
| `CalculatorOutputField.tsx`                                                                                          | NEW. One row: label + formatted value, `emphasis` variant, array rows in configured `itemFields` order. An array field with zero rows renders its label alone                                                                                                                                                                                                                                                                                                                                            |
| `Calculator.tsx`                                                                                                     | MODIFIED. Wraps the body in `<form onSubmit={handleSubmit(onSubmit)} noValidate>`. `useLazyQuery` with `fetchPolicy: 'network-only'`. Computes the applicable set once and passes it down. Holds the result and a `Map<string, string>` of field errors in local state, cleared on submit and whenever a memoized serialized-payload snapshot changes. `Button loading` in flight                                                                                                                        |
| `CalculatorField.tsx`                                                                                                | MODIFIED. Renders nothing when its field is not in the applicable set, replacing its own dependency `useWatch`. Accepts `error?: string`, forwarded to `InputController` / `SelectController` / `DatePickerController` via their explicit `error` prop, and to `Checkbox` via `hasError` / `errorMessage`                                                                                                                                                                                                |
| `CalculatorSection.tsx`                                                                                              | MODIFIED. Takes the applicable set and each field's error, and passes both down                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `text.ts`                                                                                                            | MODIFIED. `CHROME_TEXT` gains calculation-failure, empty-result and generic-validation copy (is/en)                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Calculator.spec.tsx`, `CalculatorField.spec.tsx`                                                                    | MODIFIED. Submit gating, errors preserving form state, loading state; the `error` prop and applicability-driven rendering                                                                                                                                                                                                                                                                                                                                                                                |
| `applicability.spec.ts`, `serialize.spec.ts`, `outputValues.spec.ts`, `format.spec.ts`, `CalculatorResults.spec.tsx` | NEW. The rest of the roadmap's Verification list                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Key decisions

- **Applicability is computed once, in `CalculatorForm`, and passed down.** The
  alternative — the field deciding its own visibility while the serializer
  decides the payload — lets a field render enabled and then be dropped from the
  request without the visitor knowing. One set, one answer.
- **Submit gating is computed, not declarative.** `required` on
  `InputController` reaches the native input only; validation comes from a
  separate `rules` prop, so `handleSubmit` would otherwise accept an empty
  required field.
- **Domain errors live in local state, not RHF.** They are not validation
  results, and every control reads an explicit error prop. No `setError`.
- **An error whose `key` names a field that is not rendered falls back to the
  result-area alert.** Boolean-keyed errors no longer need this: `Checkbox` has
  `hasError`/`errorMessage`, contrary to what the plan first claimed.
- **Error codes switch with a `never` guard.** Seven today; five validation codes
  collapse to one generic string, but an eighth must fail to compile.
- **The result clears off a serialized-payload snapshot**, not raw form values —
  `useWatch()` returns a fresh object per render, and toggles live outside form
  state yet change what would be submitted.
- **`fetchPolicy: 'network-only'`.** Pressing Calculate means calling RSK. The
  response carries no `id`, so the default policy would replay a cached errored
  response on retry.
- **Currency keeps ` kr.` in both locales**, and its flooring is accepted because
  RSK returns whole ISK.
- **`divider` on the output section schema stays ignored** — vestigial, never
  exposed by the editor. Dividers render automatically between sections.

## Deliberate non-goals

- **No live verification here.** The programmer runs it against RSK. Three things
  only that settles: the percentage output scale, month indexing, and which
  output fields RSK actually populates.
- **An ARRAY output configured with no `itemFields` is not warned.** The editor
  sees an empty section; that is acceptable.
- **No focus management, scroll-to-result or styling refinement.** Design
  iteration comes later.

## Gates

`nx test web` and `tsc`. `nx lint` cannot run in this worktree — a pre-existing
`ERR_REQUIRE_ESM` loading `eslint-plugin-storybook` fails before any rule
evaluates.

Two constraints on the specs: `apps/web/jest.config.ts` has no
`setupFilesAfterEnv`, so `@testing-library/jest-dom` matchers are unregistered
— use native ones. And do not assert on a rendered `input[type]` to tell
controls apart: `InputController type="number"` routes through `NumberFormat`
and emits no `type` at all.
