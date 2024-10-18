import { DefaultEvents } from '@island.is/application/types'

export enum MCEvents {
  PENDING_REJECTED = 'PENDING_REJECTED',
  PENDING_REJECTED_TRY_AGAIN = 'PENDING_REJECTED_TRY_AGAIN',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.REJECT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum PropertyTypes {
  REAL_ESTATE = '0',
  VEHICLE = '1',
  SHIP = '2',
}
