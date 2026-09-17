# Aðgengisúttekt — pay-debts

Dags. 2026-09-10 · grein `feat/pay-the-government-application` · viðmið WCAG 2.2 AA

**Status:** the three level A failures (B1–B3) are fixed and verified; M1 fell
out with them. S2 (indeterminate select-all) is also fixed. Everything else is
open. Line references below match the working
tree as of this revision.

Two passes were run:

1. **Source audit** of the `pay-debts` template and the field components it
   renders (`InteractiveTableField`, `StickyFooterField`).
2. **Runtime audit** — axe-core 4.10.3 in real Chromium (Playwright), against a
   throwaway Vite harness that mounted the actual `InteractiveTableFormField`
   and `StickyFooterFormField` with the exact `debtsSection.ts` configuration
   and 40 debts, so the sticky footer genuinely floats. Chrome's own
   accessibility tree supplied the computed names. Plus a jsdom/axe pass inside
   the existing `application-ui-fields` jest project.

The harness and the temporary axe specs were deleted afterwards. The audit
itself changed nothing in the repo; the subsequent **fix** for B1–B3 did — see
`tasks/todo.md` for that change list.

axe over the rendered screen, identical in all three states (collapsed,
expanded, row selected):

| rule | impact | tags | before | after |
| --- | --- | --- | --- | --- |
| `label` | critical | wcag2a, wcag412 | 4 | **0** |
| `empty-table-header` | minor | best-practice | 1 | **0** |
| `color-contrast` | — | — | 0 | 0 |

Zero `incomplete` results in either run. Everything below the blockers is
something axe cannot see.

**Relationship to `tasks/pay-debts-accessibility-review.md`** — that earlier
source-level review (WCAG 2.1 AA) covers the same screen and reached the same
three naming blockers. This document adds measured runtime evidence and
supersedes it on two points:

- Its finding #4 ("column-header tooltips are mouse-only", claimed as a 2.1.1
  Keyboard level A failure) is **not reproducible**. Ariakit's `Focusable`
  does set `tabIndex: 0` on non-tabbable anchors
  (`@ariakit/react-core/cjs/__chunks/PDQXLIRF.cjs:115`), and in Chromium the
  truncated cell is a real tab stop whose tooltip opens on keyboard focus with
  text matching the cell. The repo's own
  `InteractiveTableFormFieldRow.spec.tsx` already asserts this. Only the
  `aria-describedby` half of that finding stands, and it costs nothing because
  the full text is in the DOM regardless.
- It does not cover S1 (focus landing fully hidden behind the sticky footer),
  which only appears with a realistic debt list.

Conversely, it carries two items this audit missed and one that is not a defect:

- The absent validation layer (`dataSchema.ts` is still the scaffold dummy —
  3.3.1) and `fontSize: '14px !important'` in
  `PaymentChargeOverviewFormField.css.ts` remain open.
- Its finding #10, "a row silently unchecks itself on blur", is **intended
  behaviour, confirmed 2026-09-10** — clearing the amount is how the user says
  "I am not paying this one now", so unchecking the row is the correct response,
  not an unrequested state change. Do not "fix" it. If anything is owed here it
  is only announcing the change (4.1.3), which belongs with the live-region work
  in S3/S6.

Scope note: the blockers lived in `libs/application/ui-fields` and
`libs/island-ui/core`, not in the template. They were written for this feature
but the components are shared, so fixing them there fixed every future consumer.

---

## Blockers — level A — **FIXED 2026-09-10**

All three were the same defect: a control rendered with no accessible name
(4.1.2). Verified fixed by axe (0 `label` violations) and by re-measuring the
computed names.

- [x] **B1. Row checkboxes had no accessible name**
  `InteractiveTableFormFieldRow.tsx:251` passed neither `label` nor `ariaLabel`,
  and `libs/island-ui/core/src/lib/Checkbox/Checkbox.tsx:124` renders
  `<label htmlFor>` containing only the visual box. Chrome reported
  `role: checkbox, name: ""` for every row — "checkbox, not checked" and nothing
  else, on the screen whose entire purpose is choosing which debts to pay.
  **Done:** `ariaLabel={rowLabel}`, where `rowLabel` is the row's own formatted
  cells joined with ", ". Derived rather than configured, so no new translatable
  string per consumer.

