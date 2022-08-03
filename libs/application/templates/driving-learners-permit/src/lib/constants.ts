import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
}

export const YES = 'yes'
export const NO = 'no'

type FakeCurrentLicense = 'none' | 'temp' | 'B-full'
type YesOrNo = 'yes' | 'no'

export interface LearnersPermitFakeData {
  useFakeData?: YesOrNo
  currentLicense?: FakeCurrentLicense
  mentorLicenseIssuedDate?: string
  mentorableStudents?: string
  useDeprivation?: YesOrNo
  deprivationDateTo?: string
  deprivationDateFrom?: string
  mentorAge?: string
  healthRemarks?: YesOrNo
}
