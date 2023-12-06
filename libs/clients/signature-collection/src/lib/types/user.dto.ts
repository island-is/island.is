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
  canCreate: boolean
  isOwner: boolean
  area?: Area
  signature: Signature[]
  ownedLists: List[]
}
