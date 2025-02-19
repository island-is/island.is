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
  iss: string
  email?: string
  phone_number?: string
}

export type BffUser = {
  scopes: string[]
  profile: IdTokenClaims
}
