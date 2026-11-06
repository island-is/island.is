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

1. **prerequisites** – the applicant approves data from Þjóðskrá, the user profile and the home-lodging provider.
2. **draft** – the applicant selects a home lodging and year, records nights, prices and comments, then reviews the submission.
3. **completed** – the confirmation screen after the mocked submission action succeeds.

## Temporary backend contract and mock

The template currently uses a mocked template API implementation while the
Sýslumenn API is being developed.

`getHomeLodgings` represents `GET - Heimagistingar eftir kennitölu` and returns
all registrations for the applicant. Each item contains:

- `id`
- `year`
- `hasBeenSubmitted`
- name/address
- postal code and city
- property and unit numbers
- guest and room counts
- optional mocked stay records with source, listing name, date range, night
  count and rental income

The form derives its year options from this list. Every year that has at least
one registration is selectable; registrations where `hasBeenSubmitted` is
`true` are rendered as disabled options with a tooltip instead of being
filtered out.

The mock data contains two selectable addresses for 2025 and 2026, and one
selectable address for 2024. Both 2023 registrations have already been
submitted, so the year is visible but disabled in the selector. The
registration `HG-00004822` includes two Airbnb stay records for 2026. They are
backend fixture data only and do not prefill the Tímabil or Verð screens.

`submitApplication` represents `POST - Skila inn yfirliti`. The submitted
payload contains the selected registration and year, advertisement data,
monthly date ranges, number of nights, rental income and comments. The mocked
response contains `id`, `submittedAt` and an empty `errors` list. Replace the
mock list and method bodies in the template API service with the generated
client when the real endpoints are available; the form-facing contract can
remain unchanged.

## Answer shape

The answers are defined in `src/lib/dataSchema.ts`. The non-obvious parts:

| Answer | Type | Notes |
| --- | --- | --- |
| `year` | `string` | Optional in the schema, required by the field-level validation in `HomeLodgingPicker`. |
| `homeLodgingId` | `string` | The selected `HG-…` registration number. |
| `noOvernightStays` | `string[]` | Checkbox answers are arrays, so "no stays" is `['true']`. Use `hasNoOvernightStays()` from `src/utils/homeLodgings.ts` instead of reading it directly. When set, the Tímabil and Verð sub sections are skipped. |
| `noActiveAdvertisement` | `string[]` | Checkbox answers are arrays, so "no active link" is `['true']`. Use `hasActiveAdvertisement()` from `src/utils/homeLodgings.ts` instead of reading it directly. |
| `advertisements` | `{ url: string }[]` | One object per "Hlekkur á gistingu" row, produced by `buildFieldsRepeaterField`. The field is optional so that `clearOnChange` on the checkbox can drop it entirely; when present, every row must contain an `http(s)` URL. Use `getAdvertisementUrls()` to read the trimmed, non empty URLs. |
| `pricing.monthlyAmounts` | `Record<string, string>` | Keyed `month0`…`month11`. Numeric keys must be avoided: react-hook-form turns paths such as `monthlyAmounts.1` into arrays, which silently fails the schema. |
| `pricing.perVisitAmounts` | `Record<string, string>` | Keyed by the visit's ISO start and end dates. Used when “Heildarupphæð á heimsókn” is selected. |

When pricing by visit, each contiguous date range selected in the calendar is
shown as a separate pricing row. A visit crossing a month boundary keeps one
amount: it is included in the rental income of the month in which the visit
starts and is not duplicated in the following month.

The annual multi-range UI comes from `AnnualMultiRangeCalendar` in
`@island.is/application/ui-components`. `OvernightStayCalendar` is only the
application-system adapter that provides localized labels, binds
`overnightDates` to react-hook-form and registers the required-field
validation callback.

Prefer the built-in field builders. The advertisement links are a plain
`buildFieldsRepeaterField` with `minRows: 1`, `hideRemoveButton: true` and an
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
`HomeLodgingPicker` is persisted.

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
- [x] Add Þjóðskrá, user-profile and mocked home-lodging data providers
- [x] Show the selected registration, monthly totals and comments on the overview screen
- [ ] Replace the mocked GET and POST template API actions with the real Sýslumenn client
- [ ] Add a payment state if the registration has a fee
- [ ] Extract the strings to Contentful with `yarn nx run application-templates-district-commissioners-overnight-stays-registration:extract-strings`
- [ ] Add a `featureFlag` (from `Features` in `@island.is/feature-flags`) to the template if it should be hidden in production until it is ready
- [ ] List the gervimenn that can be used to test the application here

## Running locally

Run `yarn codegen` after pulling the changes, start the application system with `yarn dev application-system-api` and `yarn dev application-system-form` (see `apps/application-system/README.md`) and go to [http://localhost:4242/umsoknir/skraning-a-nytingu-gistinatta](http://localhost:4242/umsoknir/skraning-a-nytingu-gistinatta).

## Running unit tests

Run `yarn nx test application-templates-district-commissioners-overnight-stays-registration` to execute the unit tests via [Jest](https://jestjs.io).
