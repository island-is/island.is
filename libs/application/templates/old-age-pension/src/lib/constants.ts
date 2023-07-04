import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'
export const oldAgePensionAge = 67
export const earlyRetirementMinAge = 65
export const earlyRetirementMaxAge = 66
export const fishermenMinAge = 60
export const fishermenMaxAge = 66
export const IS = 'IS'

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

export enum ConnectedApplications {
  HOMEALLOWANCE = 'homeAllowance',
  CHILDPENSION = 'childPension',
}

export enum HomeAllowanceHousing {
  HOUSEOWNER = 'houseOwner',
  RENTER = 'renter',
}

export enum AnswerValidationConstants {
  PERIOD = 'period',
  FILEUPLOADPENEARLYFISHER = 'fileUploadEarlyPenFisher',
  FILEUPLOADHOMEALLOWANCE = 'fileUploadHomeAllowance',
}

export enum ApplicationType {
  RETIREMENTPENSION = 'retirementPension',
  HALFRETIREMENTPENSION = 'halfRetirementPension',
  FISHERMEN = 'fishermen',
}
