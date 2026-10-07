import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOTALLOWED = 'notAllowed',
}

// The possible answers to every self-assessment control question. The string
// values mirror Fjarskiptastofa's AnswerStatus enum so answers can be submitted
// to the API without any mapping.
export enum AssessmentAnswer {
  NO = 'No',
  IN_PROGRESS = 'InProgress',
  IN_ADOPTION = 'InAdoption',
  YES = 'Yes',
}

// Key in externalData where the API-driven categories and questions are stored.
export const QUESTIONS_EXTERNAL_DATA_ID = 'selfAssessmentQuestions'

// Key in externalData where the scoring returned by the submit API is stored.
// Set explicitly on the onExit template api so the completed form can render the
// preliminary findings from it.
export const SUBMIT_EXTERNAL_DATA_ID = 'selfAssessmentResult'

// Answers object in the application answers, keyed by question id.
export const ASSESSMENT_ANSWERS_ID = 'assessment'

// Boolean confirmation the applicant must tick on the overview before submitting.
export const ASSESSMENT_CONFIRMATION_ID = 'assessmentConfirmation'
