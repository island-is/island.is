# UI Components

This library contains reusable UI components for the application system that are not form fields.

## Annual multi-range calendar

`AnnualMultiRangeCalendar` is a controlled calendar for selecting multiple
date ranges within one year. Consumers provide localized labels and bind the
selected ranges (`{ from, to }[]` of ISO dates) to their own form state:

```tsx
<AnnualMultiRangeCalendar
  id="usage-calendar"
  year={2026}
  ranges={ranges}
  onChange={setRanges}
  labels={labels}
  error={error}
/>
```

Each range is stored separately, so two ranges next to each other are not
merged into one. Ranges are compared as half-open intervals: a range may start
on the day another ends, which suits check-in and checkout days, while a new
range that overlaps an existing one is merged with it. Clicking a day inside a
range removes it; clicking the last day of a range starts a new range on it.
Clicking the start day again cancels a pending range.

The component owns range previews, range removal, keyboard navigation,
accessible announcements and month-boundary styling. Application templates
remain responsible for validation and persistence.

## Running unit tests

Run `yarn nx test application-ui-components` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-ui-components` to lint
