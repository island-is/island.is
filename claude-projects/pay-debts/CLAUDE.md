# pay-debts application

Paying debts owed to the Icelandic state ("Greiðum ríkinu" / `ApplicationTypes.PAY_DEBTS`, slug `greidum-rikinu`). Institution: Fjársýsla ríkisins.

## Where things live

- `libs/application/templates/pay-debts` — the template. nx project is **`pay-debts`**, not `application-templates-pay-debts`.
- `libs/application/template-api-modules/.../pay-debts` — `PayDebtsService`, one action: `getCustomerDebts`. Its spec is verified field-by-field against the real finance-v3 `DebtsDetailsDt`.
- `libs/clients/finance-v3` — X-Road client. Local dev needs the X-Road proxy on `localhost:8081` (`infra/src/dsl/xroad.ts`); without it `getCustomerDebts` fails with `ECONNREFUSED` — not a code bug.
- `libs/application/ui-fields/.../InteractiveTableField`, `.../StickyFooterField` — generic field types (formerly named `SelectableTableField`, if you hit that in old branches).
- `src/fields` — template-owned custom fields, just `DebtsLoader`. Must stay exported via `getFields` in `src/index.ts` or `buildCustomField` resolves to nothing.

## Answers shape

Both are **per-row arrays indexed by row**, not lists of selections:

- `answers.selectedDebts` — `boolean[]`, that row's checkbox.
- `answers.debtsToPay` — `string[]`, the amount typed for that row.

Row index is the index into `getDebts(application)`, so everything (pagination, `getSelectedDebts`, `getMaxAmount`) has to stay index-aligned with that list.

## State machine (`src/lib/template.ts`)

`draft` → `payment` → `completed`. No `prerequisites` state; `States.REVIEW` is declared but unused.

- `draft` is `initial` and on `EphemeralStateLifeCycle`, so merely opening the form doesn't leave a 30-day draft on Mínar síður.
- `GetDebtsApi` (action `getCustomerDebts`, namespace `PayDebts`) and `MockPaymentCatalog` are on the DRAFT applicant role's `api: []` allowlist — that is what authorizes the client-side fetch (`PUT /applications/:id/externalData` rejects any `actionId` not listed for the current state/role).
- `payment` is `buildPaymentState`, with `chargeItems` built from `getSelectedDebts`. **It uses `debt.chargeTypeId` as the charge code, which is a category (Gjaldflokkur), not the item-level `chargeItemCode` (Gjaldliður)** — see the TODO there. Blocked on FJS exposing the right code.
- `completed` loads `src/forms/completedForm` (conclusion section only), lifecycle `pruneAfterDays(30)` + `shouldBeListed: false`.

## Main form (`src/forms/mainForm`)

`MainForm` = `[debtsSection, paymentSection, empty completedSection]` (the last is a stepper placeholder).

**`debtsSection.ts`** — `DebtsLoader` + a `buildInteractiveTableField` (`id: 'selectedDebts'`, `dataTestId: 'debts-table'`) + a `buildStickyFooterField`, all under one multi-field. Table and footer are gated on `hasDebtsToPay` (fetched **and** non-empty), so an empty result leaves the loader's own message on screen.

- `selectable`, `pageSize: 50`, `inputColumn` (`id: 'debtsToPay'`, capped per row by `getMaxAmount`). Selecting a row pre-fills the full debt; deselecting clears it.
- `header` cells are objects carrying `width`/`truncate`/`expandable`/`tooltip` (the abbreviated "Gjaldgr." header uses `tooltip` to spell out "Gjaldgrunnur"). `expandedRows` gives each row a sub-table (Gjalddagi, Tímabil, Höfuðstóll, Vextir, Kostnaður), all from the real `principal`/`interest`/`cost` fields.
- `footerRow` totals **all** debts ("Heildarskuld"), not just selected. The sticky footer shows live "Til greiðslu"/"Eftirstöðvar" on every keystroke.
- `isSubmitDisabled` blocks submit until at least one row is ticked.
- `shouldUseMockPayment` is a hidden input, dev/local only.

**`paymentSection.ts`** — `buildPaymentChargeOverviewField` over `getSelectedDebts`. Its `chargeItemCode` is `chargeTypeId` suffixed with the index purely to keep React keys unique; it is display-only and unrelated to the charge actually created in `template.ts`.

## Field types (`libs/application/ui-fields`)

