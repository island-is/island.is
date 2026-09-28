# DatePicker upstream comparison

Baseline: `DatePicker.tsx` (the existing UI core component). Experiment: `DatePickerNativeSwap.tsx`. Open the **Form/DatePicker comparison** stories in Island UI Storybook. Each scenario shows callback output so the selected values can be checked as well as the input display.

## Task list

- [x] **Reverse range selection and preview:** Select a late date, hover an earlier date, then click it. Verify that the earlier date becomes the start and the callback fires once with both dates. Compare the original behavior with `swapRange` in the copied picker.
- [ ] **Range closing:** Select the first date and confirm the calendar stays open. Select the second and confirm it closes. Assess whether upstream `shouldCloseOnSelect` can replace our open state handling.
- [ ] **Range time input:** Enable time input, choose start and end dates and times, then verify both values and localized formatting. Assess upstream range time selection.
- [ ] **Typed range:** Try English and Icelandic formats, fallback separators, reversed dates, Enter, and closing without Enter. Confirm callback timing and invalid input behavior before replacing custom parsing.
- [ ] **Clear button:** Clear a selected single date and a selected range. Check the input value, callback, label, keyboard access, and appearance against upstream `isClearable`.
- [ ] **Month and year controls:** Navigate by both selects and arrows. Check available years, keyboard access, and appearance against upstream dropdown props.

The **Current behavior** story provides fixtures for all six items. The **Native swap comparison** story shows the first experiment side by side. Follow-up experiments should update only the copied component, one item at a time, and add a focused comparison scenario before changing the production component.

## Browser baseline results

Tested in Chrome against the Storybook preview on 2026-09-28:

| Item | Result |
| --- | --- |
| Reverse range click and preview | Pass in both current and native-swap pickers; one sorted-range callback. |
| Range closing | Pass; open after first click and closed after second. |
| Range time input | Pass; separate start/end time inputs, and both selected times update. English and Icelandic date display checked. |
| Typed range | Enter commits sorted ranges in both locales, including fallback separators; invalid input does not commit. **Clicking outside an open calendar discards a complete typed range without calling `handleChange`.** This contradicts the existing `onCalendarClose` comment and needs attention before replacing the parser. |
| Clear button | Pass for single and range values, including keyboard activation of the single-date button. |
| Month and year controls | Pass for dropdown selection, arrow navigation, and keyboard month selection. The underlying comboboxes have no accessible names despite the `aria-label` props passed to `Select`. |

The Storybook manager currently crashes in `storybook-addon-apollo-client` (`Title` reads `.length` from `undefined`). The stories themselves work at their direct preview URLs:

- Current: `http://localhost:4400/iframe.html?id=form-datepicker-comparison--current-behavior&viewMode=story`
- Native swap: `http://localhost:4400/iframe.html?id=form-datepicker-comparison--native-swap-comparison&viewMode=story`

## Additional migration audit (5.1.0 → 9.1.0)

The release notes for 6, 7, 8, and 9 are the upstream migration record. The following candidates extend the initial feature list. These are findings to test in the copied picker, not yet approved substitutions.

| Existing pattern | Upstream capability or newer convention | Assessment |
| --- | --- | --- |
| Register `en`/`is` in an effect while passing locale objects directly | Upstream accepts raw date-fns locale objects | Registration appears redundant and adds a global side effect. Safe first cleanup candidate. |
| Parse each fallback format manually in `tryParseDate` | `dateFormat` accepts an array and parsing tries each format | Likely replaces fallback parsing, but the wrapper's Enter-only callback timing and reversed typed-range sorting remain separate requirements. |
| Manually control `open`, click-outside, keyboard open/close, and completion close | Upstream owns open state, keyboard handling, `shouldCloseOnSelect`, and `toggleCalendarOnIconClick` | Potentially substantial simplification, but requires a joint interaction test; the current `open` prop overrides upstream's internal state. |
| Measure a fixed 310px calendar width to align its popper | v9 uses Floating UI and exposes `popperModifiers` / `popperTargetRef` | Candidate for responsive positioning without a fixed-width estimate; test all input sizes and viewport edges. |
| Copy and maintain a large stylesheet of upstream class selectors | v9.1 restores base dropdown styles and v9 uses inherited `em` sizing | Audit old selectors and visual overrides before removing any. This is a maintenance opportunity, not a prop swap. |
| Normalize incoming `Date` values and mirror controlled props in local state | v9.1 validates some date props at runtime; v9 updates the calendar view when props change | Reassess defensiveness and state duplication, but do not remove until controlled and uncontrolled consumers are tested. |
| Use `any` for the range/single `onChange` union | v7 migrated upstream to TypeScript; v9 improved discriminated-union inference | Split mode-specific handlers or rendering to recover upstream types and remove the file-wide `no-explicit-any` suppression. |

Important limits: `showTimeInput` is already delegated to upstream, so its new range support removes little wrapper code. Upstream's clear button has `tabIndex=-1`, while our UI core button is keyboard focusable; replacement would lose that behavior. Built-in month/year dropdowns do not automatically preserve our custom year bounds and styling. `useWeekdaysShort` produces two-character labels in the installed date-fns locales, while our current `formatWeekDay` uses three characters. The weekend column treatment and preset range tags still require custom UI.

Dependency drift: UI core imports `date-fns@2.28.0` for formatting/parsing and locale objects, while `react-datepicker@9.1.0` installs `date-fns@4.1.x` internally. The baseline scenarios pass, but this mixed-version boundary deserves explicit locale and edge-date tests before a larger rewrite.

### Follow-up tasks

- [ ] Remove redundant locale registration in the copied picker and compare both locales.
- [ ] Trial a `dateFormat` array for fallback parsing; check callback timing, invalid dates, and reversed typed ranges.
- [ ] Trial upstream open/close handling as one experiment covering mouse, keyboard, click outside, clear, and range completion.
- [ ] Trial Floating UI overflow handling at narrow and right-edge viewports.
- [ ] Review the vendored stylesheet against v9 markup and base styles.
- [ ] Audit controlled/uncontrolled selected-date state and invalid-date inputs.
- [ ] Replace `any` handlers with mode-specific upstream types.
- [ ] Align date-fns versions or verify the mixed-version locale boundary with focused edge-date tests.
