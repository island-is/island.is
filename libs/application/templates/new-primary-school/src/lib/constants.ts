import { DefaultEvents } from '@island.is/application/types'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum ApiModuleActions {
  getChildInformation = 'getChildInformation',
  sendApplication = 'sendApplication',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ReasonForApplicationOptions {
  MOVING_MUNICIPALITY = 'movingMuniciplaity',
  SIBLINGS_IN_SAME_SCHOOL = 'siblingsInSameSchool',
}

export enum OptionsType {
  PRONOUN = 'pronoun',
  GENDER = 'gender',
  FOOD_ALLERGY_AND_INTOLERANCE = 'foodAllergyAndIntolerance',
  REASON = 'registrationReason',
  REASON_INTERNATIONAL_SCHOOL = 'registrationReasonInternationalSchool',
  REASON_PRIVATE_SCHOOL = 'registrationReasonPrivateSchool',
  RELATION = 'relation',
  SCHOOL_MEAL = 'schoolMeal',
  ALLERGY = 'allergy',
  LANGUAGE_ENVIRONMENT = 'languageEnvironment',
}

export enum MembershipRole {
  Admin = 'admin',
  Guardian = 'guardian',
  Parent = 'parent',
  Principal = 'principal',
  Relative = 'relative',
  Student = 'student',
  Teacher = 'teacher',
}

export enum MembershipOrganizationType {
  Municipality = 'municipality',
  National = 'national',
  School = 'school',
}

export enum LanguageEnvironmentOptions {
  ONLY_ICELANDIC = 'onlyIcelandic',
  ICELANDIC_AND_OTHER = 'icelandicAndOther',
  ONLY_OTHER_THAN_ICELANDIC = 'onlyOtherThanIcelandic',
}

export enum ApplicationType {
  NEW_PRIMARY_SCHOOL = 'newPrimarySchool',
  ENROLLMENT_IN_PRIMARY_SCHOOL = 'enrollmentInPrimarySchool',
}
