import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  CONFIRM = 'CONFIRM',
  DONE = 'DONE',
}
export enum Roles {
  SCHOOL_EMPLOYEE = 'school_employee',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}
