import { DefaultEvents } from '@island.is/application/core'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  CONFIRM = 'CONFIRM',
  DONE = 'DONE',
}
export enum Roles {
  SCHOOL_EMPLOYEE = 'school_employee',
}

export const YES = 'yes'
export const NO = 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const drivingSchools = [
  {
    label: 'Ökuskóli 1',
    value: 1,
  },
  {
    label: 'Ökuskóli 2',
    value: 2,
  },
  {
    label: 'Ökuskóli 3',
    value: 3,
  },
]
