# UI Components

This library contains reusable UI components for the application system that are not form fields.

## Annual multi-range calendar

`AnnualMultiRangeCalendar` is a controlled calendar for selecting multiple
date ranges within one year. Consumers provide localized labels and bind the
ISO date array to their own form state:

```tsx
<AnnualMultiRangeCalendar
  id="usage-calendar"
  year={2026}
  selectedDates={selectedDates}
  onChange={setSelectedDates}
  labels={labels}
  error={error}
/>
```

The component owns range previews, connected-range removal, keyboard
navigation, accessible announcements and month-boundary styling. Application
templates remain responsible for validation and persistence.

## Running unit tests

Run `yarn nx test application-ui-components` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-ui-components` to lint
