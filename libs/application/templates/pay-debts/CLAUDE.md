# pay-debts

Pays debts owed to the state, fetched from Fjársýsla ríkisins (FJS). The nx project is `pay-debts`. Settled product rules are in the README's `## Decisions`; read them before changing what is charged.

## The selection is paired with payIDs

`selectedDebts` is a per-row `boolean[]`. The table also saves each row's `payID` to `selectedDebtIds`, in the same order, and both are saved together on Continue. A refetch replaces the debt list in the database at once, so a row number from the answers may point at a different debt by the time it is read.

Read the selection only through `getSelectedDebts`. It matches each tick to its `payID` and drops ids the current list no longer holds.

## The charge code is a known gap

`template.ts` sends `debt.chargeTypeId` as the charge code. That is a charge category (Gjaldflokkur), not the item code (Gjaldliður) FJS expects; see the TODO there. FJS's own `/payDebt` takes `payDebts: [{ payid, payAmount }]`, answers 202 on success and is not called yet.

## FJS data

- A debt with no due date arrives as `00010101` or `0001-01-01`. The second parses, so `formatDate` checks the year and returns `null`.
- Amounts arrive as `bigint`; `PayDebtsService` converts them with `Number()`.

## Shared fields built for this app

- `PaymentChargeOverviewFormField` serves 20+ templates. Keep the pay-debts props opt-in: `simplifiedList` takes an object so `preventAmountWrap` stays off elsewhere. `additionalSummaryLabel` and `getAdditionalSummaryAmount` are reserved for planned use.
- `StickyFooterField` renders nothing when `widthReferenceTestId` matches no `data-testid`. Check that first when the footer disappears.
