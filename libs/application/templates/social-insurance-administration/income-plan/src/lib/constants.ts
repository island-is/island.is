import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'
export const FOREIGN_BASIC_PENSION = '40ERL'
export const ISK = 'IKR'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum RatioType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}
