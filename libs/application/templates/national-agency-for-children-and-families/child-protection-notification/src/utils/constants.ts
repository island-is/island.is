import { DefaultEvents } from '@island.is/application/types'

export const RISK_TO_UNBORN = 'RiskToUnborn'
export const IS = 'IS'

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

export enum ApiModuleActions {
  getCategories = 'getCategories',
  getProtectiveFactors = 'getProtectiveFactors',
  getGenders = 'getGenders',
  getChildInformation = 'getChildInformation',
  getPostalCodes = 'getPostalCodes',
  createNotification = 'createNotification',
  completeNotification = 'completeNotification',
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

export const DO_NOT_KNOW = 'doNotKnow'
export const NOT_APPLICABLE = 'notApplicable'

export const SCHOOL_TYPES = ['kindergarten', 'elementarySchool', 'highSchool']

export enum LanguageEnvironmentOptions {
  ONLY_ICELANDIC = 'onlyIcelandic',
  ICELANDIC_AND_OTHER = 'icelandicAndOther',
  ONLY_OTHER = 'onlyOtherThanIcelandic',
}

export const SHOW_LANGUAGE_SECTION_TYPES = [
  LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
  LanguageEnvironmentOptions.ONLY_OTHER,
]
