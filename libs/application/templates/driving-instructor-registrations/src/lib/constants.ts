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

export const minutesOfDriving = [
  {
    label: '30',
    value: 30,
  },
  {
    label: '45',
    value: 45,
  },
  {
    label: '60',
    value: 60,
  },
  {
    label: '90',
    value: 90,
  },
]
