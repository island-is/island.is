import { Area } from './area.dto'
import { List } from './list.dto'
import { Signature } from './signature.dto'

export interface UserBase {
  nationalId: string
  name: string
}

export interface Signee extends UserBase {
  electionName: string
  canSign: boolean
  canSignInfo?: string[]
  canCreate: boolean
  canCreateInfo?: string[]
  isOwner: boolean
  area?: Omit<Area, 'min' | 'max'>
  signature: Signature | null
  ownedLists: List[]
}
