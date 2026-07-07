# equality-report

This template for an application was generated with the `nx generate-template equality-report` command.

Write documentation here.

- What gervimenn can use this template
- What is this application for
- Which organization is this application for
- Describe the stateflow of the application on a high level
- And more...
  Application template for submitting a company equality report (jafnréttisáætlun) to
  the Directorate of Equality (Jafnréttisstofa).

- **Applicants:** procuration holders of a company (`isCompany` national ID), delegated via `AuthDelegationType.ProcurationHolder`.
- **Purpose:** collects general company information, chief executive and contact
  person details, employee counts by gender, subsidiary information, and the
  equality plan content itself (either authored in a rich text editor or uploaded
  as a `.txt`/`.docx` file), then submits it to the DOE backend.
- **Organization:** Directorate of Equality (Jafnréttisstofa).
- **State flow:**
  - `PREREQUISITES` — fetches company registry, user profile, identity, and DOE data
    (active equality report + employee count category) before the applicant continues.
  - `DRAFT` — the applicant fills out the main form (company info, contacts,
    employee counts, subsidiaries, and the equality plan content) and reviews an
    overview before submitting.
  - `COMPLETED` — on entry, submits the report to the DOE backend
    (`ApiActions.submitEqualityReport`) and shows a confirmation screen.

## Running unit tests

Run `nx test equality-report` to execute the unit tests via [Jest](https://jestjs.io).
