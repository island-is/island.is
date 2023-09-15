import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.REJECT
    | DefaultEvents.APPROVE
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  REVIEW = 'review',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  BUYER = 'buyer',
  REVIEWER = 'reviewer',
}
