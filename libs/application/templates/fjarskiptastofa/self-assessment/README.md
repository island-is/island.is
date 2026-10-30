# Fjarskiptastofa, self-assessment (NIS2)

Self-assessment of network and information security for companies under
Fjarskiptastofa's supervision (NIS2). The applicant answers a set of control
questions that Fjarskiptastofa serves from its own API, submits them over
X-Road, and gets a preliminary scoring back on screen and as a downloadable PDF.

| | |
| --- | --- |
| Application type | `ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT` |
| Slug | `umsoknir/sjalfsmat-fjarskiptastofu` |
| Translation namespace | `fjs.sa.application` |
| Feature flag | `isFjarskiptastofaSelfAssessmentEnabled` |
| Code owner | `CodeOwners.Juni` |

## Who can apply

- Companies only. A person logged in with their own national id is routed to the
  `notAllowed` role and sees a screen explaining the application is for
  companies (`mapUserToRole`).
- Actors acting on a company's behalf through procuration
  (`AuthDelegationType.ProcurationHolder`).
- Only one draft at a time (`allowMultipleApplicationsInDraft: false`).

On top of that, Fjarskiptastofa decides who is actually eligible: the company
must be a supervised entity and its access window must be open. See
[Eligibility](#eligibility).

## States

| State | Lifecycle | What happens |
| --- | --- | --- |
| `prerequisites` | ephemeral | Intro screen with the EU funding emblem, the terms the applicant confirms, and the eligibility check. `getIsRegulated` runs on entry. |
| `draft` | pruned after 7 days | `IdentityApi`, `UserProfileApiWithValidation` and `getQuestionsAndCategories` run on entry. The applicant answers the questions and submits from the overview. `submitSelfAssessment` runs on exit. |
| `completed` | pruned after 4 hours | Results screen with the preliminary scoring and the PDF download. |

The short lifecycles are deliberate. The applicant has a week to finish an
assessment once started, and the submitted answers plus findings stay on
Ísland.is only long enough to be read and downloaded, so no confidential
assessment data lingers in the application system.

## Eligibility

`getIsRegulated` asks Fjarskiptastofa whether the company is a supervised entity
(`isSupervisedEntity`) and whether its access window is open
(`accessWindowOpen`), and stores both flags in
`externalData.isRegulated`.

Two things read those flags:

- The intro screen shows an error alert when either flag is false.
- `canStartApplication` guards the `prerequisites -> draft` transition, so an
  ineligible company cannot start the assessment even if the frontend check is
  bypassed.

## API-driven questions

Categories and questions are **not** hardcoded. They are fetched on entry to the
draft state by the `getQuestionsAndCategories` data provider and stored in
`externalData.selfAssessmentQuestions`. Everything downstream (the answering
screen, the overview, the results table, the PDF) renders whatever the API
returns, so adding or changing a category or question needs no change here.

- Answers live in `answers.assessment`, keyed by `q<questionId>`. The `q` prefix
  matters: react-hook-form would otherwise read a numeric key as an array index.
- Each answer is `{ answerValue, remark }`. The scale mirrors the API's
  `AnswerStatus` (`No`, `InProgress`, `InAdoption`, `Yes`) so answers submit
  without mapping.
- A question counts as answered only when both the value and a non-empty remark
  are filled in.

## Screens

**Assessment** (`AssessmentQuestions`). One screen for the whole assessment. A
select switches between categories, each question is an accordion item with a
checkmark when answered, a tooltip from the API, a radio group and a remark
field. A progress meter tracks the selected category, and answering a question
collapses it and scrolls to the next one. Answers are saved as the applicant
goes, and the screen blocks moving on while anything is unanswered.

**Overview** (`AssessmentOverview`, `getOverviewItems`). Company name plus every
question grouped under its category with the chosen answer. Edit buttons jump
back to a specific question (the target id is passed through `sessionStorage`,
see `utils/focusQuestion.ts`, so it is not persisted as application data). The
applicant must tick the confirmation checkbox before submitting.

**Results** (`AssessmentResults`). Rendered from the scoring the submit call
returns (`externalData.selfAssessmentResult`): overall score, Fjarskiptastofa's
interpretation of it, a spider chart with one axis per category, a table of
category scores, and the submitted answers. `AssessmentResultsPdf` builds the
same content as a PDF in the browser with `@react-pdf/renderer`
(`PdfSpiderChart` draws the chart as plain SVG for the PDF), so the download
always matches what is on screen. The reference number is shown only when the
API returns one.

## Backend

Template API actions live in
`libs/application/template-api-modules/.../fjarskiptastofa/self-assessment`:

- `getIsRegulated`, the eligibility flags.
- `getQuestionsAndCategories`, categories and questions in the user's locale.
- `submitSelfAssessment`, builds the payload from the questions the applicant
  was shown rather than from the stored answers, so a missing answer fails the
  submit instead of being silently dropped. Fjarskiptastofa accepts only a
  complete assessment. The returned scoring is stored in
  `externalData.selfAssessmentResult`.

## Client

Backed by `@island.is/clients/fjarskiptastofa/self-assessment`
(`isRegulated`, `getQuestionCategories`, `getQuestions`, `submitAnswers`) over
X-Road. Because the answers are confidential, the client turns off error
response body logging and strips `problem+json` bodies out of log entries
(`redactProblemBody`).

## Changes outside this library

- `SpiderChart` was added to `@island.is/application/ui-components` as a
  reusable Recharts radar chart.
- `AccordionItem` in `island-ui/core` gained optional `checkmark`, `tooltip` and
  `statusPill` props, used by the question accordion.
- `pruneAfterHours` was added to `@island.is/application/core`.

## Running unit tests

Run `nx test application-templates-fjarskiptastofa-self-assessment` to execute
the unit tests via [Jest](https://jestjs.io).
