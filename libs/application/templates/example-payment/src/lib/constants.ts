import { DefaultEvents } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
