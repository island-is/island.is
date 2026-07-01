import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  NOT_ALLOWED = 'notAllowed',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOT_ALLOWED = 'notAllowed',
}
