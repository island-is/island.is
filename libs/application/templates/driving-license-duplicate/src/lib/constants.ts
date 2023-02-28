import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
}
export enum Roles {
  APPLICANT = 'applicant',
  ACTOR = 'actor',
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export interface PSignFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export type SubmitResponse = {
  success: boolean
  orderId?: string
}
