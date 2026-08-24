# pay-debts application

Application template for paying debts owed to the Icelandic state ("Greiðum ríkinu" / `ApplicationTypes.PAY_DEBTS`, slug `greidum-rikinu`). Institution: Fjársýsla ríkisins.

## Where things live

- `libs/application/templates/pay-debts` — frontend application template (this is the main folder for form/state-machine work)
- `libs/application/template-api-modules/src/lib/modules/templates/pay-debts` — backend `PayDebtsService`, dispatches template-api actions (e.g. `getCustomerDebts`)
- `libs/clients/finance-v3` — X-Road client (`FinanceClientV3Service`) calling Fjársýsla ríkisins' finance service; config in `financeV3.config.ts` (`XROAD_FINANCES_V3_PATH`)

## State machine (`src/lib/template.ts`)

`prerequisites` → `draft` → `completed`. During `prerequisites`, `GetDebtsApi` (`src/dataProviders/index.ts`, action `getCustomerDebts`, namespace `PayDebts`) fetches the applicant's debts and stores them at `application.externalData.customerDebts.data.debts`.

## Main form (`src/forms/mainForm`)

- `debtsSection.ts` — "Skuldastaða" section, meant to show the fetched debts in a table
- `paymentSection.ts` — payment method selection
- `overview.ts` — final review + submit

Both `debtsSection.ts` and `paymentSection.ts` still have scaffold placeholder fields (`buildTextField`/`buildRadioField` with dummy options) — not yet real functionality.

## Messages (`src/lib/messages`)

One file per concern (`application`, `externalData`, `debts`, `payment`, `overview`, `error`), each re-exported from `index.ts`. All message `id`s are namespaced `pd.application:...` (matches `ApplicationConfigurations.PayDebts.translation`). Follow the existing grouping convention (`general` for section/page titles, one `defineMessages` group per field/concern) when adding new strings — see `secondary-school`'s `lib/messages` for the fullest reference example in the app-templates codebase.

## Known gaps / next steps

- `dataSchema.ts` is still the scaffold dummy schema — needs real answer validation once fields are built out
- Debts table on the "Skuldastaða" page needs to actually render `customerDebts` data (columns: Gjaldflokkur, Gjalddagi, Eindagi, Skuldastaða) — built-in `buildStaticTableField` has no row-selection support, so a custom field (`buildCustomField`) would be needed if per-row/select-all checkboxes are required
