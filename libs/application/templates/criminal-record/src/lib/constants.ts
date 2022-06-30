import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}
