import { YesOrNo } from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

export enum ApiActions {
  createApplication = 'createApplication',
  completeApplication = 'completeApplication',
}

export enum FakeDataFeature {
  allowFake = 'applicationTemplateDrivingLearnersPermitAllowFakeData',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'

export type DrivingLicenseApplicationFor = typeof B_FULL | typeof B_TEMP

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'ASSIGNEE',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
  APPROVED = 'approved',
}

type FakeCurrentLicense = 'none' | 'temp' | 'B-full'

export interface LearnersPermitFakeData {
  useFakeData?: YesOrNo
  currentLicense?: FakeCurrentLicense
  mentorLicenseIssuedDate?: string
  mentorableStudents?: string
  useDeprivation?: YesOrNo
  deprivationDateTo?: string
  deprivationDateFrom?: string
  mentorAge?: string
  remarks?: YesOrNo
}

export type DrivingLearnersPermitTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

export interface Step {
  title: MessageDescriptor
  description: MessageDescriptor
  state: ReviewSectionState
  daysOfResidency?: number
}

export type ReviewSectionProps = {
  application: Application
  step: Step
  index: number
}
