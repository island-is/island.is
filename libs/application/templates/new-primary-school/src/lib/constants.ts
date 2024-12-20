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
  TRANSFER_OF_LEGAL_DOMICILE = 'transferOfLegalDomicile',
  STUDY_STAY_FOR_PARENTS = 'studyStayForParents',
  PARENTS_PARLIAMENTARY_MEMBERSHIP = 'parentsParliamentaryMembership',
  TEMPORARY_FROSTER = 'temporaryFoster',
  EXPERT_SERVICE = 'expertService',
  SICKLY = 'sickly',
  LIVES_IN_TWO_HOMES = 'livesInTwoHomes',
  SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL = 'siblingsInTheSamePrimarySchool',
  MOVING_ABROAD = 'movingAbroad',
  OTHER_REASONS = 'otherReasons',
}

export enum SiblingRelationOptions {
  SIBLING = 'sibling',
  HALF_SIBLING = 'halfSibling',
  STEP_SIBLING = 'stepSibling',
}

export enum OptionsType {
  PRONOUN = 'pronoun',
  GENDER = 'gender',
  INTOLERANCE = 'intolerence',
  REASON = 'rejectionReason',
  RELATION = 'relation',
  ALLERGY = 'allergy',
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
