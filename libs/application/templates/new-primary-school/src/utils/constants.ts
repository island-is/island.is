import { DefaultEvents } from '@island.is/application/types'

export const FIRST_GRADE_AGE = 6
export const TENTH_GRADE_AGE = 16

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }

export enum ApiModuleActions {
  getChildInformation = 'getChildInformation',
  getPreferredSchool = 'getPreferredSchool',
  sendApplication = 'sendApplication',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION_REVIEWER = 'organizationReviewer',
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
  Aide = 'aide',
  Counselor = 'counselor',
  Guardian = 'guardian',
  Member = 'member',
  Principal = 'principal',
  Student = 'student',
  Teacher = 'teacher',
}

export enum AgentType {
  EmergencyContact = 'emergencyContact',
  Guardian = 'guardian',
  Sibling = 'sibling',
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

// TODO: Taka út? Er þetta nokkuð notað eftir að nýja subType kemur frá Júní?
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

export enum OrganizationSubType {
  SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT = 'specialEducationBehaviorDepartment',
  SPECIAL_EDUCATION_BEHAVIOR_SCHOOL = 'specialEducationBehaviorSchool',
  SPECIAL_EDUCATION_DISABILITY_DEPARTMENT = 'specialEducationDisabilityDepartment',
  SPECIAL_EDUCATION_DISABILITY_SCHOOL = 'specialEducationDisabilitySchool',
  INTERNATIONAL_SCHOOL = 'internationalSchool',
  GENERAL_SCHOOL = 'generalSchool',
}

export enum OrganizationSector {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
