import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'
export const earlyRetirementMinAge = 65
export const earlyRetirementMaxAge = 66

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Agust',
  'September',
  'October',
  'November',
  'December',
]

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
}
