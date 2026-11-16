# pay-debts

Pays debts owed to the state, fetched from Fjársýsla ríkisins (FJS). The nx project is `pay-debts`. Settled product rules are in the README's `## Decisions`; read them before changing what is charged.

## The selection is paired with payIDs

`selectedDebts` is a per-row `boolean[]`. The table also saves each row's `payID` to `selectedDebtIds`, in the same order, and both are saved together on Continue. A refetch replaces the debt list in the database at once, so a row number from the answers may point at a different debt by the time it is read.

Read the selection only through `getSelectedDebts`. It matches each tick to its `payID` and drops ids the current list no longer holds.

## Payment runs on the debt rail

The PAYMENT state is written by hand, not with `buildPaymentState`: a debt has no FJS catalog item. `createDebtPayment` sends each selected `payID` and amount to services-payments (`POST /v1/payments/debts`), which validates with FJS and calls `payDebt` itself. Never refund a debt payment from the application; FJS has no reversal, so services-payments alone refunds. The flow is described in the README under `### Payment`.

## FJS data

- A debt with no due date arrives as `00010101` or `0001-01-01`. The second parses, so `formatDate` checks the year and returns `null`.
- Amounts arrive as `bigint`; `PayDebtsService` converts them with `Number()`.
- FJS never sends a debt of 0 kr. or less, so nothing filters them out.

## Shared fields built for this app

- `PaymentChargeOverviewFormField` serves 20+ templates. Keep the pay-debts props opt-in: `simplifiedList` takes an object so `preventAmountWrap` stays off elsewhere. `additionalSummaryLabel` and `getAdditionalSummaryAmount` are reserved for planned use.
- `StickyFooterField` renders nothing when `widthReferenceTestId` matches no `data-testid`. Check that first when the footer disappears.
