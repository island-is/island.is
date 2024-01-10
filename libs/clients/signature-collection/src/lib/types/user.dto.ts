import { ReasonKey } from '../signature-collection.types'
import { Area } from './area.dto'
import { Candidate } from './candidate.dto'
import { List } from './list.dto'
import { Signature } from './signature.dto'

export interface UserBase {
  nationalId: string
  name: string
}

export interface Signee extends UserBase {
  electionName: string
  canSign: boolean
  canSignInfo?: ReasonKey[]
  canCreate: boolean
  canCreateInfo?: ReasonKey[]
  isOwner: boolean
  area?: Omit<Area, 'min' | 'max'>
  signature?: Signature
  ownedLists: List[]
  candidate?: Candidate
}
