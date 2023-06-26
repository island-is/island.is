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
  | { type: MCEvents.PENDING_REJECTED }
  | { type: MCEvents.PENDING_REJECTED_TRY_AGAIN }

export enum States {
  DRAFT = 'draft',
  PENDING_REJECTED = 'pending_rejected',
  PENDING_REJECTED_TRY_AGAIN = 'pending_rejected_try_again',
  PAYMENT_INFO = 'payment_info',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}
