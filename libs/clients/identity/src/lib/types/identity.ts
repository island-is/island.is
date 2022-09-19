import { IdentityType } from '../identity.type'
import { Address } from './address'

export interface Identity {
  nationalId: string
  name: string
  address?: Address
  type: IdentityType
}
