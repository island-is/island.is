import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PREREQUISITES = 'prerequisites',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export type SubmitResponse = {
  success: boolean
  orderId?: string[]
}

export enum ApiActions {
  submitApplication = 'createLists',
}

export type Manager = {
  manager: {
    name: string
    nationalId: string
  }
  constituency: string
}

export type Supervisor = {
  supervisor: {
    name: string
    nationalId: string
  }
  constituency: string
}

// These will be fetched later
export const Constituencies = [
  'Norðvesturkjördæmi',
  'Norðausturkjördæmi',
  'Suðurkjördæmi',
  'Suðvesturkjördæmi',
  'Reykjavíkurkjördæmi suður',
  'Reykjavíkurkjördæmi norður',
]
