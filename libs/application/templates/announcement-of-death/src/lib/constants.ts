import { DefaultEvents } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DELEGATED = 'delegated',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export interface AnnouncementOfDeathFakeData {
  useFakeData?: YesOrNo
}


export enum ApiActions {
  submitApplication = 'submitApplication',
  getInitialData = "getInitialData"
}
