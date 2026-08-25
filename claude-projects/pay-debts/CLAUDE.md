# pay-debts application

Application template for paying debts owed to the Icelandic state ("Greiðum ríkinu" / `ApplicationTypes.PAY_DEBTS`, slug `greidum-rikinu`). Institution: Fjársýsla ríkisins.

## Where things live

- `libs/application/templates/pay-debts` — frontend application template (this is the main folder for form/state-machine work)
- `libs/application/template-api-modules/src/lib/modules/templates/pay-debts` — backend `PayDebtsService`, dispatches template-api actions (e.g. `getCustomerDebts`)
- `libs/clients/finance-v3` — X-Road client (`FinanceClientV3Service`) calling Fjársýsla ríkisins' finance service; config in `financeV3.config.ts` (`XROAD_FINANCES_V3_PATH`). Local dev calls go through the X-Road proxy at `localhost:8081` (see `infra/src/dsl/xroad.ts`) — if it's not tunneled/running you'll see `ECONNREFUSED` on `getCustomerDebts`, not a code bug.

## State machine (`src/lib/template.ts`)

`prerequisites` → `draft` → `completed`. During `prerequisites`, `GetDebtsApi` (`src/dataProviders/index.ts`, action `getCustomerDebts`, namespace `PayDebts`) fetches the applicant's debts and stores them at `application.externalData.customerDebts.data.debts`.

## Main form (`src/forms/mainForm`)

`MainForm` = `[debtsSection, paymentSection]`. `overview.ts` (and `lib/messages/overview.ts`) still exist as files but are **not** wired into `MainForm` anymore — orphaned, not currently rendered.

- **`debtsSection.ts`** ("Skuldastaða") — a real, working `buildStaticTableField`:
  - `selectable: true` — checkboxes per row, selected row indices stored at `application.answers.selectedDebts` (`number[]`).
  - `inputColumn` — an amount-to-pay input in the last column, keyed at `application.answers.debtsToPay` (`string[]`, indexed by row). Only enabled for selected rows; disabled/blank for unselected ones. Selecting a row pre-fills its input with the full debt amount (`debt.debts`); deselecting clears it back to blank. Capped at the row's own debt amount via `getMaxAmount`.
  - `footerRow` — a totals row ("Heildarskuld" / summed `debt.debts` across *all* debts, not just selected), styled like a data row (no bottom border, bold total).
  - Table is `table-layout: fixed` with a `minWidth` so it doesn't compress on narrow screens — horizontal scroll instead (see below).
- **`paymentSection.ts`** — a read-only summary `buildStaticTableField` (no `selectable`/`inputColumn`) showing only the *selected* debts (via `getSelectedDebts`), with a `summary` total row at the bottom.

`inputColumn` and `footerRow` are **new, generic capabilities added to the shared `buildStaticTableField`/`StaticTableFormField`** this session (`libs/application/types/src/lib/Fields.ts`, `libs/application/core/src/lib/fieldBuilders.ts`, `libs/application/ui-fields/src/lib/StaticTableFormField/`) — not pay-debts-specific hacks. They're opt-in (only `debtsSection.ts` currently sets them), and their styling lives in a co-located `StaticTableFormField.css.ts` scoped via a `tableWrapper` class so no other table using `buildStaticTableField` is affected.

## Utils (`src/utils`)

- `getDebts.ts` — reads `application.externalData.customerDebts.data.debts` (single source of truth, used by `debtsSection.ts` rows/footer/`getMaxAmount` and by `getSelectedDebts.ts`)
- `getSelectedDebts.ts` — maps `answers.selectedDebts` (indices) back to full `CustomerDebt` objects via `getDebts`
- `types.ts` — `CustomerDebt` type: `{ chargeTypeId, chargeTypeName, dueDate, finalDueDate, debts }`. `chargeTypeId` mirrors a real field the backend (`pay-debts.service.ts`) already returns from finance-v3 (along with `chargeItemSubject`, `timePeriod`, `payID`, not yet modeled on the frontend) — the finance-v3 response also carries fields this type doesn't use yet
- `formatDate.ts`, `constants.ts` — unchanged utility helpers

## Messages (`src/lib/messages`)

One file per concern (`application`, `externalData`, `debts`, `payment`, `overview`, `error`), each re-exported from `index.ts`. All message `id`s are namespaced `pd.application:...`. `debts.table` now includes `toPayLabel` ("Til greiðslu") and `totalDebtsLabel` ("Heildarskuld"); `payment.summary.totalLabel` is the payment page's "Samtals" label.

## Known gaps / next steps

- `dataSchema.ts` is still the scaffold dummy schema — no real validation yet for `selectedDebts`/`debtsToPay` (e.g. requiring at least one selected debt, or that a typed amount doesn't exceed/underflow the debt)
- No payment/charge submission is wired up yet. We explored routing `paymentSection.ts` through the shared `buildPaymentChargeOverviewField` (the pattern used by `transfer-of-vehicle-ownership`/`order-vehicle-license-plate`) but reverted it — that field prices items from a fixed `PaymentCatalogApi` catalog keyed by `chargeItemCode`, which doesn't fit per-citizen, variable debt amounts. Whatever charge-creation mechanism gets built here will need to actually charge the *typed* `debtsToPay` amounts, not a catalog price — the `payID` field on the raw finance-v3 response (not yet surfaced in `CustomerDebt`) may be relevant to how that's actually meant to work.
- `overview.ts`/`lib/messages/overview.ts` are dead code — either remove them or decide whether a review/overview step belongs back in `MainForm` before submit.
- No `states.COMPLETED`-side confirmation of what was actually paid yet.
