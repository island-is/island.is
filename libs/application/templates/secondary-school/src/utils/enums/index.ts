import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT | DefaultEvents.EDIT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'inReview',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANISATION_REVIEWER = 'mms',
}

export enum ApiActions {
  validateCanCreate = 'validateCanCreate',
  submitApplication = 'submitApplication',
  deleteApplication = 'deleteApplication',
}

export enum Routes {
  PERSONAL = 'personalMultiField',
  CUSTODIAN = 'custodianMultiField',
  EXTRA_INFORMATION = 'extraInformationMultiField',
  SCHOOL = 'schoolMultiField',
}

export enum ApplicationType {
  FRESHMAN = 'FRESHMAN',
  GENERAL_APPLICATION = 'GENERAL_APPLICATION',
}

export enum ConclusionView {
  DEFAULT = 'DEFAULT',
  OVERVIEW = 'OVERVIEW',
}
