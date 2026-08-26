# pay-debts application

Application template for paying debts owed to the Icelandic state ("Greiðum ríkinu" / `ApplicationTypes.PAY_DEBTS`, slug `greidum-rikinu`). Institution: Fjársýsla ríkisins.

## Where things live

- `libs/application/templates/pay-debts` — frontend application template (this is the main folder for form/state-machine work)
- `libs/application/template-api-modules/src/lib/modules/templates/pay-debts` — backend `PayDebtsService`, dispatches template-api actions (e.g. `getCustomerDebts`). `pay-debts.service.spec.ts` is in sync with the service and the real `finance-v3` client shape (`DebtsDetailsDt`) — verified field-by-field.
- `libs/clients/finance-v3` — X-Road client (`FinanceClientV3Service`) calling Fjársýsla ríkisins' finance service; config in `financeV3.config.ts` (`XROAD_FINANCES_V3_PATH`). Local dev calls go through the X-Road proxy at `localhost:8081` (see `infra/src/dsl/xroad.ts`) — if it's not tunneled/running you'll see `ECONNREFUSED` on `getCustomerDebts`, not a code bug.
- `libs/application/ui-fields/src/lib/SelectableTableField` and `.../StickyFooterField` — two new, generic (not pay-debts-specific) field types built out for this template this session. See "Field architecture" below.

## State machine (`src/lib/template.ts`)

`prerequisites` → `draft` → `completed`. During `prerequisites`, `GetDebtsApi` (`src/dataProviders/index.ts`, action `getCustomerDebts`, namespace `PayDebts`) fetches the applicant's debts and stores them at `application.externalData.customerDebts.data.debts`.

## Main form (`src/forms/mainForm`)

`MainForm` = `[debtsSection, paymentSection]`. `overview.ts` (and `lib/messages/overview.ts`) still exist as files but are **not** wired into `MainForm` anymore — orphaned, not currently rendered.

- **`debtsSection.ts`** ("Skuldastaða") — a `buildSelectableTableField` (`id: 'selectedDebts'`, `dataTestId: 'debts-table'`) plus a `buildStickyFooterField` sibling:
  - `selectable: true` — one checkbox per row. Selection is stored **per row**, not as an index array: `application.answers.selectedDebts` is a `boolean[]` where `selectedDebts[rowIndex]` is that row's own checked state (changed from an earlier `number[]`-of-selected-indices design — see "Field architecture").
  - `inputColumn` — an amount-to-pay input in the last column, keyed at `application.answers.debtsToPay` (`string[]`, indexed by row). Only enabled for selected rows; disabled/blank for unselected ones. Selecting a row pre-fills its input with the full debt amount (`debt.debts`); deselecting clears it back to blank. Capped at the row's own debt amount via `getMaxAmount`.
  - `footerRow` — a totals row ("Heildarskuld" / summed `debt.debts` across *all* debts, not just selected), styled like a data row (no bottom border, bold total). Table is `table-layout: fixed` with a `minWidth` so it doesn't compress on narrow screens — horizontal scroll instead.
  - The sticky footer (`id: 'debtsSummaryFooter'`) shows two live totals — "Til greiðslu" (sum of `debtsToPay`) and "Eftirstöðvar" (total debts minus that) — that update on every keystroke/checkbox toggle, not just on autosave. It floats pinned to the bottom of the viewport while there's more of the table below the screen, and docks into normal flow right below the table's last row once you scroll (or if the table is short enough) that it would otherwise go below the page's own "Halda áfram" footer — it structurally can't overlap that button since docking just means falling back into normal document flow, which is already before it. Column text ("Til greiðslu"/amount) is aligned under the table's "Gjaldflokkur"/"Gjalddagi" columns via a hand-tuned CSS approximation, not exact measurement — see the css.ts comments if it ever needs retuning.
- **`paymentSection.ts`** — a plain read-only `buildStaticTableField` (no `selectable`/`inputColumn`, no `id` — that field type never stores an answer) showing only the *selected* debts (via `getSelectedDebts`), with a `summary` total row at the bottom.

## Field architecture (built out this session, not pay-debts-specific)

Three field types now exist where there used to be one. **`StaticTableField`/`StaticTableFormField`** (`libs/application/ui-fields/src/lib/StaticTableFormField/`) is back to *exactly* its shape on `main`: read-only, `id` always `''`, `doesNotRequireAnswer` always `true`. It's shared by 12+ other application templates repo-wide, untouched by this branch, and used here by `paymentSection.ts`.

