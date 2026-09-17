# Guard against OpenAPI drift in car-rental-dayrate-returns

## Context
The regenerated Skatturinn spec changed
`GET /api/RentalDays/{EntityId}/periods/{Period}` from `RentalDaysEntry[]` to a
single `RentalDayRegistrationModel`. `tsc` caught the shape change; nothing
covered the behaviour of the code that consumed it.

## Plan
- [ ] Add `car-rental-dayrate-returns.service.spec.ts` in template-api-modules
- [ ] Type every client fixture as the generated model, so a future spec change
      breaks the spec file at compile time instead of silently at runtime
- [ ] Cover `getPreviousPeriodDayRateReturns`: per-permno summing across batched
      entries, `entries: null`, period clamping, entries with no `fastnr`
- [ ] Cover `assertNotAlreadyReported` via `postDataToSkatturinn`
- [ ] Cover the posted payload (year/month/entries) for the table path
- [ ] Freeze the clock so "previous month" assertions stay deterministic
- [ ] Run the suite

## Review
(filled in after implementation)

## Fix 404 from getPreviousPeriodDayRateReturns (skilagrein daggjalds)

`updateApplicationExternalData` fails with `statusCode: 404` because the
`/api/RentalDays/{EntityId}/periods/{Period}` GET is a single-resource endpoint --
Skatturinn has no registration to return for a period nothing was reported in yet,
which is the normal state of a fresh application. The service treats that 404 as fatal
and fails the whole data provider.

- [x] Let `sumRentalDaysByPermno` accept a missing registration
- [x] `handle404` on the RentalDays GET in `getPreviousPeriodDayRateReturns`
- [x] `handle404` on the same GET in `assertNotAlreadyReported` (submit path, same bug)
- [x] Keep logging real failures; a 404 is not an error worth logging
- [x] Cover both paths with tests

### Review

`handle404` (`@island.is/clients/middlewares`) was already the repo convention for this
-- ~20 other clients use it. Chained it *before* the logging `.catch` so a 404 resolves
to `null` without being logged as a failure, while every other status is still logged
and rethrown. `sumRentalDaysByPermno` now takes `RentalDayRegistrationModel | null` and
returns an empty map for a missing registration, which the existing
`alreadyReportedDays === undefined` logic already handles correctly.

The submit path had the same latent bug: `assertNotAlreadyReported` would have thrown a
404 out of `postDataToSkatturinn` for any applicant who was the first to report in a
period -- rewrapped as `requestToSkatturinnFailed`, so it would have read as a
Skatturinn outage rather than the normal case.

Not changed: the DayRate entries GET returns an array (a collection), so it yields `[]`
rather than 404 and is correctly left strict.

11 tests pass; `tsc` clean.

### Correction (after seeing the actual log)

The 404 was **not** the RentalDays call. The log names
`endpoint: 'dayRateEntriesPeriodsGet'` -- it is the DayRate entries call, and the cause
is server-side in Skatturinn's dev deployment.

Probed the local X-Road proxy unauthenticated, where an existing route answers 401 and a
missing one answers 404:

| endpoint (v1)                                    | result        |
|--------------------------------------------------|---------------|
| `DayRate/entries/{id}`                           | 401 healthy   |
| `DayRate/entries/{id}/eligible-vehicles`         | 401 healthy   |
| `DayRate/entries/{id}/{permno}`                  | 401 healthy   |
| `RentalDays/{id}/periods/2026-08`                | 401 healthy   |
| **`DayRate/entries/{id}/periods/2026-08`**       | **404, later 500** |
| `DayRate/entries/{id}/periods/2026-8`            | 401 (falls through to `{Permno}/{Id}`) |

Only a Period matching `^\d{4}-\d{2}$` reaches the broken handler; anything else falls
through to the `{Permno}/{Id}` route and is auth-gated normally. So the route is
registered and its constraint matches -- the handler itself fails, before auth. It is
the only endpoint in the API that never returns 401. Behaviour changed from a consistent
404 to a consistent 500 during the session, so the dev deployment is actively unstable.

Live swagger (`/swagger/v1/swagger.json`) matches `clientConfig.json` exactly, including
the RentalDays edit -- the local spec is correct. There is also a separate `/api/v2/...`
surface, but it lacks `RentalDays/{id}/periods/{Period}` and `eligible-vehicles`, so it
is not a drop-in.

- [ ] Report to Skatturinn with traceId `00-03d1db34a89932fc99bb96f1a5a278e5-20b34e4848de39c9-01`
- [x] Reverted the `handle404` calls and their tests -- they targeted the wrong call and
      the copy in `assertNotAlreadyReported` would have weakened the double-reporting
      guard. Service and spec are back to their pre-session state; 8 tests pass.

### Review

No island.is change fixes this. The DayRate periods handler fails upstream before auth
runs, so there is nothing the client can send to make it succeed. Leaving the data
provider strict is correct: it is the primary source for the vehicle list, and degrading
to an empty list would silently show the applicant nothing to report.

### Confirmed: the 404 is correct behaviour

With two cars added to daggjald, probing entity 5005101370 on the v1 periods endpoint:

