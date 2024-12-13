import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
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
