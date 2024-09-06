import { AuthDelegationType } from './delegation'

export interface IdTokenClaims {
  // Issuer
  iss: string

  // Not before (timestamp)
  nbf: number

  // Issued at (timestamp)
  iat: number

  // Expiration time (timestamp)
  exp: number

  // Audience
  aud: string

  // Authentication methods references
  amr: string[]

  // Access token hash
  at_hash: string

  // Session ID
  sid: string

  // Subject identifier
  sub: string

  // Authentication time (timestamp)
  auth_time: number

  // Identity provider
  idp: string

  // Authentication context class reference
  acr: string

  // Subject type (e.g., "person")
  subjectType: 'person' | 'legalEntity'

  // National ID
  nationalId: string

  // Full name
  name: string

  // Gender (e.g., "male")
  gender: string

  // Birthdate in the format YYYY-MM-DD
  birthdate: string

  // Locale (e.g., "is")
  locale: string

  actor?: {
    nationalId: string
    name: string
  }

  // Delegation type
  delegationType?: AuthDelegationType[]
}

export type BffUser = {
  // User scope property here for backwards compatibility
  scope: string
  scopes: string[]
  profile: IdTokenClaims & {
    dateOfBirth: Date
  }
}
