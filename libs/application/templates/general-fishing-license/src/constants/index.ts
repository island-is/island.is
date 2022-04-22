import { DefaultEvents } from '@island.is/application/core'

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  SUBMITTED = 'submitted',
  DECLINED = 'declined',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.REJECT }

export enum Roles {
  APPLICANT = 'applicant',
}
