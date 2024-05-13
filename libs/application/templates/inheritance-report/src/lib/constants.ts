import { DefaultEvents } from '@island.is/application/types'
import { m } from './messages'

export const YES = 'Yes'
export const NO = 'No'
export const PREPAID_INHERITANCE = 'EFS-Pre-paid'
export const INHERITANCE = 'EFS'

export const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  done: 'done',
}

export enum PrePaidHeirsRelationTypes {
  SPOUSE = 'spouse',
  CHILD = 'child',
  SIBLING = 'sibling',
  PARENT = 'parent',
  OTHER = 'other',
}

export const PrePaidHeirsRelations = [
  // Todo: translations?
  {
    value: PrePaidHeirsRelationTypes.SPOUSE,
    label: m.spouse.defaultMessage,
  },
  {
    value: PrePaidHeirsRelationTypes.CHILD,
    label: m.child.defaultMessage,
  },
  {
    value: PrePaidHeirsRelationTypes.SIBLING,
    label: m.sibling.defaultMessage,
  },
  {
    value: PrePaidHeirsRelationTypes.PARENT,
    label: m.parent.defaultMessage,
  },
  {
    value: PrePaidHeirsRelationTypes.OTHER,
    label: m.other.defaultMessage,
  },
]

export type InheritanceReportEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
  PREPAID = 'prepaid',
}

export enum ApiActions {
  completeApplication = 'completeApplication',
  syslumennOnEntry = 'syslumennOnEntry',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorValue = { [key: string]: any }

// TODO: this value should be fetched from the API at some point
export const DEFAULT_TAX_FREE_LIMIT = 6_203_409
