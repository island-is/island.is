# equality-report

Application template for submitting a company equality plan (jafnréttisáætlun)
to the Directorate of Equality (Jafnréttisstofa).

## What is this application for

Companies use this application to send their equality plan to the Directorate
of Equality. The applicant confirms company information, the chief executive
and contact person, employee counts and subsidiaries, and then uploads the plan
itself (`.pdf`, `.docx` or `.txt`). A blank `.docx` template from the
Directorate can be downloaded from the same screen. If the company already has
an active plan, it is shown for reference before the new one is uploaded.

## Who can use this template

Only companies (validated via national id) may apply — see `mapUserToRole` in
`src/utils/mapUserToRole.ts`. A person acts for the company through a
procuration holder or custom delegation, and needs the
`@island.is/applications/directorate-of-equality` scope. Anyone else is routed to a
"not allowed" form.

## Organization

Directorate of Equality (Jafnréttisstofa).

## State flow

- **`prerequisites`** — fetches identity, user profile, company registry data,
  the company's active equality plan and its DOE record (employee count
  category).
- **`draft`** — the main form: company information, contacts, employee counts,
  subsidiaries, the previous plan (if any), the new plan upload and an
  overview. Submitting runs `submitEqualityDraft` on the way out (`onExit`, so
  a failed submission blocks the transition) and moves to `inReview`.
- **`inReview`** — with Jafnréttisstofa. The case worker can approve
  (`approved`), reject (`denied`) or send it back for revision (`draftRetry`).
- **`draftRetry`** — the applicant reads the case worker's comments and
  uploads a revised plan on the same screen. The upload goes straight to DMR's
  submitted report, so submitting only moves the application back to
  `inReview` (marked as revised).
- **`approved` / `denied`** — terminal states with their own conclusion
  screens.

The template-api module is in
`libs/application/template-api-modules/src/lib/modules/templates/directorate-of-equality`.

## Decisions

- **A plan PDF goes to S3 by presigned URL**, like fylgiskjöl. The browser
  PUTs the file and sends only the key (`equalityReportPdfKey`); DMR copies it
  into the report and deletes the object. Keys are single use, so every
  attempt presigns a fresh one. The cap is 4 MB, checked here and again by
  DMR. The API still accepts an inline base64 PDF for tabs opened before this
  path existed.
- **Word and .txt plans still travel inside the GraphQL request** as HTML,
  which the island.is API caps at 350kb per request. The converted HTML may be
  at most about 340 KB of base64 (`src/utils/planUpload.ts`); past that the
  applicant is pointed to PDF.
- **Word plans are sent as text only.** The admin shows them as HTML in a
  read-only box, and the API's sanitiser has always removed `<img>`, so images
  are left out of the conversion instead of being sent and discarded. The
  applicant is told when a document had images, and pointed to PDF if they
  matter.

## Running unit tests

Run `nx test equality-report` to execute the unit tests via [Jest](https://jestjs.io).