- [x] **B2. Select-all checkbox had no accessible name**
  `InteractiveTableFormField.tsx:238`. Same cause, same measured result.
  **Done:** `ariaLabel` from the new `coreMessages.interactiveTableSelectAll`
  ("Velja allar línur") — the one label with no row content to derive from.

- [x] **B3. Amount input was named "kr.", and nameless while you typed**
  `InteractiveTableFormFieldRow.tsx:303` passed no `label`, and
  `libs/island-ui/core/src/lib/Input/Input.tsx:79` renders a `<label>` only when
  `label` is truthy, with no `aria-label` fallback. The only thing serving as a
  name was `placeholder="kr."` — and line 315 removes even that on focus
  (`placeholder={focused ? undefined : inputPlaceholder}`). Chrome reported
  `name: "kr."` blurred and `name: ""` focused. This is why axe found 4 `label`
  violations and not 7: axe accepts a non-empty placeholder as a label.
  **Done:** added an `ariaLabel` prop to `Input` (`types.ts`, applied as
  `aria-label`) and to `InputController` (forwarded in all three
  `renderChildInput` branches), then set it per row to
  `"{column label}: {rowLabel}"`.

- [x] **M1. Empty table header** — fixed as a side effect of B2: the `<th>` at
  `InteractiveTableFormField.tsx:233` now has accessible text through the
  labelled checkbox inside it, and axe no longer reports the rule.

Measured names now:

| control | before | after |
| --- | --- | --- |
| select-all | `""` | `"Velja allar línur"` |
| row checkbox | `""` | `"Þungaskattur af bifreiðum, 453-78857-53, 31.08.2025, 565.990 kr."` |
| amount input | `"kr."` (`""` focused) | `"Til greiðslu: Þungaskattur af bifreiðum, …"` |

---

## Open — confirmed AA failures

- [ ] **S1. Keyboard focus lands completely hidden behind the sticky footer**
  `StickyFooterFormField.tsx:107` renders `position: fixed; bottom` with no
  compensating bottom padding, and nothing scrolls the focused element clear.
  **Measured** at 1280×800 with 40 debts: the footer floats at y 688–784
  (96 px tall). Tabbing through the table, **stops 19 and 20 land at y 731–755
  and 727–758 — entirely inside the footer's rectangle**. Chrome's Tab
  auto-scroll brings them into the viewport; it knows nothing about the fixed
  overlay. 2–3 interactive rows sit behind the footer at any scroll position.
  A clean **2.4.11 Focus Not Obscured (Minimum), AA** failure.
  Preferred fix: have the footer publish its measured height as a
  `--sticky-footer-height` custom property while floating, and set
  `scroll-padding-bottom` on the scroller from it. `scroll-padding` shrinks the
  scrollport's optimal viewing region, so the browser's own scroll-into-view
  stops treating the covered band as visible — it fixes Tab, `scrollIntoView`,
  anchors and find-in-page alike, and cannot oscillate against the footer's rAF
  reposition loop the way an explicit `scrollBy` on `focusin` could.
  Needs one check first: whether Chrome scrolls at all for an element that is
  inside the viewport but inside the padding band. Fallbacks, in order:
  `scroll-margin-bottom` on the focusables; an explicit `focusin` handler; or
  reserving layout space with bottom padding.

- [x] **S2. Select-all never showed the indeterminate state** — **FIXED**
  `InteractiveTableFormField.tsx` bound only `checked={allSelected}`, so every
  partial selection rendered and announced as *unchecked* — indistinguishable
  from "nothing selected", which with 40 rows is the only at-a-glance summary
  the user has. Before, with 1 of 40 selected: `checked: false`,
  `indeterminate: false`, `aria-checked: null`, AX tree `checkbox,
  checked: false` (4.1.2).
  **Done:** added `someSelected` and passed `indeterminate={someSelected}`
  alongside the existing `checked={allSelected}`; `Checkbox` already implemented
  the state (`Checkbox.tsx:17`, white dash at `Checkbox.css.ts:121`).
  **Verified in Chrome** — the three states now report:

  | rows selected | `checked` | `indeterminate` | AX tree |
  | --- | --- | --- | --- |
  | none | false | false | `checked: false` |
  | partial | false | **true** | **`checked: "mixed"`** |
  | all | true | false | `checked: true` |

  Precedent for the pattern in this repo:
  `directorate-of-equality/salary-report/.../outlierColumns.tsx:152-158` (a
  header checkbox over a selectable table) and
  `portals/shared-modules/delegations/.../ScopesCategoriesList.tsx:58`.