The checkbox/input-column/footer-row functionality that got added to it mid-session was pulled back out into its own field, **`SelectableTableField`/`SelectableTableFormField`** (`libs/application/ui-fields/src/lib/SelectableTableField/`), because `selectable`/`doesNotRequireAnswer: !selectable`/settable `id` are fundamentally answer-bearing/interactive — the opposite of what "static" promises, and only `debtsSection.ts` uses it. Notable internals:
- `SelectableTableFormFieldRow.tsx` — each row is its own `memo`-wrapped component with a **value-based** prop comparator (not reference equality — `field.rows(application)` returns a fresh array every call, so reference equality would defeat the memo). Each row does its own `useWatch` on `selectedDebts[rowIndex]`, so toggling one checkbox only re-renders that row, not the whole table.
- The parent still re-renders on every toggle (it watches the aggregate `selectedDebts` path for the "select all" header checkbox), but `rows`/`footerRow`/`inputMaxAmounts` are `useMemo`'d on `[field.x, application]` — safe because `application` only changes reference on an autosave round-trip landing (`Screen.tsx`, from the `updateApplication` mutation response), not on every `setValue`/keystroke. Without this, checking N rows one at a time was `O(N²)` (each toggle re-derived data for every row); with it, it's `O(N)`.
- **Known, real scale limit**: a user with ~11,000 debts crashes the browser tab on open. This isn't fixable by the memoization above — that helps post-mount interaction, not the one-time cost of mounting ~11,000 `Checkbox` + `NumberFormat`-wrapped `Input` rows (~100k+ DOM nodes, ~33k live react-hook-form subscriptions — each `InputController`'s `Controller` sets up 2 of its own on top of the row's 1). Client-side pagination (island-ui's existing `Pagination` component, `pageSize` prop, no new dependency — precedented by `PaginatedSearchableTableFormField` in the same package) was prototyped and works, but was reverted at the user's request ("might add it later"). Virtualization was also discussed as an alternative (would need a new dependency, `@tanstack/react-virtual`, and reworking the table markup) but pagination was preferred. **This is not yet fixed on `main`/this branch** — large debt counts will still crash until one of these is reinstated.

**`StickyFooterField`/`StickyFooterFormField`** (`libs/application/ui-fields/src/lib/StickyFooterField/`) is fully generic — nothing in it references pay-debts. It takes `rows: {label, value}[]`, a required `widthReferenceTestId` (the `data-testid` of the element whose width/position it should track via `getBoundingClientRect()` + `ResizeObserver` + scroll listener, since it's `position: fixed` and otherwise has no layout relationship to that element), and a required `watchFieldIds: string[]` (narrows its `useWatch` subscription instead of watching the whole form — matters on a big form). **If `widthReferenceTestId` doesn't match a real `data-testid` in the DOM, the footer silently returns `null` forever** — this happened once already from a merge conflict dropping the line; if the footer "disappears," check this first.

## Utils (`src/utils`)

- `getDebts.ts` — reads `application.externalData.customerDebts.data.debts` (single source of truth, used by `debtsSection.ts` rows/footer/`getMaxAmount`/sticky-footer totals and by `getSelectedDebts.ts`)
- `getSelectedDebts.ts` — filters `getDebts()` by `answers.selectedDebts[index]` (a per-row `boolean[]`, not indices — see "Field architecture" above for why that changed)
- `types.ts` — `CustomerDebt` type: `{ chargeTypeId, chargeTypeName, chargeItemSubject, dueDate, finalDueDate, debts }`. The finance-v3 response also carries `timePeriod` and `payID`, not yet modeled on the frontend.
- `formatDate.ts`, `constants.ts` — unchanged utility helpers

## Messages (`src/lib/messages`)

One file per concern (`application`, `externalData`, `debts`, `payment`, `overview`, `error`), each re-exported from `index.ts`. All message `id`s are namespaced `pd.application:...`. `debts.table` includes `toPayLabel` ("Til greiðslu", table header), `totalDebtsLabel` ("Heildarskuld", `footerRow`), and — for the sticky footer specifically — `totalToPayLabel` ("Til greiðslu") and `totalLeftLabel` ("Eftirstöðvar"). `payment.summary.totalLabel` is the payment page's "Samtals" label.

## Known gaps / next steps

- **Large debt counts crash the page** — see the `SelectableTableField` scale-limit note above. The fix (pagination or virtualization) exists in prototype form but isn't currently applied.
- `dataSchema.ts` is still the scaffold dummy schema — no real validation yet for `selectedDebts`/`debtsToPay` (e.g. requiring at least one selected debt, or that a typed amount doesn't exceed/underflow the debt)
- No payment/charge submission is wired up yet. We explored routing `paymentSection.ts` through the shared `buildPaymentChargeOverviewField` (the pattern used by `transfer-of-vehicle-ownership`/`order-vehicle-license-plate`) but reverted it — that field prices items from a fixed `PaymentCatalogApi` catalog keyed by `chargeItemCode`, which doesn't fit per-citizen, variable debt amounts. Whatever charge-creation mechanism gets built here will need to actually charge the *typed* `debtsToPay` amounts, not a catalog price — the `payID` field on the raw finance-v3 response (not yet surfaced in `CustomerDebt`) may be relevant to how that's actually meant to work.
- `overview.ts`/`lib/messages/overview.ts` are dead code — either remove them or decide whether a review/overview step belongs back in `MainForm` before submit.
- No `states.COMPLETED`-side confirmation of what was actually paid yet.
