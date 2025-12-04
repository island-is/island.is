import { DefaultEvents } from '@island.is/application/types'

export const FIRST_GRADE_AGE = 6
export const TENTH_GRADE_AGE = 16

export const NU_UNIT_ID = 'G-2236-A'

export const RVK_MUNICIPALITY_ID = '0000'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  OTHER_GUARDIAN_APPROVAL = 'otherGuardianApproval',
  OTHER_GUARDIAN_REJECTED = 'otherGuardianRejected',
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
  assignOtherGuardian = 'assignOtherGuardian',
  notifyApplicantOfRejectionFromOtherGuardian = 'notifyApplicantOfRejectionFromOtherGuardian',
  assignPayer = 'assignPayer',
  notifyApplicantOfRejectionFromPayer = 'notifyApplicantOfRejectionFromPayer',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION_REVIEWER = 'organizationReviewer',
  ASSIGNEE = 'assignee',
}

export enum ReasonForApplicationOptions {
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
  REASON_SPECIAL_EDUCATION = 'registrationReasonSpecialEducation',
  DIAGNOSIS_SPECIALIST = 'diagnosisSpecialist',
  PROFESSIONAL = 'professional',
  CHILD_AND_ADOLESCENT_MENTAL_HEALTH_SERVICE = 'childAndAdolescentMentalHealthService',
  SERVICE_CENTER = 'serviceCenter',
  ASSESSOR = 'assessor',
  CHILD_AND_ADOLESCENT_MENTAL_HEALTH_DEPARTMENT = 'childAndAdolescentMentalHealthDepartment',
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
  NEW_PRIMARY_SCHOOL = 'newPrimarySchool', // Umsókn um skólaskipti
  ENROLLMENT_IN_PRIMARY_SCHOOL = 'enrollmentInPrimarySchool', // Innritun í 1. bekk
  CONTINUING_ENROLLMENT = 'continuingEnrollment', // Umsókn um áframhaldandi skólavist
}

export enum CaseWorkerInputTypeEnum {
  CaseManager = 'caseManager',
  SupportManager = 'supportManager',
}

export enum OrganizationSubType {
  SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT = 'specialEducationBehaviorDepartment', // Sérdeild - Hegðun
  SPECIAL_EDUCATION_BEHAVIOR_SCHOOL = 'specialEducationBehaviorSchool', // Sérskóli - Hegðun
  SPECIAL_EDUCATION_DISABILITY_DEPARTMENT = 'specialEducationDisabilityDepartment', // Sérdeild - Fötlun
  SPECIAL_EDUCATION_DISABILITY_SCHOOL = 'specialEducationDisabilitySchool', // Sérskóli - Fötlun
  INTERNATIONAL_SCHOOL = 'internationalSchool',
  GENERAL_SCHOOL = 'generalSchool',
}

export enum OrganizationSector {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ApplicationFeatureConfigType {
  REGISTRATION = 'registration',
}

export enum PayerOption {
  APPLICANT = 'applicant',
  OTHER = 'other',
}

export enum ApplicationFeatureKey {
  CONSENTS = 'consents',
  APPLICANT_INFO = 'applicant_info',
  GUARDIANS = 'guardians',
  EMERGENCY_CONTACTS = 'emergency_contacts',
  CURRENT_ORGANIZATION = 'current_organization',
  APPLICATION_REASON = 'application_reason',
  SIBLINGS = 'siblings',
  TIMEFRAME = 'timeframe',
  LANGUAGE_INFO = 'language_info',
  HEALTH_INFO = 'health_info',
  SOCIAL_INFO = 'social_info',
  CHILD_CIRCUMSTANCES = 'child_circumstances',
  PAYMENT_INFO = 'payment_info',
  TERMS = 'terms',
  ATTACHMENTS = 'attachments',
  ADDITIONAL_REQUESTORS = 'additional_requestors',
}
