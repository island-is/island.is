import { DefaultEvents } from '@island.is/application/types'

export enum U2Events {
  REVOKE = 'REVOKE',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
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
}

export enum ApiActions {
  getEligibility = 'getEligibility',
  getEESCountries = 'getEESCountries',
}
