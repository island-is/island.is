# pay-debts application

Application template for paying debts owed to the Icelandic state ("Greiðum ríkinu" / `ApplicationTypes.PAY_DEBTS`, slug `greidum-rikinu`). Institution: Fjársýsla ríkisins.

## Where things live

- `libs/application/templates/pay-debts` — frontend template (main folder for form/state-machine work)
- `libs/application/template-api-modules/.../pay-debts` — backend `PayDebtsService` (`getCustomerDebts` action). No charge-creation/submission wiring yet. `pay-debts.service.spec.ts` is verified field-by-field against the real `finance-v3` shape (`DebtsDetailsDt`).
- `libs/clients/finance-v3` — X-Road client to Fjársýsla ríkisins. Local dev requires the X-Road proxy on `localhost:8081` (`infra/src/dsl/xroad.ts`) running/tunneled, or `getCustomerDebts` fails with `ECONNREFUSED` — not a code bug.
- `libs/application/ui-fields/.../InteractiveTableField`, `.../StickyFooterField` — generic (non-pay-debts-specific) field types. If you see `SelectableTableField` anywhere (old branches, docs), that's `InteractiveTableField`'s old name.
- `libs/application/templates/pay-debts/src/fields` — template-owned custom fields, currently just `DebtsLoader`. Must be exposed via `export const getFields = () => import('./fields/')` in `src/index.ts`, or a `buildCustomField` here resolves to nothing.

## State machine (`src/lib/template.ts`)

`draft` → `payment` → `completed`. No `prerequisites` state.

