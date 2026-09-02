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

- **`debtsSection.ts`** ("Skuldastaða") — a `buildInteractiveTableField` (`id: 'selectedDebts'`, `dataTestId: 'debts-table'`) plus a `buildStickyFooterField` sibling:
  - `selectable: true` — one checkbox per row. Selection is stored **per row**, not as an index array: `application.answers.selectedDebts` is a `boolean[]` where `selectedDebts[rowIndex]` is that row's own checked state.
  - `inputColumn` — an amount-to-pay input in the last column, keyed at `application.answers.debtsToPay` (`string[]`, indexed by row). Only enabled for selected rows; disabled/blank for unselected ones. Selecting a row pre-fills its input with the full debt amount (`debt.debts`); deselecting clears it back to blank. Capped at the row's own debt amount via `getMaxAmount`.
  - `footerRow` — a totals row ("Heildarskuld" / summed `debt.debts` across _all_ debts, not just selected), styled like a data row (no bottom border, bold total). Table is `table-layout: fixed` with a `minWidth` so it doesn't compress on narrow screens — horizontal scroll instead.
  - The sticky footer (`id: 'debtsSummaryFooter'`) shows two live totals — "Til greiðslu" (sum of `debtsToPay`) and "Eftirstöðvar" (total debts minus that) — that update on every keystroke/checkbox toggle, not just on autosave. It floats pinned to the bottom of the viewport while there's more of the table below the screen, and docks into normal flow right below the table's last row once you scroll (or if the table is short enough) that it would otherwise go below the page's own "Halda áfram" footer — it structurally can't overlap that button since docking just means falling back into normal document flow, which is already before it. Column text ("Til greiðslu"/amount) is aligned under the table's "Gjaldflokkur"/"Gjalddagi" columns via a hand-tuned CSS approximation, not exact measurement — see the css.ts comments if it ever needs retuning.
- **`paymentSection.ts`** — a plain read-only `buildStaticTableField` (no `selectable`/`inputColumn`, no `id` — that field type never stores an answer) showing only the _selected_ debts (via `getSelectedDebts`), with a `summary` total row at the bottom.

## Field architecture

Three field types now exist where there used to be one. **`StaticTableField`/`StaticTableFormField`** (`libs/application/ui-fields/src/lib/StaticTableFormField/`) is back to _exactly_ its shape on `main`: read-only, `id` always `''`, `doesNotRequireAnswer` always `true`. It's shared by 12+ other application templates repo-wide, untouched by this branch, and used here by `paymentSection.ts`.

The checkbox/input-column/footer-row functionality that got added to it mid-session was pulled back out into its own field, **`SelectableTableField`/`SelectableTableFormField`** (`libs/application/ui-fields/src/lib/SelectableTableField/`), because `selectable`/`doesNotRequireAnswer: !selectable`/settable `id` are fundamentally answer-bearing/interactive — the opposite of what "static" promises, and only `debtsSection.ts` uses it. Notable internals:

- `SelectableTableFormFieldRow.tsx` — each row is its own `memo`-wrapped component with a **value-based** prop comparator (not reference equality — `field.rows(application)` returns a fresh array every call, so reference equality would defeat the memo). Each row does its own `useWatch` on `selectedDebts[rowIndex]`, so toggling one checkbox only re-renders that row, not the whole table.
- The parent still re-renders on every toggle (it watches the aggregate `selectedDebts` path for the "select all" header checkbox), but `rows`/`footerRow`/`inputMaxAmounts` are `useMemo`'d on `[field.x, application]` — safe because `application` only changes reference on an autosave round-trip landing (`Screen.tsx`, from the `updateApplication` mutation response), not on every `setValue`/keystroke. Without this, checking N rows one at a time was `O(N²)` (each toggle re-derived data for every row); with it, it's `O(N)`.
- **Known, real scale limit**: a user with ~11,000 debts crashes the browser tab on open. This isn't fixable by the memoization above — that helps post-mount interaction, not the one-time cost of mounting ~11,000 `Checkbox` + `NumberFormat`-wrapped `Input` rows (~100k+ DOM nodes, ~33k live react-hook-form subscriptions — each `InputController`'s `Controller` sets up 2 of its own on top of the row's 1). Client-side pagination (island-ui's existing `Pagination` component, `pageSize` prop, no new dependency — precedented by `PaginatedSearchableTableFormField` in the same package) was prototyped and works, but was reverted at the user's request ("might add it later"). Virtualization was also discussed as an alternative (would need a new dependency, `@tanstack/react-virtual`, and reworking the table markup) but pagination was preferred. **Still not fixed** — large debt counts will still crash until one of these is reinstated.

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

- **Large debt counts crash the page** — see the `InteractiveTableField` scale-limit note above. The fix (pagination or virtualization) exists in prototype form but isn't currently applied.
- `dataSchema.ts` is still the scaffold dummy schema — no real validation yet for `selectedDebts`/`debtsToPay` (e.g. requiring at least one selected debt, or that a typed amount doesn't exceed/underflow the debt)
- No payment/charge submission is wired up yet. We explored routing `paymentSection.ts` through the shared `buildPaymentChargeOverviewField` (the pattern used by `transfer-of-vehicle-ownership`/`order-vehicle-license-plate`) but reverted it — that field prices items from a fixed `PaymentCatalogApi` catalog keyed by `chargeItemCode`, which doesn't fit per-citizen, variable debt amounts. Whatever charge-creation mechanism gets built here will need to actually charge the _typed_ `debtsToPay` amounts, not a catalog price — the `payID` field on the raw finance-v3 response (not yet surfaced in `CustomerDebt`) may be relevant to how that's actually meant to work.
- `overview.ts`/`lib/messages/overview.ts` are dead code — either remove them or decide whether a review/overview step belongs back in `MainForm` before submit.
- No `states.COMPLETED`-side confirmation of what was actually paid yet.
