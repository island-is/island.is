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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorValue = { [key: string]: any }

// TODO: this value should be fetched from the API at some point
export const DEFAULT_TAX_FREE_LIMIT = 6_203_409
