import { IdentityType } from './identityType'
import { Address } from './address'

export interface Identity {
  nationalId: string
  name: string
  givenName?: string | null
  familyName?: string | null
  address?: Address
  type: IdentityType
}
