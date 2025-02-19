import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOTALLOWED = 'notAllowed',
}

export type Config = { key: string; value: string }

export enum ApiActions {
  getUserType = 'getUserType',
  submitApplication = 'submitApplication',
}
