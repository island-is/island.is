# Aðgengisrýni — pay-debts (WCAG 2.1 AA)

Reviewed against the Ísland.is accessibility goals: blind, low-vision, dyslexic, motor-impaired,
elderly users who cannot use a mouse, and users on speech input / head-mouse / other
keyboard-emulating hardware.

Scope: the diff on `feat/pay-the-government-application` vs `main` — the pay-debts template plus
the new shared components it introduces (`InteractiveTableField`, `StickyFooterField`,
`HoverTooltip`, changes to `PaymentChargeOverviewFormField`, `AlertMessageFormField`,
`InputController`, `FinanceStatus`).

Verdict: the interaction _semantics_ are sound — real `<input type="checkbox">`, real `<button>`
with `aria-expanded`/`aria-controls`, no div-with-onClick anywhere, focus styles untouched. What is
missing is almost entirely **naming and announcement**: the controls have no accessible names, and
nothing on the screen is announced when it changes. Both groups are blocking for the two largest
audiences in the guidelines (screen-reader users and keyboard-only users).

---

## Blockers (WCAG level A — must fix before release)

### 1. No accessible name on any checkbox

`InteractiveTableFormField.tsx:226-230` (select-all) and `InteractiveTableFormFieldRow.tsx:244-248`
(per row) pass only `id`, `checked`, `onChange`. island-ui `Checkbox` supports both `label` and
`ariaLabel` (`Checkbox.tsx:13-14,118`); neither is used, so the rendered `<label>` is empty.

A screen reader announces "gátmerki, ómerkt" with no indication of which debt, 100 times over.
Speech-input users ("click Bifreiðagjald") have nothing to address.

WCAG 4.1.2 Name, Role, Value (A); 1.3.1 (A); 3.3.2 Labels or Instructions (A).

Fix: `ariaLabel` per row built from the row's charge type + amount ("Velja Bifreiðagjald, 45.000
kr."), and a real label for select-all ("Velja allar skuldir").

### 2. No accessible name on the amount input

`InteractiveTableFormFieldRow.tsx:295-307` renders `InputController` with no `label`. island-ui
`Input` only produces an accessible name via `<label htmlFor>` when `label` is set
(`Input.tsx:102-103`) and has **no `aria-label` passthrough at all**. The placeholder `kr.` is not
a name, and it is removed on focus (`Row.tsx:304`).

So this needs a component change, not just a prop: either add `aria-label` support to
`Input`/`InputController`, or render a visually-hidden `<label>`.

WCAG 4.1.2 (A); 3.3.2 (A).

### 3. Select-all never reports mixed state

`InteractiveTableFormField.tsx:126-132` only computes `allSelected`. With 3 of 10 debts selected the
header checkbox reports "ómerkt". island-ui `Checkbox` already supports `indeterminate`
(`Checkbox.tsx:16,86-90`).

WCAG 4.1.2 (A).

### 4. Column-header tooltips are mouse-only

`InteractiveTableFormField.tsx:252-257` anchors `HoverTooltip` on a bare `<span>`, and
`InteractiveTableFormFieldRow.tsx:87-101` (`TruncatedCell`) does the same.

Ariakit's `TooltipAnchor` adds **no `tabIndex`** and, with the default `type: "description"`, adds
**no `aria-describedby`** to the anchor — verified in
`node_modules/@ariakit/react-core/esm/tooltip/tooltip-anchor.js:110-120`, where `aria-labelledby` is
only set when `type === 'label'`. Consequences:

- keyboard-only / head-mouse / speech users cannot open the tooltip at all — WCAG 2.1.1 Keyboard (A)
- screen-reader users never hear it, even on the focusable `ExpandableCell` anchor — WCAG 4.1.2 (A)
- 1.4.13 Content on Hover or Focus (AA) cannot be satisfied for content that has no focus path

Fix belongs in `HoverTooltip` (it is a new shared island-ui component, so this propagates): give the
anchor `tabIndex={0}` when the child is not focusable, and wire `aria-describedby` to the tooltip's
id.

### 5. Submit is blocked with an empty error message

`DebtsLoader/index.tsx:177` — `return hasSelection() ? [true, null] : [false, '']`. The user presses
"Áfram í greiðslu", the submit is refused, and there is no message: nothing rendered, nothing
announced, no focus move. This is invisible to everyone, not only assistive-tech users.

