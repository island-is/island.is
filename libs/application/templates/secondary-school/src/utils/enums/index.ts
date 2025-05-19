import { DefaultEvents } from '@island.is/application/types'

export enum ApplicationEvents {
  REVIEW_STARTED = 'REVIEW_STARTED',
  REVIEW_WITHDRAWN = 'REVIEW_WITHDRAWN',
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
  APPLICATION_DISMISSED = 'APPLICATION_DISMISSED',
}
export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.EDIT
    | ApplicationEvents.REVIEW_STARTED
    | ApplicationEvents.REVIEW_WITHDRAWN
    | ApplicationEvents.REVIEW_COMPLETED
    | ApplicationEvents.APPLICATION_DISMISSED
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  EDIT = 'edit',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'inReview',
  IN_REVIEW_FROM_EDIT = 'inReviewFromEdit',
  COMPLETED = 'completed',
  DISMISSED = 'dismissed',
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
