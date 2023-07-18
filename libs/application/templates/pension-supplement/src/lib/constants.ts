import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}
