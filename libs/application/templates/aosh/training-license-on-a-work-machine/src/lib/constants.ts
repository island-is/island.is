import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}
