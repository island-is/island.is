import { DefaultEvents } from '@island.is/application/types'

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  SUBMITTED = 'submitted',
  DECLINED = 'declined',
  APPROVED = 'approved',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.REJECT }

export enum Roles {
  APPLICANT = 'applicant',
}
