import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  REGISTRY = 'REGISTRY',
}
export enum Roles {
  INSTRUCTOR = 'instructor',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const minutesSelection = [30, 45, 60, 90]

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
