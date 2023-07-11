import { DefaultEvents } from '@island.is/application/types'
import { oldAgePensionFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'
export const oldAgePensionAge = 67
export const earlyRetirementMinAge = 65
export const earlyRetirementMaxAge = 66
export const fishermenMinAge = 60
export const fishermenMaxAge = 66
export const IS = 'IS'
export const employeeRatio = 50

export const MONTHS = [
  { value: 'January', label: oldAgePensionFormMessage.period.january },
  { value: 'February', label: oldAgePensionFormMessage.period.february },
  { value: 'March', label: oldAgePensionFormMessage.period.march },
  { value: 'April', label: oldAgePensionFormMessage.period.april },
  { value: 'May', label: oldAgePensionFormMessage.period.may },
  { value: 'June', label: oldAgePensionFormMessage.period.june },
  { value: 'July', label: oldAgePensionFormMessage.period.july },
  { value: 'August', label: oldAgePensionFormMessage.period.august },
  {
    value: 'September',
    label: oldAgePensionFormMessage.period.september,
  },
  { value: 'October', label: oldAgePensionFormMessage.period.october },
  { value: 'November', label: oldAgePensionFormMessage.period.november },
  { value: 'December', label: oldAgePensionFormMessage.period.desember },
]

// export const MONTHS = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ]

export const FILE_SIZE_LIMIT = 5000000 // 5MB

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

export enum ConnectedApplications {
  HOUSEHOLDSUPPLEMENT = 'householdSupplement',
  CHILDPENSION = 'childPension',
}

export enum HouseholdSupplementHousing {
  HOUSEOWNER = 'houseOwner',
  RENTER = 'renter',
}

export enum AnswerValidationConstants {
  PERIOD = 'period',
  FILEUPLOADPENEARLYFISHER = 'fileUploadEarlyPenFisher',
  FILEUPLOADHOUSEHOLDSUPPLEMENT = 'fileUploadHouseholdSupplement',
  FILEUPLOADCHILDPENSION = 'fileUploadChildPension',
  EMPLOYMENT = 'employment',
  EMPLOYERS = 'employers',
  PAYMENTINFO = 'paymentInfo',
}

export enum taxLevelOptions {
  INCOME = 'income',
  FIRST_LEVEL = 'firstLevel',
  SECOND_LEVEL = 'secondLevel',
}

export enum ApplicationType {
  OLD_AGE_PENSION = 'oldAgePension',
  HALF_OLD_AGE_PENSION = 'halfOldAgePension',
  SAILOR_PENSION = 'sailorPension',
}

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}

export enum Employment {
  SELFEMPLOYED = 'selfEmployed',
  EMPLOYEE = 'employee',
}

export enum RatioType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}
