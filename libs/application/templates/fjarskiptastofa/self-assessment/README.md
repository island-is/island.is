# Fjarskiptastofa – self-assessment (NIS)

Self-assessment of network and information security (NIS) for companies under
Fjarskiptastofa's supervision. Only companies (or actors acting on their behalf
with procuration) can apply.

## Flow

The application has three steps in the main form:

1. **Information gathering** – company details and contact info (`companyInfoSection`).
2. **Assessment** – a single screen whose categories and questions come entirely
   from Fjarskiptastofa's API. Categories are shown as tabs the applicant can
   switch between (`assessmentSection` → `AssessmentQuestions` custom field).
3. **Summary** – overview of all answers before submitting (`overview`).

A separate prerequisites form gates access (external data consent) before the
main form.

## API-driven questions

The categories and questions are **not** hardcoded. They are fetched from the
API on entry to the draft state via the `getQuestionsAndCategories` data
provider and stored in `externalData.selfAssessmentQuestions`. The assessment
screen and the summary render whatever the API returns, so adding a category or
question requires no changes here.

- Answers are stored in `answers.assessment`, keyed by `q<questionId>`.
- The answer scale mirrors the API's `AnswerStatus` (`No`, `InProgress`,
  `InAdoption`, `Yes`) so answers submit without mapping.
- On submit, answers are sent to Fjarskiptastofa via `submitSelfAssessment`
  (`onExit` of the draft state).

## Client

Backed by `@island.is/clients/fjarskiptastofa/self-assessment`
(`getQuestionCategories`, `getQuestions`, `submitAnswers`, `isRegulated`).

## Running unit tests

Run `nx test self-assessment` to execute the unit tests via [Jest](https://jestjs.io).
