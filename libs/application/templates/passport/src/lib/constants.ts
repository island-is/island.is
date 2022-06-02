import { DefaultEvents } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export enum Services {
  REGULAR = 'regular',
  EXPRESS = 'express',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export const AUTH_TYPES = [
  { value: 'passport', label: 'Vegabréf' },
  { value: 'driving_license', label: 'Ökuskírteini' },
  { value: 'id_card', label: 'Nafnskírteini' },
  { value: 'none', label: 'Á ekki löggild skilríki' },
]

export const YES = 'yes'
export const NO = 'no'

export type Service = {
  type: Services
  dropLocation: string
  authentication: string
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  id: string
}
