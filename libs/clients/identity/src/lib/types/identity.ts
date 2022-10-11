import { IdentityType } from './identityType'
import { Address } from './address'

export interface Identity {
  nationalId: string
  name: string
  address?: Address
  type: IdentityType
}
