import { YesOrNo } from '@island.is/application/core'
import { DefaultEvents, StateLifeCycle } from '@island.is/application/types'

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

export interface AnnouncementOfDeathFakeData {
  useFakeData?: YesOrNo
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  syslumennOnEntry = 'syslumennOnEntry',
  assignElectedPerson = 'assignElectedPerson',
}

export const HalfYearLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 182, // 6 months
}

export const DayLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24,
}

export const willValidation = 'willValidation'
export const filesValidation = 'filesValidation'
