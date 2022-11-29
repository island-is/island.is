import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}
