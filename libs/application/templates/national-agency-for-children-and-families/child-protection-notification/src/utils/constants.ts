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

export enum KnowsNationalId {
  YES = 'yes',
  NO = 'no',
  UNBORN = 'unborn',
}

export enum Pronoun {
  HANN = 'hann',
  HUN = 'hún',
  HAN = 'hán',
}

export enum NoNationalIdReason {
  EXPECTED_BUT_UNKNOWN = 'expectedButUnknown',
  TRAVELER = 'traveler',
  BORDER_RECEPTION = 'borderReception',
}
