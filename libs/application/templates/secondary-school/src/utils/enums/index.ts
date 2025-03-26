import { DefaultEvents } from '@island.is/application/types'

export enum ApplicationEvents {
  REVIEW_STARTED = 'REVIEW_STARTED',
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
}
export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.EDIT
    | ApplicationEvents.REVIEW_STARTED
    | ApplicationEvents.REVIEW_COMPLETED
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  EDIT = 'edit',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'inReview',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANISATION_REVIEWER = 'mms',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  deleteApplication = 'deleteApplication',
}

export enum Routes {
  PERSONAL = 'personalMultiField',
  CUSTODIAN = 'custodianMultiField',
  EXTRA_INFORMATION = 'extraInformationMultiField',
  SCHOOL = 'schoolMultiField',
}

export enum ConclusionView {
  DEFAULT = 'DEFAULT',
  OVERVIEW = 'OVERVIEW',
}