WCAG 3.3.1 Error Identification (A).

### 6. No validation layer at all

`lib/dataSchema.ts` is still the scaffolding dummy (`dummy: { dummyTextField }`). Nothing validates
`selectedDebts`/`debtsToPay`, so no field-level error text exists anywhere in the flow. Combined
with #5 and #8 below, the screen has no error mechanism whatsoever.

WCAG 3.3.1 (A); 3.3.3 Error Suggestion (AA).

---

## Serious (WCAG level AA)

### 7. Nothing on the screen is announced when it changes

island-ui `AlertMessage` sets no `role="alert"` and no `aria-live` (verified — no role/aria in
`AlertMessage.tsx`), and `SkeletonLoader` has no aria either. So all four state changes in
`DebtsLoader/index.tsx:183-240` are silent:

- fetch error + retry button (`:183-202`)
- loading skeleton (`:204-216`) — no `aria-busy`, no "sæki skuldastöðu" status text
- "Engar skuldir fundust" (`:218-228`)
- **"Skuldastaðan var uppfærð"** (`:230-240`) — the worst one: the user's entire selection was just
  wiped (`:116-121`) and a blind user has no way to know

WCAG 4.1.3 Status Messages (AA). Fix: `role="status"` / `aria-live="polite"` wrapper (`role="alert"`
for the error and the wiped-selection warning), plus moving focus to the retry button on error.

### 8. Live totals are never announced

`StickyFooterFormField.tsx:145-181` recomputes "Samtals til greiðslu" and "Eftirstöðvar skuldar" on
every keystroke and every checkbox toggle. It is the primary feedback mechanism for the whole
screen, and it is not a live region.

WCAG 4.1.3 (AA). Fix: `aria-live="polite"` on the footer container (debounced), and ideally expose
`ariaLive` on `StickyFooterField` rather than hard-coding it.

### 9. Out-of-range amounts are rejected silently

`InputController.tsx:150-157` — `isAllowed` drops keystrokes above `max` (the debt amount). The
character simply never appears. Nothing is announced, no error text, no explanation of the limit.
Users with cognitive/dyslexic profiles read this as a broken field.

WCAG 3.3.1 (A); 3.3.3 (AA). Fix: state the maximum in the field's description/`aria-describedby`,
and prefer a validated error over silent truncation.

### 10. A row silently unchecks itself on blur

`InteractiveTableFormFieldRow.tsx:285-293` — leaving the amount empty unchecks the debt. A state
change the user did not request, with no announcement. Tabbing through the table can therefore
clear selections without the user knowing.

WCAG 3.2.2 On Input (A); 4.1.3 (AA).

### 11. Disabled "Áfram í greiðslu" with no reason

`debtsSection.ts:97` disables the next button until something is selected
(`InteractiveTableFormField.tsx:144-147` → `ScreenFooter.tsx:115`). Nothing programmatically
explains why, and a disabled button is skipped in the tab order, so a keyboard user cannot even
land on it to investigate.

WCAG 3.3.1 (A) / 3.3.3 (AA). Preferred fix: keep it enabled and fail with a real, announced error.

### 12. Fixed footer can cover content at high zoom

`StickyFooterFormField.tsx:126-131` positions the footer `fixed` at the bottom. At 200–400% zoom
(WCAG 1.4.4 AA / 1.4.10 AA) it occupies a large share of the viewport and overlays the table with no
reserved space. The 700px-min-width table itself is exempt from Reflow (data tables are), but the
footer is not.

### 13. Table has no accessible name and no row headers

- No `<caption>` and no `aria-labelledby`; the title is a detached `<Text>`
  (`InteractiveTableFormField.tsx:192-201`) and defaults to `''` anyway.
- Every body cell is `<td>` — the first column should be `<th scope="row">`, and header cells should
  carry `scope="col"` (island-ui `HeadData` forwards props, so `scope` can just be passed).
  Without row headers, a screen reader reading the checkbox or amount cell cannot recover which debt
  it belongs to — this is the same gap as #1, from the table-semantics side.
- The checkbox column's `<th>` is empty (`:221-231`) — fixed as a side effect of #1.
- The footer row sits in `<tbody>` (`:285-303`) although island-ui exposes `T.Foot`/`<tfoot>`.

