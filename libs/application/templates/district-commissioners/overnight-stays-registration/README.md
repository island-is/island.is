# Skráning á nýtingu gistinátta (overnight-stays-registration)

Application for Sýslumenn (District Commissioners) for registering the use of overnight stays.

- **Application type:** `ApplicationTypes.OVERNIGHT_STAYS_REGISTRATION` (`OvernightStaysRegistration`)
- **URL:** `/umsoknir/skraning-a-nytingu-gistinatta`
- **Institution:** Sýslumenn
- **Translation namespace:** `osr.application`
- **Template API module:** `libs/application/template-api-modules/src/lib/modules/templates/district-commissioner/overnight-stays-registration`

The application was generated with `yarn generate-application-template district-commissioners/overnight-stays-registration` and `yarn generate-application-template-api-module district-commissioners/overnight-stays-registration`.

## State flow

`prerequisites` → `draft` → `completed`

1. **prerequisites** – the applicant approves data from Þjóðskrá, the user profile and Sýslumenn (home lodgings).
2. **draft** – the applicant selects a home lodging and year, records nights, prices and comments, then reviews the submission.
3. **completed** – the confirmation screen after the (still mocked) submission action succeeds.

## Backend contract

`getHomeLodgings` calls `GET /api/IslandISHeimagistingar` on Sýslumenn's
`IslandMinarSidur` X-Road service through
`@island.is/clients/district-commissioners-home-lodgings` (token exchange of
the applicant's token). The service returns one item per home lodging, each
with a `years` list of the years it must report for. The template API keeps
that shape and Sýslumenn's field names, and stores a `HomeLodging` per lodging:

- `id` and `years` (`{ year, returned }`)
- `address`, which is also shown where a lodging name would be, since the
  service has no separate name
- `postalCode` (postal code and city as one string, e.g. `"101 Reykjavík"`)
- `apartmentNumber`, `guests` and `rooms`

The client trims strings and converts `year`, `guests` and `rooms` from strings
to numbers; lodgings without an `id` and years that are not numbers are
dropped. The template API sorts `years` newest first.

The service does not return a property number, so `propertyNumber` is optional
and hidden when missing.

Everything year related is derived from the `years` lists through the helpers in
`src/utils/homeLodgings.ts`:

- `getReportingYears()` – the year options: every year listed by at least one
  lodging, newest first. A year is disabled and labelled as submitted when every
  lodging listing it has `returned: true`.
- `getHomeLodgingsForYear()` – the lodgings listed for the selected year; ones
  already submitted for that year are shown disabled.
- `getSelectedHomeLodging()` / `getHomeLodgingYear()` – the selected lodging,
  only if it lists the selected year. `submitApplication` uses the same check
  against freshly fetched data.

Gervimaður Færeyja (`0101302399`, phone `010-2399` on the dev identity server)
has one home lodging in IS-DEV, `HG00016707` (Gervistaðir) for 2024.

`submitApplication` represents `POST - Skila inn yfirliti`, which Sýslumenn
have not published yet. It validates the selected lodging and year against the
live data and then returns a mocked response containing `id`, `submittedAt` and
an empty `errors` list. The submitted payload contains the selected
registration and year, advertisement data, monthly date ranges, number of
nights, rental income and comments.

## Answer shape

The answers are defined in `src/lib/dataSchema.ts`. The non-obvious parts:

| Answer                    | Type                               | Notes                                                                                                                                                                                                                                                                                                |
| ------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `year`                    | `string`                           | Optional in the schema. The year select's `required: true` makes the form require it, and `submitApplication` rejects a year the selected lodging does not list.                                                                                                                                     |
| `homeLodgingId`           | `string`                           | The selected registration number, e.g. `HG00016707`. Written by `HomeLodgingPicker` and persisted through a hidden input (see below).                                                                                                                                                                |
| `noOvernightStays`        | `string[]`                         | Checkbox answers are arrays, so "no stays" is `['true']`. Use `hasNoOvernightStays()` from `src/utils/homeLodgings.ts` instead of reading it directly. When set, the Tímabil and Verð sub sections are skipped.                                                                                      |
| `visits`                  | `{ from: string; to: string }[]`   | One entry per visit, from the check-in day to the checkout day (ISO dates, `from < to`). The checkout day is not a night. Visits are stored separately, so two guests on consecutive days stay two visits. Read them with `getVisits()`.                                                             |
| `noActiveAdvertisement`   | `string[]`                         | Checkbox answers are arrays, so "no active link" is `['true']`. Use `hasActiveAdvertisement()` from `src/utils/homeLodgings.ts` instead of reading it directly.                                                                                                                                      |
| `advertisements`          | `{ url: string }[]`                | One object per "Hlekkur á gistingu" row, produced by `buildFieldsRepeaterField`. The field is optional so that `clearOnChange` on the checkbox can drop it entirely; when present, every row must contain an `http(s)` URL. Use `getAdvertisementUrls()` to read the trimmed, non empty URLs.        |
| `pricing.monthlyAmounts`  | `Record<string, string \| number>` | Keyed `month0`…`month11`. Numeric keys must be avoided: react-hook-form turns paths such as `monthlyAmounts.1` into arrays, which silently fails the schema. The inputs store whole krónur as integer numeric strings (`'175000'`); the schema also accepts numbers. Read them with `parseAmount()`. |
| `pricing.perVisitAmounts` | `Record<string, string \| number>` | Keyed by the visit's ISO start and end dates. Used when “Heildarupphæð á heimsókn” is selected. Same amount format as `monthlyAmounts`.                                                                                                                                                              |

When pricing by visit, each visit selected in the calendar is shown as a
separate pricing row. A visit crossing a month boundary keeps one
amount, which is split proportionally between the months based on the number of
overnight stays in each month. Any rounding remainder is assigned to the first
month so the monthly shares add up to the entered amount.

The annual multi-range UI comes from `AnnualMultiRangeCalendar` in
`@island.is/application/ui-components`. `OvernightStayCalendar` is only the
application-system adapter that provides localized labels, binds `visits` to
react-hook-form and registers the required-field validation callback. The
form shell stores a message returned from `setBeforeSubmitCallback` under the
screen id, which a field inside a multi-field never reads, so the adapter also
sets the error on `visits` with `setError`.

Prefer the built-in field builders. The advertisement links are a plain
`buildFieldsRepeaterField` with `minRows: 1`, `hideRemoveButton: false` and an
`addItemButtonText`, and the "no active link" checkbox clears the repeater
through `clearOnChange: ['advertisements']` so the schema stops validating it.

One screen still needs a custom field because built-in fields cannot react to
changes made on the same screen. `RadioFormField` memoises its options on
`application`, and `application.answers` is only updated when a screen is
saved, so `HomeLodgingPicker` watches `year` with `useFormContext` and renders
a real `buildRadioField` through the `renderField` prop that every field
receives from the form shell.

A `buildMultiField` only submits the answers whose key matches one of its own
children, so `childInputIds` declared on a nested custom field is ignored when
the screen is saved. The Heimagisting screen therefore adds a
`buildHiddenInput` for `homeLodgingId` so that the value written by
`HomeLodgingPicker` is persisted, and a `PersistAnswer` custom field with the id
`visits` so that the visits cleared when the year changes are saved too.
`PersistAnswer` renders nothing; a hidden input is not used because it
registers a native `<input>`, which is meant for string values.

## Form rules

- **One lodging and one year per application.** Every year a lodging lists must
  be reported, also when the lodging was not used (`homeLodgingInfoMessage`).
- **Nights:** each visit runs from the check-in day to the checkout day, and
  the checkout day is not a night (`getNumberOfNights()`,
  `getNightsByMonth()`). A new visit may start on the day another ends; a visit
  that overlaps another is merged with it in the calendar.
- **Payload date ranges:** each month's `dateRanges` holds the part of every
  visit in that month, and `to` is always the checkout day. A visit continuing
  into the next month ends on the first day of that month, so the nights of a
  range are always `to - from` (`getVisitPartInMonth()`).
- **Changing the year** clears `visits` and resets `pricing` through
  `setOnChange` on the year select. The cleared `visits` are saved with the
  Heimagisting screen (see `PersistAnswer` above). Answers are deep-merged on
  save, so monthly amounts of the previous year are kept and prefill the Verð
  screen for months that have nights again; per-visit amounts are keyed by
  dates and are not reused.
- **The night of 31 December cannot be reported**, because the calendar only
  shows the selected year and the checkout day would be 1 January. Sýslumenn
  will be asked whether this matters.
- **No overnight stays:** when `noOvernightStays` is set, the Tímabil and Verð
  sub sections are skipped and `buildSubmissionPayload()` sends no nights or
  rental income, even if dates or amounts from an earlier edit remain in the
  answers. The overview hides the month grid and totals under the same
  condition.
- **Amounts** are whole krónur. Zero is allowed, negative amounts are rejected,
  and every month or visit shown on the Verð screen needs an amount.
- **No lodgings:** a 404 from Sýslumenn is treated as an empty list, so the
  prerequisites step succeeds and the year select has no options.

## Known issues (work in progress)

- **Production gate.** The template has no `featureFlag` or
  `readyForProduction: false`, so it is available in production once merged,
  while the submission is still mocked.

## Registration in the application system

These steps (from `libs/application/templates/examples/README.md`) are already done for this application:

- [x] Template library generated and path added to `tsconfig.base.json`
- [x] Template API module generated and registered in `libs/application/template-api-modules/src/lib/modules/templates/index.ts`
- [x] Application type and configuration (slug + translation namespace) added to `libs/application/types/src/lib/ApplicationTypes.ts`
- [x] Institution added to `libs/application/types/src/lib/InstitutionMapper.ts`
- [x] Template loader added to `libs/application/template-loader/src/lib/templateLoaders.ts`

## What is left to do

- [x] Replace the placeholder forms with the Heimagisting, Tímabil, Verð, Athugasemdir, Yfirlit and Staðfesting flow
- [x] Validate the current form answers in `src/lib/dataSchema.ts`
- [x] Add Þjóðskrá, user-profile and home-lodging data providers
- [x] Show the selected registration, monthly totals and comments on the overview screen
- [x] Replace the mocked GET template API action with the real Sýslumenn client
- [ ] Replace the mocked POST (`Skila inn yfirliti`) once Sýslumenn publish the endpoint
- [ ] Add a payment state if the registration has a fee
- [ ] Extract the strings to Contentful with `yarn nx run application-templates-district-commissioners-overnight-stays-registration:extract-strings`
- [ ] Keep the application out of production until the POST is real: add a `featureFlag` (from `Features` in `@island.is/feature-flags`) or `readyForProduction: false`
- [ ] Ask Sýslumenn whether the night of 31 December must be reportable
- [x] List the gervimenn that can be used to test the application (see Backend contract)

## Running locally

Run `yarn codegen` after pulling the changes, start the application system with `yarn dev application-system-api` and `yarn dev application-system-form` (see `apps/application-system/README.md`) and go to [http://localhost:4242/umsoknir/skraning-a-nytingu-gistinatta](http://localhost:4242/umsoknir/skraning-a-nytingu-gistinatta).

## Running unit tests

Run `yarn nx test application-templates-district-commissioners-overnight-stays-registration` to execute the unit tests via [Jest](https://jestjs.io).
