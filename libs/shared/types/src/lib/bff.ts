import { AuthDelegationType } from './delegation'

export interface IdTokenClaims {
  // Session ID
  sid: string
  // Birthdate in the format YYYY-MM-DD
  birthdate?: string
  nationalId: string
  name: string
  // Identity provider
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
  subjectType: 'person' | 'legalEntity'
  delegationType?: AuthDelegationType[]
  locale?: string
}

export type BffUser = {
  // User scope unparsed here for backwards compatibility
  scope: string
  scopes: string[]
  profile: IdTokenClaims & {
    dateOfBirth?: Date
  }
}
