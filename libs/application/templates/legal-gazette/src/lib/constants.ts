export enum LegalGazetteStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SUBMITTED_FAILED = 'submittedFailed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LegalGazetteAPIActions {
  submitApplication = 'submitApplication',
  getCategories = 'getCategories',
}

export const MAX_DATE_REPEATER_LENGTH = 3
