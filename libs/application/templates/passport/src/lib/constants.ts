import { DefaultEvents } from '@island.is/application/core'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}
