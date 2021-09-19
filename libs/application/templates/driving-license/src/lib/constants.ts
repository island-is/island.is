import { DefaultEvents } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
