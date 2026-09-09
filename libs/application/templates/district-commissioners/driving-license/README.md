# Driving License (District Commissioners)

Application template for applying for a category-B driving license through the
District Commissioners (Sýslumenn). This is the redesigned, standalone copy of
the original `driving-license` template.

## What you can apply for

The type is decided from the applicant's current license and age
(`structuralCandidates` in `src/utils/eligibility.ts`); each option disables
itself when it isn't a candidate:

- **B-temp** (`B-temp`) — first, temporary license. For applicants who hold no B
  license.
- **B-full** (`B-full`) — full license. For applicants who currently hold a
  temporary B license.
- **65+ renewal** (`B-full-renewal-65`) — renewal for holders of a full B
  license aged 65+.

Whether the type-selection screen and the 65+ option are shown is gated by
feature flags (see below).

## Who can apply

Eligibility is checked up front on the external-data step by the
`checkEligibility` provider, which calls RLS `getApplicationEligibility` and
combines it with local checks (driving school / assessment, residency, and for
65+ the extended-category and blocking-remark rules). If the applicant is not
eligible for **any** type, the prerequisites step blocks entry to the draft with
a user-facing error. Per-type requirements are then shown on the eligibility
summary inside the draft.

Applicants who hold (or have held) a driving license in another country are sent
to the **declined** state with instructions, as those cases are handled off-line.

## Flow (states)

1. **Prerequisites** — external-data screen (national registry, user profile,
   current license, photos, jurisdictions, payment catalog, eligibility). A
   dev-only "Gervigögn" mock screen precedes it when `ALLOW_FAKE` is on.
2. **Draft** — type selection, eligibility summary, applicant info,
   other-country question, photo selection, health declaration / certificate,
   delivery, and the summary + payment submit.
3. **Payment** — shared application-system payment flow (`buildPaymentState`).
4. **Done** — on entry, the application is submitted to RLS.
5. **Declined** — reached via `REJECT` (e.g. a foreign license).

## Where it submits

On entry to **Done**, `ApiActions.submitApplication` runs in the shared
`transport-authority/driving-license-submission` service (namespace
`DRIVING_LICENSE`), which submits to RLS (Ríkislögreglustjóri /
ökuskírteinaskrá). This service is shared with the original `driving-license`
template.

## Feature flags

- `applicationTemplateDrivingLicenseAllowFakeData` (`ALLOW_FAKE`) — enables the
  dev-only fake-data (Gervigögn) screen used to exercise the flow without real
  RLS data in staging.
- `applicationTemplateDrivingLicenseAllowLicenseSelection`
  (`ALLOW_LICENSE_SELECTION`) — shows the license-type selection screen.
- `is65RenewalApplicationEnabled` (`ALLOW_65_RENEWAL`) — offers the 65+ renewal
  type.

To reach every screen locally, enable the flags above (or use the fake-data
screen) and pick a fake current-license / age combination that is eligible for
the type you want to test.

## Running unit tests

Run `nx test application-templates-district-commissioners-driving-license` to
execute the unit tests via [Jest](https://jestjs.io).
