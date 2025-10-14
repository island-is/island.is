import { DefaultEvents } from '@island.is/application/types'

export const FIRST_GRADE_AGE = 6
export const TENTH_GRADE_AGE = 16

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYER_APPROVAL = 'payerApproval',
  PAYER_REJECTED = 'payerRejected',
  SUBMITTED = 'submitted',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum ApiModuleActions {
  getChildInformation = 'getChildInformation',
  getPreferredSchool = 'getPreferredSchool',
  sendApplication = 'sendApplication',
  assignPayer = 'assignPayer',
  notifyApplicantOfRejectionFromPayer = 'notifyApplicantOfRejectionFromPayer',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION_REVIEWER = 'organizationReviewer',
  ASSIGNEE = 'assignee',
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
  ALLERGY = 'allergy',
  LANGUAGE_ENVIRONMENT = 'languageEnvironment',
}

export enum AffiliationRole {
  Member = 'member',
  Guardian = 'guardian',
  Parent = 'parent',
  Principal = 'principal',
  Relative = 'relative',
  Student = 'student',
  Teacher = 'teacher',
}

export enum OrganizationType {
  ChildCare = 'childCare',
  Municipality = 'municipality',
  National = 'national',
  PrivateOwner = 'privateOwner',
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

export enum SchoolType {
  PUBLIC_SCHOOL = 'publicSchool',
  PRIVATE_SCHOOL = 'privateSchool',
  INTERNATIONAL_SCHOOL = 'internationalSchool',
  NURSERY_SCHOOL = 'nurserySchool',
}

export enum CaseWorkerInputTypeEnum {
  CaseManager = 'caseManager',
  SupportManager = 'supportManager',
}

export enum PayerOption {
  APPLICANT = 'applicant',
  OTHER = 'other',
}
