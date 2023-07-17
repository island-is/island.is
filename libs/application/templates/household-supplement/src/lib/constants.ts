import { DefaultEvents } from '@island.is/application/types'
import { householdSupplementFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export const MONTHS = [
  { value: 'January', label: householdSupplementFormMessage.months.january },
  { value: 'February', label: householdSupplementFormMessage.months.february },
  { value: 'March', label: householdSupplementFormMessage.months.march },
  { value: 'April', label: householdSupplementFormMessage.months.april },
  { value: 'May', label: householdSupplementFormMessage.months.may },
  { value: 'June', label: householdSupplementFormMessage.months.june },
  { value: 'July', label: householdSupplementFormMessage.months.july },
  { value: 'August', label: householdSupplementFormMessage.months.august },
  {
    value: 'September',
    label: householdSupplementFormMessage.months.september,
  },
  { value: 'October', label: householdSupplementFormMessage.months.october },
  { value: 'November', label: householdSupplementFormMessage.months.november },
  { value: 'December', label: householdSupplementFormMessage.months.desember },
]
