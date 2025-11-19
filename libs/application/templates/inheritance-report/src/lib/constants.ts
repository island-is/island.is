import { DefaultEvents } from '@island.is/application/types'
import { m } from './messages'

export const PREPAID_INHERITANCE = 'prepaidInheritance'
export const ESTATE_INHERITANCE = 'estateInheritance'

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

export const RelationSpouse = 'Maki'
export const RelationCharity = 'Almannaheillafélag'

export enum PrePaidInheritanceOptions {
  REAL_ESTATE = 'realEstate',
  STOCKS = 'stocks',
  MONEY = 'money',
  OTHER_ASSETS = 'otherAssets',
}

export const PrePaidHeirsRelations = [
  {
    value: PrePaidHeirsRelationTypes.SPOUSE,
    label: m.spouse,
  },
  {
    value: PrePaidHeirsRelationTypes.CHILD,
    label: m.child,
  },
  {
    value: PrePaidHeirsRelationTypes.SIBLING,
    label: m.sibling,
  },
  {
    value: PrePaidHeirsRelationTypes.PARENT,
    label: m.parent,
  },
  {
    value: PrePaidHeirsRelationTypes.OTHER,
    label: m.other,
  },
]

export type InheritanceReportEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  ESTATE_INHERITANCE_APPLICANT = 'estateInheritanceApplicant',
  PREPAID_INHERITANCE_APPLICANT = 'prepaidInheritanceApplicant',
}

export enum ApiActions {
  completeApplication = 'completeApplication',
  syslumennOnEntry = 'syslumennOnEntry',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorValue = { [key: string]: any }

// TODO: this value should be fetched from the API at some point
export const DEFAULT_TAX_FREE_LIMIT = 6_203_409
