import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
    | DefaultEvents.ABORT
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
