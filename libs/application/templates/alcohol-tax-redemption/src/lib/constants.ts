import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
