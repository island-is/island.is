import { DefaultEvents } from '@island.is/application/types'

export type Options = {
  label: string
  value: string
}[]

export type Config = { key: string; value: string }

export enum FSIUSERTYPE {
  INDIVIDUAL = 150000000,
  PARTY = 150000001,
  CEMETRY = 150000002,
}

export type BoardMember = {
  nationalId: string
  name: string
  role: string
}

export enum ApiActions {
  getUserType = 'getUserType',
  submitApplication = 'submitApplication',
}

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}
