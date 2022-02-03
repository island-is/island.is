import { DefaultEvents } from '@island.is/application/core'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  REGISTRY = 'REGISTRY',
}
export enum Roles {
  INSTRUCTOR = 'instructor',
}

export const YES = 'yes'
export const NO = 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
}