`States.DRAFT` is `initial`. `GetDebtsApi` (`src/dataProviders/index.ts`, action `getCustomerDebts`, namespace `PayDebts`) and `MockPaymentCatalog` are declared on the DRAFT applicant role's `api: []` allowlist — that's what authorizes the client-side fetch (`PUT /applications/:id/externalData` rejects any `actionId` not on the current state/role's list). Debts land at `application.externalData.customerDebts.data.debts`.

`payment` is `buildPaymentState` (`@island.is/application/utils`) targeting `States.COMPLETED`.

**Open behavioral question**: DRAFT is both `initial` and on `DefaultStateLifeCycle` (`pruneAfterDays(30)`), so an abandoned application persists as a listed draft on Mínar síður for 30 days just from opening the form. Options on the table: accept it, put DRAFT on `EphemeralStateLifeCycle`, or set `allowMultipleApplicationsInDraft: false`. Not yet decided.

## Main form (`src/forms/mainForm`)

`MainForm` = `[debtsSection, paymentSection]`.

- **`debtsSection.ts`** ("Skuldastaða") — one multiField, four children in order: a `buildCustomField` loader (`id: 'debtsLoader'`, `component: 'DebtsLoader'`, `doesNotRequireAnswer: true`), a `buildInteractiveTableField` (`id: 'selectedDebts'`, `dataTestId: 'debts-table'`), a `buildStickyFooterField`, and a `buildHiddenInput` (`id: 'shouldUseMockPayment'`, `defaultValue: true`, only on dev/local — `payment.service.createCharge` throws if set in production).
  - Table and sticky footer both carry `condition: debtsWereFetched` (`hasFetchedDebts(externalData)`), so they don't exist until the fetch lands; the loader occupies their spot until then. Order in the children array matters for this.
  - The loader is a **sibling** of the table, never a wrapper — the table must declare `id: 'selectedDebts'` / `inputColumn.id: 'debtsToPay'` itself for those answers to submit at all (see the answer-declaration constraint under "Field architecture"; a wrapped design silently dropped `debtsToPay` on submit).
  - `selectable: true` — per-row, not index-based: `answers.selectedDebts` is `boolean[]`, `selectedDebts[rowIndex]` is that row's own state.
  - `inputColumn` — amount-to-pay input, `answers.debtsToPay: string[]`, same indexing. Only enabled for selected rows. Selecting pre-fills the full debt amount (`debt.debts`); deselecting blanks it. Capped per-row via `getMaxAmount`.
  - `footerRow` — totals _all_ debts, not just selected. Table is `table-layout: fixed` with a `minWidth` (horizontal scroll instead of compressing).
  - `header` cells can be a plain `StaticText` or `{ label: StaticText; width?: number }`; first column uses the object form (`chargeTypeNameHeader`, width `200`).
  - Sticky footer (`id: 'debtsSummaryFooter'`) shows live "Til greiðslu" / "Eftirstöðvar" totals, updating on every keystroke/toggle. Pinned to viewport bottom while more table is below the fold; docks into normal flow once scrolled past (can't overlap the page's "Halda áfram" footer — docking is just falling back into document flow, already above it). Label/value alignment driven by `labelOffset`/`labelWidth` props (`debtsSection.ts` passes `56`/`200`) — see "Field architecture".
- **`paymentSection.ts`** — `buildPaymentChargeOverviewField` (`id: 'paymentChargeOverview'`, `simplifiedList: true`) then `buildSubmitField` (`id: 'submit'`). `getSelectedChargeItems` maps `getSelectedDebts(application)` into `{ chargeItemCode: debt.chargeTypeId, chargeItemName: debt.chargeTypeName, chargeItemAmount: debt.amountToPay }` — prices each item from the **typed** amount-to-pay, not a fixed catalog price. `getAdditionalSummaryAmount` computes `totalDebts - totalToPay`, rendered under `remainingLabel`.

## On-entry data fetching (`src/fields/DebtsLoader/index.tsx`)

Renders no UI once data is present (`return null`) — exists purely to fetch and own loading/error state.

- **Fetch** — `useMutation(UPDATE_APPLICATION_EXTERNAL_DATA)` with `dataProviders: [{ actionId: GetDebtsApi.actionId, order: 0 }, { actionId: MockPaymentCatalog.actionId, order: 0 }]`. `actionId` must be read off the `defineTemplateApi` objects the template's `api: []` lists — a hand-written string fails the allowlist check.
- **Committing the result** — `addExternalData(externalData)`, not `refetch()`. `refetch()` remounts the whole shell through `LoadingShell` (full-page spinner); `addExternalData` dispatches the existing `ADD_EXTERNAL_DATA` reducer action and merges in place. Required threading a new optional `addExternalData?: (data: ExternalData) => void` onto `FieldBaseProps` (see "Field architecture").
- **`onEntry` was rejected as the fetch site**: it runs inside `POST /applications`, awaited before navigation, so it can't host a loading state, and the create path ignores the `hasError` that `performActionOnApplication` returns — provider failures would be silent. Don't revisit without solving that.
- **StrictMode gotcha**: `<StrictMode>` double-mounts in dev, defeating a naive `useRef` guard and firing two concurrent mutations — two FJS calls racing on the same `externalData` column (read-modify-write, no row lock) produced `status: "failure"`. Guarded by a module-level `Map<applicationId, Promise>` of in-flight requests plus a module-level `Set` of ids fetched this session.
- **Re-fetch policy** — fetches on every fresh open; skips only if this session already fetched it _and_ `debtsAreStale()` is false (1h window off `externalData.customerDebts.date`).
- **Selection invalidation** — `selectedDebts`/`debtsToPay` are positional, so a changed debt list silently corrupts a selection. `debtsSignature()` compares old vs new; on change, both answers are cleared and a warning `AlertMessage` shown — rendered by the loader itself, not returned from `beforeSubmit`, since a `[false, message]` return is keyed by screen id (`Screen.tsx`) and no field on this screen reads it.
- **Submit race** — `setBeforeSubmitCallback` guard (`allowMultiple: true`, `customCallbackId: 'debtsRefreshGuard'`) awaits any in-flight request before letting "Halda áfram" through.
- **Loading/error UI** — `setFieldLoadingState?.(!hasDebts || hasError)` (the correct prop; `setSubmitButtonDisabled` is one-way and wrong here), `SkeletonLoader` placeholder, error `AlertMessage` with retry `Button`.

## Field architecture

**Two shell-level additions**, both in `libs/application` (not pay-debts-specific):

- `FieldBaseProps.addExternalData?: (data: ExternalData) => void` (`types/src/lib/Form.ts`), threaded from `ui-shell/src/components/Screen.tsx` through `FormMultiField.tsx`/`FormField.tsx`. Note `ADD_EXTERNAL_DATA` merges data but does **not** recompute `screens`/`sections` — a `condition` keyed on external data flips only on the next `ANSWER` dispatch, so the flip takes two commits (a single empty frame is possible).
- **Answer-declaration constraint** (`ui-shell/src/utils.ts`, `extractAnswersToSubmitFromScreen`): a multiField submits only ids declared on its own children, plus an interactive table's `inputColumn.id`. A custom field's `childInputIds` is honoured only when that custom field is the entire screen. Pinned by `debtsSection.spec.ts`.

Three field types:

- **`StaticTableField`** (`ui-fields/.../StaticTableFormField/`) — plain read-only, shared by 12+ other templates. Not used by pay-debts.
- **`InteractiveTableField`** (`ui-fields/.../InteractiveTableField/`, `FieldTypes.INTERACTIVE_TABLE`) — checkbox/input-column/footer-row field, pay-debts only. `InteractiveTableFormFieldRow.tsx` rows are `memo`-wrapped with a value-based (not reference) comparator, each watching only its own `selectedDebts[rowIndex]`. Parent still re-renders on every toggle (aggregate watch for "select all"), but `rows`/`footerRow`/`inputMaxAmounts` are memoized on `[field.x, application]`, safe because `application`'s reference only changes on an autosave landing, not per keystroke.
  - **Known unresolved bug**: ~11,000 debts crashes the tab on mount (mounting cost — ~100k+ DOM nodes, ~33k live react-hook-form subscriptions — not an interaction-perf issue the memoization above can fix). Pagination (island-ui's existing `Pagination`, precedented by `PaginatedSearchableTableFormField`) was prototyped and works but was reverted per request ("might add later") — the working approach exists in history, no need to re-prototype from scratch. Virtualization (`@tanstack/react-virtual`) was the alternative considered.
- **`StickyFooterField`** (`ui-fields/.../StickyFooterField/`) — fully generic. Takes `rows: {label, value}[]`, required `widthReferenceTestId` (tracked via `getBoundingClientRect()` + `ResizeObserver` + scroll listener, since it's `position: fixed`), required `watchFieldIds: string[]`, and `labelOffset`/`labelWidth`/`valueWidth` for alignment. **Gotcha**: if `widthReferenceTestId` doesn't match a real `data-testid`, it silently returns `null` forever — check this first if the footer "disappears" (has happened once, from a merge conflict).

## Utils (`src/utils`)

- `getDebts.ts` — reads `externalData.customerDebts.data.debts` (single source of truth). Also home of fetch-state helpers: `DEBTS_EXTERNAL_DATA_ID`, `DEBTS_MAX_AGE_MS` (1h), `hasFetchedDebts()`, `debtsAreStale()`, `getDebtsFromExternalData()` (raw `externalData`, pre-commit), `debtsSignature()`.
- `getSelectedDebts.ts` — filters by `answers.selectedDebts` (per-row `boolean[]`), returns `SelectedDebt[]` (`CustomerDebt & { amountToPay: number }`, falling back to `debt.debts` if the typed amount doesn't parse).
- `types.ts` — `CustomerDebt`: `{ chargeTypeId, chargeTypeName, chargeItemSubject, dueDate, finalDueDate, debts }`. finance-v3 also returns `timePeriod`/`payID`, not yet modeled on the frontend.
- `formatDate.ts`, `constants.ts` — utility helpers.

## Messages (`src/lib/messages`)

One file per concern — `application`, `debts`, `payment`, `error`, `completedForm` — re-exported from `index.ts`. All ids namespaced `pd.application:...`. `debts.fetch` covers the loader (`errorTitle`, `errorMessage`, `retryButton`, `refreshedTitle`, `refreshedMessage`). **Gotcha**: `payment.buttons.submit`'s message id is the leftover string `pd.application:overview.buttons.submit` — don't be thrown by the mismatch if you go looking for it.

## Tests

Run with `yarn nx test pay-debts` — nx project is `pay-debts`, not `application-templates-pay-debts`.

- `src/lib/template.spec.ts` — DRAFT is `initial`, no prerequisites state, DRAFT role's `api` contains both provider action ids
- `src/forms/mainForm/debtsSection.spec.ts` — declared answer ids, `debtsWereFetched` condition handoff, loader-before-table ordering. Needs `jest.mock('@island.is/application/ui-components', ...)` for `formatCurrency` (the real module pulls vanilla-extract in through island-ui/core — hence the `// eslint-disable-next-line import/first` on the import below it)
- `src/utils/getDebts.spec.ts` — `hasFetchedDebts`, `debtsAreStale`, `debtsSignature`

`tsconfig.spec.json` lacks `jsx`, so `npx tsc -p tsconfig.spec.json` reports pre-existing TS6142 errors on institution logos. Jest uses babel, so tests are unaffected — don't chase it.

## Known gaps / next steps

- Large debt counts crash the page (see `InteractiveTableField` above) — pagination/virtualization prototyped, not applied
- `dataSchema.ts` is still the scaffold — no real validation on `selectedDebts`/`debtsToPay`
- `paymentSection.ts` prices from the typed `debtsToPay` amount, but nothing in `template-api-modules/.../pay-debts` or `libs/clients/finance-v3` has changed to match — not confirmed whether backend charge creation/submission (and `payID`) actually consumes this end-to-end
- No `states.COMPLETED`-side confirmation of what was actually paid (alert text is static, no dynamic rendering)
- DRAFT lifecycle decision open — see State machine section
- `DebtsLoader`'s `wasReplaced` warning never resets once shown; `fetchDebts` depends on the whole `application` object rather than the fields it reads
- Hand-verification still outstanding: Greiðsluyfirlit shows the right selected debts/amounts, mock payment completes through to Staðfesting on local/dev, back-navigation keeps selections without re-fetching, whether the two-commit condition flip is a visible empty frame
