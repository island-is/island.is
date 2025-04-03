import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getUserType = 'getUserType',
  submitApplication = 'submitApplication',
}

export enum FSIUSERTYPE {
  INDIVIDUAL = 150000000,
  PARTY = 150000001,
  CEMETRY = 150000002,
}

export type Options = {
  label: string
  value: string
}[]

export type Elections = {
  electionId: string
  name: string
  electionDate: string
  genitiveName: string
  __typename?: string
}

export type ElectionsResponse = {
  financialStatementsInaoElections: Array<Elections>
}
