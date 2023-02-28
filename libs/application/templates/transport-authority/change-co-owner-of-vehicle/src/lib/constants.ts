import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
}

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  REVIEW = 'review',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  REVIEWER = 'reviewer',
}