- **`StaticTableFormField`** — read-only, `id` always `''`. Shared by 12+ templates; not used here anymore.
- **`InteractiveTableField`** (`FieldTypes.INTERACTIVE_TABLE`) — checkboxes, input column, footer row, expandable sub-rows, client-side pagination. Rows are `memo`-wrapped with a **value-based** comparator (`field.rows()` returns a fresh array each call, so reference equality would defeat the memo), each watching only its own `selectedDebts[rowIndex]`. `rows`/`footerRow`/`inputMaxAmounts` are memoized on `[field.x, application]` — safe because `application`'s reference only changes on an autosave landing, not per keystroke. Pagination is what keeps large debt counts (~11k rows used to crash the tab) survivable; select-all still writes every row, not just the page.
  - Truncated cells are CSS-only (`text-overflow: ellipsis`), full text always in the DOM. Overflowing labels get a `HoverTooltip`; on the expandable column the tooltip anchors the toggle **button**, not the inner span, so it opens on `Tab` and the cell keeps one tab stop.
- **`StickyFooterField`** — `position: fixed`, floats while the table extends below the viewport and docks into normal flow otherwise (so it structurally can't overlap the page's own "Halda áfram"). Aligns itself by measuring `thead th[data-column-index="0"|"1"]` of `widthReferenceTestId`, with `labelOffset`/`labelWidth`/`valueWidth` as fallbacks. **Gotcha**: if `widthReferenceTestId` matches no real `data-testid` it silently renders `null` forever — check that first if the footer "disappears".

## Utils (`src/utils`)

- `getDebts.ts` — single source of truth, reads `externalData.customerDebts.data.debts`. Also `DEBTS_EXTERNAL_DATA_ID`, `DEBTS_MAX_AGE_MS` (1h), `hasFetchedDebts`, `debtsAreStale`, `getDebtsFromExternalData` (raw `externalData`, for pre-commit conditions), `debtsSignature`.
- `getSelectedDebts.ts` — ticked rows only, each `amountToPay` clamped to `[1, debt.debts]`, falling back to the full debt if the typed value doesn't parse.
- `types.ts` — `CustomerDebt`: `chargeTypeId`, `chargeTypeName`, `chargeItemSubject`, `timePeriod`, `dueDate`, `finalDueDate`, `principal`, `interest`, `cost`, `debts`. The backend also returns `payID` and `nextkey`, neither modeled on the frontend. Amounts arrive as `bigint` (int64) from the client and are `Number()`-ed in `PayDebtsService`. `timePeriod` is passed through exactly as FJS sends it.
- `formatDate.ts` — `YYYY-MM-DD` → `dd.MM.yyyy`, or `null` when there is no real date. **Gotcha**: FJS sends .NET's `DateTime.MinValue` for a debt with no gjalddagi/eindagi, as either `00010101` or `0001-01-01` — the second parses fine, so the year has to be checked as well as parseability. `debtsSection.ts` turns the `null` into the "Á ekki við" message.

## Messages (`src/lib/messages`)

One file per concern (`application`, `debts`, `payment`, `error`, `completedForm`), re-exported from `index.ts`, ids namespaced `pd.application:...`. **Gotcha**: `payment.buttons.submit`'s id is the leftover `pd.application:overview.buttons.submit`.

## Tests

`yarn nx test pay-debts` and `yarn nx test application-ui-fields`.

Coverage: state machine + api allowlist, `DebtsLoader` (empty result, submit gating), `debtsSection` (declared answers, fetch/empty/failure gating, column config, loader ordering), `getDebts` helpers, `getSelectedDebts` clamping, and on the field side pagination and the truncation/tooltip/keyboard behaviour.

- Specs that render (`DebtsLoader`, the field specs) mock `@island.is/localization`. `debtsSection.spec.ts` only inspects the field tree, so it needs no mock — `formatCurrency` comes from `@island.is/shared/utils`, which doesn't drag vanilla-extract in.
- jsdom reports `scrollWidth`/`clientWidth` as 0, so truncation tests stub them on `HTMLElement.prototype`.
- `tsconfig.spec.json` lacks `jsx`, so `tsc -p tsconfig.spec.json` reports pre-existing TS6142 on institution logos. Jest uses babel — don't chase it.

## Known gaps

- `dataSchema.ts` is still the scaffold dummy — no validation of `selectedDebts`/`debtsToPay` (clamping happens in `getSelectedDebts`, not the schema).
- Charge creation uses the wrong-granularity code (see `payment` above). The v3_2 spec answers this: `/payDebt` and `/validatePayment` take `payDebts: [{ payid, payAmount }]` — the per-debt `payID`, not a charge code. Both operations are generated (`payDebtPost3`, `validatePaymentPost4`) but nothing calls them yet, and `payID` still isn't carried to the frontend.
- FJS paginates with `nextkey`; the client only ever fetches the first page.
- Nothing on the `completed` side confirms what was actually paid.
