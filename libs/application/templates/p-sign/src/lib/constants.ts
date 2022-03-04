import { DefaultEvents } from '@island.is/application/core'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
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
}
