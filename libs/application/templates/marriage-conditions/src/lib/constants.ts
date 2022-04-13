import { DefaultEvents } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNED_SPOUSE = 'assigned_spouse',
  WITNESS_ONE = 'witness_one',
  WITNESS_TWO = 'witness_two',
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}
