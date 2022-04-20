import { IDTokenClaims, User as OidcUser } from 'oidc-client'

interface IdsAuthClaims {
  nationalId: string
  dateOfBirth: Date
  name: string
  nat: string
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
  delegationType?: string[]
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IDTokenClaims & IdsAuthClaims
}