WCAG 1.3.1 Info and Relationships (A).

### 14. `!important` px font size

`PaymentChargeOverviewFormField.css.ts:3-5` — `fontSize: '14px !important'` overrides the theme's
rem-based scale and blocks user stylesheets. Browser zoom still works, but a user who raises the
_default font size_ gets nothing. It also renders an `<h4>` at 14px, so heading semantics no longer
match the visual hierarchy.

WCAG 1.4.4 (AA) / 1.4.12 Text Spacing (AA) risk.

---

## Recommendations (below AA, or robustness)

- **Nested table in a `<td>`** (`InteractiveTableFormFieldExpandedRow.tsx:23-50`) — legal, but table
  navigation commands get confusing, and the inner table also carries `minWidth: 700`. A
  definition-list style layout per detail row would read better; at minimum give it a caption.
- **Scroll container not keyboard-focusable** — island-ui `Table` wraps the table in an
  `overflow: auto` div (`Table.tsx:31`) with no `tabIndex={0}`/`role="region"`/`aria-label`, while
  the CSS forces `minWidth: 700` (`InteractiveTableFormField.css.ts:4-12`). Tabbing into the inputs
  does scroll it, so this is partially mitigated — still the standard WCAG 2.1.1 technique.
- **Truncated cells** (`css.ts:47-53`) — the full text _is_ in the DOM, so screen readers are fine;
  the loss falls on sighted keyboard, low-vision and dyslexic users, who cannot reveal it without a
  mouse. Fixing #4 resolves this.
- **No `prefers-reduced-motion` guard** on the 300 ms expand (`Row.tsx:323-331`). 2.3.3 is AAA and
  300 ms is short — low priority, but cheap.
- **New tab without warning** — `FinanceStatus.tsx:113-129` opens `/umsoknir/greidum-rikinu/` with
  `target="_blank"` and no cue. Consistent with the sibling schedule button, so this is a
  consistency question rather than a regression (3.2.5 is AAA).
- **Tooltip translucency** — `HoverTooltip.css.ts:6-9` uses `opacity: 0.8`, so underlying table text
  bleeds through the tooltip. Contrast of white on `dark400` composited over white measures 11.7:1,
  well past 4.5:1, but over dense text the effective background is mottled. Consider full opacity.
- **No automated a11y checks** — there is no `jest-axe` anywhere in the new components, though unit
  tests exist (`InteractiveTableFormField.spec.tsx`, `InteractiveTableFormFieldRow.spec.tsx`,
  `HoverTooltip.spec.tsx`, `DebtsLoader/index.spec.tsx`). Axe would have caught #1, #3, #4 and #13
  automatically.

---

## API-level gap (do this first)

`InteractiveTableField` and `StickyFooterField` (`Fields.ts:1028-1075`) expose **no** way for a
consumer to supply accessible names or announcements: no per-row label, no checkbox/input label, no
caption, no live-region option. `buildInteractiveTableField`/`buildStickyFooterField`
(`fieldBuilders.ts:1137-1245`) mirror that.

These are new _shared_ field types that other teams will reuse, so patching names into the pay-debts
template only would leave the next consumer with the same failures. The accessible-name hooks should
land in the type + builder:

```ts
inputColumn?: {
  ...
  getAriaLabels?: (application: Application) => StaticText[]
}
selectable?: boolean
getRowAriaLabels?: (application: Application) => StaticText[]
caption?: StaticText
selectAllLabel?: StaticText
```

---

## What is already right

- Real form controls throughout — `<input type="checkbox">`, `<button>`, `<input>`; no
  div-with-onClick, so keyboard operation and focus order come for free.
- The expand toggle is exemplary: `aria-expanded` + `aria-controls` pointing at a `useId()`-generated
  id, on a real `<button>` (`Row.tsx:112-128`).
- Collapsed detail rows are `aria-hidden` and their content is not rendered, so no hidden focus traps
  (`Row.tsx:312,333`).
- Focus styles are not overridden anywhere in the new CSS.
- Tooltip colour contrast passes comfortably (11.7:1 measured).
- `min={1}` plus auto-filling the max amount on selection means the common path needs no typing.
