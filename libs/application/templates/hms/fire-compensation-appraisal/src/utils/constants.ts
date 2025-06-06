import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT | DefaultEvents.PAYMENT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum Roles {
  APPLICANT = 'applicant',
}
