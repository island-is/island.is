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
  and employee classification.
- **`completed`** — submits the report (`submitSalaryReport`) and shows the
  confirmation screen.

The template is feature flagged via
`Features.isDirectorateOfEqualityApplicationsEnabled`.

## Running unit tests

Run `nx test application-templates-directorate-of-equality-salary-report` to
execute the unit tests via [Jest](https://jestjs.io).
