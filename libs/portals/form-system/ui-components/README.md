# portals-form-system-ui-components

This library was generated with [Nx](https://nx.dev).

## Field content

Fields store localized `informationText` above their inputs and localized
`tooltip` help text. `MESSAGE` uses `informationText` as its body instead of
rendering a second information block. Applicant fields do not display
`informationText` or `tooltip`, including previously saved tooltip content.
Large checkboxes store their localized
sublabel in `fieldSettings.subLabel`. Content is displayed only when the active
language contains non-whitespace text; no `hasDescription` flag is required.

Information text above inputs and message bodies support `<strong>` and `<em>`,
including nested formatting, while preserving line breaks. Other HTML tags and
all attributes are removed before rendering.

The editor preserves the `isLarge` checkbox and prevents disabling it while a
sublabel exists in either language. Information and tooltip editors are available
for their supported field types. Preview and live applications use the same
content rendering.
Checkbox and radio-option tooltip icons are separate buttons: opening help does
not change the selection or submit the form, including for large checkboxes.
The icon turns blue on hover and stays blue while its tooltip is visible.
Only checkbox squares and radio circles change selection when clicked; captions,
sublabels, and surrounding cards do not. Keyboard activation remains supported.
The PREMISES data-collection agreement uses this same interaction in both the
admin preview and live applications: only the checkbox square toggles agreement,
not the caption or surrounding card.

## Number validation

Number fields validate their configured value and digit-count limits. In live
applications, `allowProceedOnValidationFail` permits forward navigation despite
these errors, as it does for other inputs. Validation still runs, and the parties
section always requires valid input.

## Family fields

The FAMILY / CHILD table uses the National Registry V3 applications client
(MidlunUmsoknir), calling `GET /Einstaklingar/{kennitala}/forsjaUndir` for the
logged-in user through `formSystemCustodyChildren`. The existing client returns
child national IDs; names are fetched using its MidlunUmsoknir `/lite` lookup.
It lists children in the user's custody,
not biological children outside custody, and does not use `logforeldrar`.
There are no child-source settings. The returned list is cached on the field
for subsequent renders.
Child fields always display all custody children in a table with names, national IDs, and a
checkbox at the end of each row. Children are selected by default; saved
selections are restored, including an empty selection. Saving the screen
replaces the field's values with one name/national-ID value per selected child,
removing values for unchecked children. The summary shows only saved selected
children, with a separate name/national-ID block for each child using the
national-ID field layout rather than a table. It does not rely on the cached
registry list.
If a required child field has no selected children, its summary displays the
standard red "Vantar gildi" indicator. Optional empty selections display
"Engin börn valin." instead.
The obsolete child `isDropdown` setting is ignored and excluded from child
field settings; assets and payment fields still support it. Required child
fields show a black asterisk after the field name and require at least one
selected child. Optional fields permit an empty selection. Empty
lists and lookup failures are displayed explicitly. Lookup failures keep the
field name and table headers visible, with the error message inside the table
body, without overwriting selected values. Child fields use mock
children in preview without fetching or caching registry data.
In live applications, forward navigation is disabled while custody children
are loading, including for optional fields and when validation bypass is enabled.
Loading guards are cleared on success, failure, or leaving the field; backward
navigation remains available.

## Summary display

National-ID, family, and applicant summaries display the name above the national
ID, including each selected child.
Selected children sit directly below the field heading, with spacing retained
between children and no extra gap between each child's name and national ID.
National-ID fields also use no extra gap between name and national ID, while
retaining spacing before address details.

## Asset fields

Vehicle registration and property-number inputs use the full width on mobile.
Read-only asset details have spacing between rows when stacked, while retaining
their existing desktop column layout.

## Preview mock data

Edit [`src/lib/previewMockData.ts`](src/lib/previewMockData.ts) to maintain
sample data, grouped by field type and, where relevant, subtype. Field
components use this data only when `isPreview` is true, which is shared by the
admin inline preview and preview modal. To support another field type, add its
data to this file and consume it in that component's preview path instead of
requesting live data.

The CHILD mock includes two custody children. Preview mock lists ignore cached
real children and are not written to the field configuration.

Bank account fields do not request or prefill profile bank information in
preview, even when it is cached. When `fetchBankAccountFromMyPages` is enabled
(the default), they prefill the mock bank account instead. Saved values and
manual edits are preserved.

Pasting a complete account number such as `1111-11-111111` into any bank-account
input fills all three fields, preserving leading zeros. Pasting an individual
part keeps the normal single-field behavior.

On mobile, bank account fields show the bank and ledger inputs side by side,
with the account number on a separate row, slightly wider than the bank input.
Tablet and desktop layouts keep all three inputs on one row.

## Running unit tests

Run `yarn nx test portals-form-system-ui` to execute the unit tests via [Jest](https://jestjs.io).