| period    | result |
|-----------|--------|
| `2026-09` | **200** - both entries returned |
| `2026-08` | 404    |
| `2026-07` | 404    |
| `2026-06` | 404    |

So `404` means "no day rate entries for this entity in this period". Not a fault, and
nothing was ever wrong upstream -- the earlier transient 500 aside. The endpoint is also
anonymous, unlike its siblings, which is why it answered 404 rather than 401 to an
unauthenticated probe and made it look broken.

The new entries carry `gildirFra: 2026-09-12`, so they can never appear in an August
query. The provider asks for the *previous* month, so this test data cannot exercise the
real path until October unless Skatturinn backdates `gildirFra` into August.

Note: v2 returns `200 []` for an empty period where v1 returns 404. v2 has no
`RentalDays/{id}/periods/{Period}` and no `eligible-vehicles`, so it is not a drop-in.

- [ ] Apply `handle404` to the **DayRate** call so an empty period yields an empty list
- [ ] Decide what the applicant sees when they have nothing to report

## Show "engin ökutæki" instead of a generic error (confirmed with API owner)

Skatturinn's code owner confirmed 404 is the normal response when the applicant has no
vehicles on daggjald for the period. Showing it as a generic data-collection failure is
ours to fix.

`FormExternalDataProvider.tsx:111` already does
`errorType = errorCode < 500 ? 'warning' : 'error'`, so a `statusCode: 404` **already**
renders as the yellow warning-triangle alert. Only the wording is wrong -- no
form-system change needed.

- [x] Add `serviceErrors.noVehiclesFound` (Icelandic, matching the `m.*` messages)
- [x] Catch the 404 on the DayRate call and throw `TemplateApiError(..., 404)`
- [x] Keep logging real failures; a 404 is not one
- [x] Leave the RentalDays call alone -- its prod 401 is a separate, unresolved issue
- [x] Cover with tests

### Review

Two files, 31 added lines, nothing removed. The 404 branch throws a `TemplateApiError`
carrying the new message at status 404; everything else still logs and rethrows
untouched. Because the runner copies the status straight through as
`externalData.statusCode`, and `FormExternalDataProvider` picks `warning` for anything
under 500, the yellow warning-triangle alert comes for free.

The summary interpolates `{period}`, so the applicant sees which month came back empty.

Note: the other `serviceErrors` entries have English `defaultMessage`s while the `m.*`
messages are Icelandic. The new one follows `m.*` since it is what the applicant reads
on the prerequisites screen -- worth aligning the rest separately.

Still open and unrelated: the prod 401 on `RentalDays/{id}/periods/{Period}`. It will
survive this change, since the two calls run in parallel and neither cancels the other.

## Rebuild around availableDays (confirmed with Atli, 2026-09-15)

Atli's answers: `availableDays` on the period GET is fjöldi daga á daggjaldi, merged per
vehicle. `numberOfDays` is POST-only and is útleigudagar. We are **not** told what has
already been reported. Every car on daggjald must appear in both the sheet and the table.
Resubmission is allowed and the newest submission wins -- nothing is summed.

So the whole "already reported" concept has no source and no purpose. This is mostly
deletion.

- [x] `DayRateRecord.alreadyReportedDays` -- remove
- [x] `dayRateRecordUtils.ts` (`isEligibleForReporting`, `getEligibleDayRateRecords`) -- delete
- [x] `generateExcelSheet` -- every vehicle gets a row, no filter
- [x] `dayRateTableUtils` -- drop `disabled` / `alreadyReportedDays`
- [x] `tableViewSelection` -- drop `disabledKey` / `disabledReason`
- [x] `overviewStatistics` -- drop the `carsAlreadyReported` branch
- [x] upload parser -- drop the eligible-skip; the count becomes the full list
- [x] messages -- drop `disabledAlreadyReported`, `carsAlreadyReported`, `serviceErrors.alreadyReported`
- [x] service -- delete `sumRentalDaysByPermno` and `assertNotAlreadyReported`
- [x] service -- build records from the merged period list, `prevPeriodTotalDays` = `availableDays`
- [x] keep the 404 -> "engin ökutæki" warning; extend it to the period call and to an empty list
- [x] verify: tsc, lint, prettier, tests

### Review

Net 250 deletions against 157 insertions across 11 files, one deleted. The period GET is
now the source of truth for the vehicle list and the day count, so the `gildirFra`/
`gildirTil` clamp is gone -- and with it the duplicate-row bug, since Skatturinn merges
split day rate periods into one entry per vehicle.

The day rate entries call is kept solely to resolve `dayRateEntryId` for the POST. It is
no longer allowed to fail the provider: a 404 degrades to an empty list, so the
application still works when only that endpoint is down (it has been 500ing for much of
today). Where a plate has more than one day rate entry the id is ambiguous, so it is left
undefined and Skatturinn resolves the active entry, as its own comment says it will.

Not done, deliberately: nothing warns the applicant that resubmitting overwrites an
earlier submission. Atli confirmed the newest wins and nothing is summed, so a second
submission silently replaces the first. That is a copy/product decision, not a technical
one.
