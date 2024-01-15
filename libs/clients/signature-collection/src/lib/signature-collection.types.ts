import { EinstaklingurMaFrambodInfo, MedmaeliDTO } from '../../gen/fetch'
import { List } from './types/list.dto'

export enum ListState {
  Open = 'open',
  Closed = 'closed',
}
export interface GetListInput {
  areaId?: string
  nationalId?: string
  candidateId?: string
  collectionId?: number
  onlyActive?: boolean
}

export interface OwnerInput {
  nationalId: string
  name: string
  phone: string
  email: string
}
export interface AreaInput {
  areaId: string
}

export interface CreateListInput {
  collectionId: string
  owner: OwnerInput
  areas?: AreaInput[]
}

export interface BulkUploadUser {
  pageNumber: number
  nationalId: string
}
export interface BulkUploadInput {
  listId: string
  upload: BulkUploadUser[]
}

export interface CanCreateInput {
  requirementsMet?: boolean
  canCreateInfo?: EinstaklingurMaFrambodInfo
  isPresidential: boolean
  isActive: boolean
  ownedLists: List[]
}

export interface CanSignInput {
  requirementsMet?: boolean
  canSignInfo?: EinstaklingurMaFrambodInfo
  isActive: boolean
  activeSignature?: MedmaeliDTO
}

export enum Requirement {
  aldur = 'aldur',
  rikisfang = 'rikisfang',
  buseta = 'buseta',
  active = 'active',
  notOwner = 'notOwner',
  notSigned = 'notSigned',
}

export enum ReasonKey {
  UnderAge = 'underAge',
  NoCitizenship = 'noCitizenship',
  NotInArea = 'notInArea',
  NotISResidency = 'notISResidency',
  DeniedByService = 'deniedByService',
  CollectionNotOpen = 'collectionNotOpen',
  NoListToRemove = 'noListToRemove',
  SignatureNotFound = 'signatureNotFound',
  AlreadyOwner = 'alreadyOwner',
  AlreadySigned = 'alreadySigned',
  NotOwner = 'notOwner',
}
