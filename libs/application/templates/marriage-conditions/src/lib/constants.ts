import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.ASSIGN }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  SPOUSE_CONFIRM = 'spouse_confirm',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNED_SPOUSE = 'assigned_spouse',
}

export enum CeremonyPlaces {
  office = 'office',
  society = 'society',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  assignSpouse = 'assignSpouse',
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  id: string
}

export type Religion = {
  name: string
  code: string
}

export const twoDays = 24 * 3600 * 1000 * 2
export const sixtyDays = 24 * 3600 * 1000 * 60

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}
