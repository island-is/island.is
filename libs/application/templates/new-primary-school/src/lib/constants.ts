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

export enum Roles {
  APPLICANT = 'applicant',
}

export type Option = {
  value: string
  label: string
}

export enum RelationOptions {
  GRANDPARENTS = 'grandparents',
  SIBLINGS = 'siblings',
  STEP_PARENT = 'stepParent',
  RELATIVES = 'relatives',
  FRIENDS_AND_OTHER = 'friendsAndOther',
}
