import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PREREQUISITES = 'prerequisites',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submit',
}
