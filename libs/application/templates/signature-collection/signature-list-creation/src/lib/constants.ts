import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export type SubmitResponse = {
  success: boolean
  orderId?: string[]
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const CountryAreas = [
  'Sunnlendingafjórðungur',
  'Vestfirðingafjórðungur',
  'Norðlendingafjórðungur',
  'Austfirðingafjórðungur',
]
