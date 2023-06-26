import { IdTokenClaims, User as OidcUser } from 'oidc-client-ts'
import { AuthDelegationType } from './delegation'

interface IdsAuthClaims {
  nationalId: string
  name: string
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
  subjectType: 'person' | 'legalEntity'
  delegationType?: AuthDelegationType[]
  dateOfBirth?: Date
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IdTokenClaims & IdsAuthClaims
}
