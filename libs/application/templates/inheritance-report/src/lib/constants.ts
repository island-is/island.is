import { DefaultEvents } from '@island.is/application/types'

export const YES = 'Yes'
export const NO = 'No'

export const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  done: 'done',
}

export type InheritanceReportEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  completeApplication = 'completeApplication',
  syslumennOnEntry = 'syslumennOnEntry',
}

export type ErrorValue = { [key: string]: any }