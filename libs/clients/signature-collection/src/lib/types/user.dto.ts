import { ReasonKey } from '../signature-collection.types'
import { Area } from './area.dto'
import { Candidate } from './candidate.dto'
import { ListBase } from './list.dto'
import { Signature } from './signature.dto'

export interface UserBase {
  nationalId: string
  name: string
}

export interface CandidateLookup extends UserBase {
  canCreate: boolean
  canCreateInfo?: ReasonKey[]
}

export interface PartyBallotLetterInfo {
  name?: string
  letter?: string
}

export interface Signee extends CandidateLookup {
  electionName: string
  canSign: boolean
  canSignInfo?: ReasonKey[]
  canCreate: boolean
  canCreateInfo?: ReasonKey[]
  isOwner: boolean
  area?: Omit<Area, 'min' | 'max'>
  signatures?: Signature[]
  ownedLists: ListBase[]
  candidate?: Candidate
  hasPartyBallotLetter?: boolean
  partyBallotLetterInfo?: PartyBallotLetterInfo
}
