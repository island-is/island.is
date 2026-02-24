import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAYMENT = 'payment',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  checkParticipantAvailability = 'checkParticipantAvailability',
}

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}

export const COURSE_HAS_CHARGE_ITEM_CODE = 'courseHasChargeItemCode'
