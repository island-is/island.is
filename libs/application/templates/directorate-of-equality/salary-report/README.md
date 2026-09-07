# salary-report

Application template for submitting a salary report (jafnlaunaúttekt /
"launagreining") to the Directorate of Equality (Jafnréttisstofa).

## What is this application for

Companies use this application to report and classify employee salaries
against a set of job- and personal-evaluation criteria, so the Directorate of
Equality can assess pay equality. Applicants can either import an already
completed workbook (Excel template provided by the Directorate) or fill the
report in manually, then classify jobs and employees against the resulting
criteria before submitting the report.

## Who can use this template

Only companies (validated via national id) may apply — see
`mapUserToRole` in `lib/template.ts`. An applicant without an active equality
report is routed to a "not allowed" state instead of the main form.

## Organization

Directorate of Equality (Jafnréttisstofa).

## State flow

- **`prerequisites`** — collects consent and triggers the external data
  providers (company data, blank Excel template, active equality report
  check, etc.). Branches to either `draft` or `notAllowed` depending on
  whether the applicant has an active equality report
  (`hasActiveEqualityReport`).
- **`notAllowed`** — terminal state shown when the applicant isn't eligible.
- **`draft`** — the main form: company details, criteria/sub-criteria
  weighting, employee data (imported or entered manually), job classification
  and employee classification, the salary analysis and the úrbótaáætlun.
  Submitting runs `submitSalaryReport` on the way out (`onExit`, so a failed
  submission blocks the transition) and branches to `postponeReceived` or
  `inReview` depending on whether the applicant asked to hand the úrbótaáætlun
  in later (`hasPostponedOutlierPlan`).
- **`postponeReceived`** — the report is in, the úrbótaáætlun is not. The whole
  form is one screen, the receipt ("Sending móttekin"), so the applicant is
  handed the way out rather than a "Halda áfram" into work they just postponed.
  `PostponeReceiptCloser` dispatches `SUBMIT` as they leave the page, moving the
  application to `postponed` — a state rather than an answer flag so the receipt
  cannot be reached again. From the outside the two look identical: same tag,
  same pending action.
- **`postponed`** — the úrbótaáætlun flow: the submitted salary analysis
  (read-only, never recalculated), the úrbótaáætlun itself, and one review
  screen recapping the report, the analysis verdict and the plan before it is
  sent. Submitting PUTs just the outlier explanations (`editOutliers`) and moves
  to `inReview`.
- **`draftRetry`** — a case worker sent the application back for revision
  (`EDIT` from `inReview` or `postponed`). Same restricted comments and
  úrbótaáætlun editing as `postponed`; there is no path back to the original
  data-entry screens. Submitting moves to `inReview`.
- **`inReview`** — with Jafnréttisstofa. Branches to `approved`, `denied`, or
  back to `draftRetry`.
- **`approved` / `denied`** — terminal states with their own conclusion
  screens.

The template is feature flagged via
`Features.isDirectorateOfEqualityApplicationsEnabled`.

## Running unit tests

Run `nx test application-templates-directorate-of-equality-salary-report` to
execute the unit tests via [Jest](https://jestjs.io).
