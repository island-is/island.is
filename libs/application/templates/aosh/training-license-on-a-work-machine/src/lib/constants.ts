import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.REJECT
    | DefaultEvents.ASSIGN
    | DefaultEvents.APPROVE
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  REVIEW = 'review',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  deleteApplication = 'deleteApplication',
  rejectApplication = 'rejectApplication',
  initReview = 'initReview',
}