- [ ] **S3. Sticky-footer label is clipped at 320 px**
  `StickyFooterFormField.tsx:127` sets `truncate` on the label `Text`.
  **Measured** at 320×512: "Samtals til greiðslu" has `scrollWidth 125` against
  `clientWidth 107` — ellipsised, with no tooltip and no wrapping, so the user
  cannot read which total they are looking at (1.4.4 / 1.4.10). Let it wrap.
  Also measured: the footer takes 18 % of a 320×512 viewport and 23 % of
  640×400 (the 200 % zoom equivalent).

- [ ] **B4. The "kr." placeholder fails contrast**
  **Measured**: `rgb(153, 153, 177)` on white = **2.78:1** at 14 px; 1.4.3 needs
  4.5:1. Level **AA**, not A, which is why it was not fixed alongside B1–B3.
  Root cause is `inputPlaceholder` in
  `libs/island-ui/core/src/lib/Input/Input.mixins.ts:200` using
  `theme.color.dark300` (#9999b1), which styles every input on island.is, and
  the palette has no token between #9999b1 (2.78:1) and #33335a (11.92:1). A
  design-system decision: new token, or a visibly darker placeholder everywhere.
  Fixing B3 did remove the placeholder's *labelling* role, which was the part
  that mattered for level A.

## Open — source-level, not observable in the harness

These need the full application shell (data providers, submit flow) to
reproduce, so they are read off the source rather than measured.

- [ ] **S4. Submission is blocked with an empty message**
  `libs/application/templates/pay-debts/src/fields/DebtsLoader/index.tsx:177`
  returns `[false, '']` from the `beforeSubmit` guard, and
  `forms/mainForm/debtsSection.ts:97` disables Continue via `isSubmitDisabled`.
  Both stop the user with nothing shown and nothing announced (3.3.1).

- [ ] **S5. Nothing announces the debts loading, failing, or being replaced**
  `DebtsLoader/index.tsx:207` swaps a `SkeletonLoader` for the table.
  `SkeletonLoader` sets no `aria-busy`/`role="status"`, and
  `libs/island-ui/core/src/lib/AlertMessage/AlertMessage.tsx:87` is a plain
  `Box` with no ARIA attributes at all. So the error (`:186`), empty (`:221`)
  and "debts were refreshed" (`:233`) states are silent (4.1.3).
  The refreshed case is the worst: the user's selection is wiped
  (`SELECTION_ANSWER_IDS.forEach((id) => setValue(id, []))`) and a non-sighted
  user gets no notice. Give that alert `role="alert"` at minimum.

- [ ] **S6. Sticky-footer totals update silently**
  `StickyFooterFormField.tsx:123-140` recomputes "Samtals til greiðslu" and
  "Eftirstöðvar skuldar" on every checkbox and keystroke, with no live region
  (4.1.3). Add `aria-live="polite"` — polite, not assertive, since it fires per
  keystroke. The on-blur uncheck (intended behaviour, see above) should be
  announced through the same region.

- [ ] **S7. Out-of-range amounts are rejected silently**
  `libs/shared/form-fields/src/lib/InputController/InputController.tsx:154` —
  `isAllowed` drops any keystroke that would exceed the debt. No error, no
  `aria-invalid`, and nothing states the maximum (3.3.1 / 3.3.3).

## Open — moderate

- [ ] **M2. Table has no accessible name** — `InteractiveTableFormField.tsx:229`
  has no `<caption>` or `aria-label`, and `debtsSection.ts:46` passes no
  `title`, so `showFieldName` is false. Add a visually hidden caption.

- [ ] **M3. No row headers** — every cell is a `<td>`
  (`InteractiveTableFormFieldRow.tsx:259-288`), so cell-by-cell navigation
  announces the column header but never which debt the cell belongs to.
  `<th scope="row">` on the first cell would restore row context (1.3.1).

- [ ] **M4. Total row is in `<tbody>`, not `<tfoot>`** —
  `InteractiveTableFormField.tsx:302`. `T.Foot` already exists
  (`libs/island-ui/core/src/lib/Table/Table.tsx:69`), and the "Heildarskuld"
  label sits in a `<td>` rather than a `<th>`.

- [ ] **M5. Expanded detail is a nested `<table>` inside a `<td>`** —
  `InteractiveTableFormFieldExpandedRow.tsx`. Valid HTML, hostile to
  screen-reader table navigation, and it nests a `min-width: 700px` scroll
  container inside another one (`InteractiveTableFormField.css.ts:89`).

- [ ] **M6. `aria-controls` points into an `aria-hidden` subtree** —
  `InteractiveTableFormFieldRow.tsx:323` puts `aria-hidden={!isOpen}` on the
  `<tr>` containing the element referenced from `:118`. Harmless today (nothing
  focusable in there) but it breaks the moment something is added — and on
  collapse the content unmounts, so focus inside it would drop to `<body>`.

- [ ] **M7. Four tab stops per row, one of which is not a control**
  **Measured** tab order: `select-all → checkbox → expand toggle →
  (truncated cell span) → checkbox → expand toggle → …`. Ariakit's
  `TooltipAnchor` injects `tabindex="0"` on truncated cells, so each visually
  clipped value becomes a tab stop with no role. With 40 debts that is ~120
  stops to cross the table, ~300 at the supported ceiling of 100 debts, with no
  skip link. Not a violation on its own; real friction (2.4.1, 2.4.3).

## Cleared by the runtime pass

- **Colour contrast passes throughout** — no axe `color-contrast` violations in
  any state. Measured: expandable cell link text 5.06:1, ordinary cell text
  19.71:1, column header 18.33:1, unchecked checkbox border 5.06:1
  (1.4.11 needs 3:1). The one exception is the placeholder — B4.
- **Reflow at 320 px is fine** — the document does not scroll horizontally
  (`scrollWidth 320` at `clientWidth 320`); only the table scrolls inside its
  own container, the accepted pattern for tables.
- **The expand toggle has a real focus indicator** — an earlier reading of the
  computed style suggested it had none. It does: on focus the toggle takes a
  `rgb(0, 228, 202)` fill with text darkening to `rgb(0, 0, 60)` at 12.16:1.
  The style lands after a transition, which is what the first probe missed.
- **Truncated cells are keyboard reachable** — the plain truncated `<span>`
  receives `tabindex="0"` from Ariakit, and the tooltip opens on keyboard focus
  with text matching the cell exactly. No information is hover-only. Screen
  readers get the full text from the DOM regardless, since CSS ellipsis does not
  truncate text content.
- **No console or page errors** in any state.

## Also right

- `aria-expanded` + `aria-controls` on the expand toggle
  (`InteractiveTableFormFieldRow.tsx:117-118`), correctly wired to the
  `AnimateHeight` container and covered by tests.
- The toggle is exposed as `role="button"` with a correct accessible name from
  the charge type, verified in Chrome's AX tree.
- Real `<table>`/`<thead>`/`<th>` semantics rather than div soup.
- Every user-facing string goes through `defineMessages`/`formatText`.

## Worth raising with the design system

- The checkbox focus ring is `mint400` — **1.62:1 against white**, below the
  3:1 that 1.4.11 wants for a state indicator (3.12:1 against the checkbox's own
  blue border). Perceptible but thin on contrast, and it affects every checkbox
  on island.is.
- `AlertMessage` has no `role`/`aria-live` option at all, so no consumer can
  announce an alert without wrapping it. S5 is really a gap in that component.
- The `'kr.'` placeholder default in `InteractiveTableFormField.tsx` is a
  hardcoded, untranslated string in a shared component.

## Recommended order for the remaining work

1. S1 — the confirmed 2.4.11 failure, and the only one that can strand a
   keyboard user.
2. S5 + S6 together, since both need the same polite live region; S3 alongside.
3. S4, S7, and the validation layer from the earlier review (`dataSchema.ts`),
   which are one piece of work: the screen currently has no error mechanism.
4. M2–M7, ideally before `InteractiveTableField` picks up a second consumer.
5. B4 and the design-system items, with whoever owns island-ui.

Not catalogued above, found while fixing S2: **`toggleAll` overwrites every
row's amount with the full debt when selecting**, so a user who ticked three
debts and typed part-payments loses those amounts on select-all. Data loss
rather than an accessibility defect, and latent until now because the mixed
state was invisible — making the dash visible is what will drive people to click
select-all mid-selection. Fix would be to fill amounts only for rows that were
not already selected.

## Still not covered

Real screen-reader output (VoiceOver/NVDA announcement order and phrasing — note
macOS ships **no Icelandic voice**, so genuine Icelandic testing needs iOS with
Símarómur, or Windows + NVDA), the full application shell around these fields
(progress header, section nav, submit flow), the payment and conclusion screens,
and browsers other than Chromium.
