import { IDTokenClaims, User as OidcUser } from 'oidc-client'

interface IdsAuthClaims {
  nationalId: string
  name: string
  nat: string
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IDTokenClaims & IdsAuthClaims
}
