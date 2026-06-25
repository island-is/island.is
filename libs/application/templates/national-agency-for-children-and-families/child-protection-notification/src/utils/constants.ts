import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum Roles {
  MINOR_APPLICANT = 'minorApplicant',
  ADULT_PERSONAL_APPLICANT = 'adultPersonalApplicant',
  ADULT_PROCURATION_APPLICANT = 'adultProcurationApplicant',
}
