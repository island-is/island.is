import { DefaultEvents } from '@island.is/application/types'

export enum U2Events {
  REVOKE = 'REVOKE',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: ApplicationEvents.REVIEW }
  | { type: U2Events.REVOKE }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  REVIEW = 'review',
  REVOKED = 'revoked',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANISATION_REVIEWER = 'organisationReviewer',
}

export enum ApiActions {
  getEligibility = 'getEligibility',
  getEESCountries = 'getEESCountries',
  revokeApplication = 'revokeApplication',
}

export enum ApplicationEvents {
  REJECT = 'REJECT',
  REVOKE = 'REVOKE',
  APPROVE = 'APPROVE',
  REVIEW = 'REVIEW',
}

export interface Country {
  id: string
  abbr: string
  name: string
  english: string
  otherId: number
  orderNumber: number
  isInTheEUAndOrEEA: boolean
}
