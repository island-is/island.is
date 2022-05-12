import { IdTokenClaims, User as OidcUser } from 'oidc-client-ts'

interface IdsAuthClaims {
  nationalId: string
  name: string
  nat: string
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
  delegationType?: string[]
  dateOfBirth?: Date
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IdTokenClaims & IdsAuthClaims
}
