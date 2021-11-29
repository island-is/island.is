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

type FakeCurrentLicense = 'none' | 'temp'
type YesOrNo = 'yes' | 'no'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
}
