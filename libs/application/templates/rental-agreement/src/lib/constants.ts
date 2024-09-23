export enum ApplicationStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  MUNCIPALITYNOTREGISTERED = 'muncipalityNotRegistered',
}

export const DAY = 24 * 3600 * 1000
export const MONTH = DAY * 31

export enum Routes {
  GENERALINFORMATION = 'generalInformation',
}

export enum Roles {
  APPLICANT = 'applicant',
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

export enum ApiActions {
  CREATEAPPLICATION = 'createApplication',
  CURRENTAPPLICATION = 'currentApplication',
}
