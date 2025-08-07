import { EinstaklingurMaFrambodInfo, MedmaeliDTO } from '../../gen/fetch'
import { Area } from './types/area.dto'
import { CollectionType } from './types/collection.dto'
import { ListBase } from './types/list.dto'
import { Signature } from './types/signature.dto'

export enum ListState {
  Open = 'open',
  Closed = 'closed',
}
export interface GetListInput {
  areaId?: string
  nationalId?: string
  candidateId?: string
  collectionId?: string
  collectionType?: CollectionType
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
  collectionType: CollectionType
  areas?: AreaInput[]
  listName?: string
  collectionName?: string
}

// Should replace CreateListInput once refactored to new ÞÍ endpoints
export interface AddListsInput {
  collectionId: string
  candidateId: string
  collectionType: CollectionType
  areas?: AreaInput[]
}

export enum MandateType {
  Unknown,
  Owner,
  Guarantor, // is: Ábyrgðaraðili
  Administrator, // is: Umsjónaraðili
}

export interface AgentInput {
  nationalId: string
  phoneNumber: string
  email: string
  mandateType: MandateType
  areas: AreaInput[]
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
  collectionType: CollectionType
  isActive?: boolean
  ownedLists: ListBase[]
  areas: Area[]
}

export interface CanSignInput {
  requirementsMet?: boolean
  canSignInfo?: EinstaklingurMaFrambodInfo
  activeSignature?: MedmaeliDTO
  signatures?: Signature[]
}

export enum Requirement {
  aldur = 'aldur',
  rikisfang = 'rikisfang',
  buseta = 'buseta',
  ekkiBuseta = 'ekkiBuseta',
  active = 'active',
  notOwner = 'notOwner',
  notSigned = 'notSigned',
  noInvalidSignature = 'noInvalidSignature',
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
  noInvalidSignature = 'noInvalidSignature',
  notFound = 'notFound',
}
