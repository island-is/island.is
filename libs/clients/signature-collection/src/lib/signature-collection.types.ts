export interface GetListInput {
  areaId?: string
  nationalId?: string
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

export enum Requirement {
  medAldur = 'medAldur',
  medIsRikisfang = 'medIsRikisfang',
  byrAIsl = 'byrAIsl',
  bjoAIslNylega = 'bjoAIslNylega',
  bjoAIslUmsokn = 'bjoAIslUmsokn',
}

export enum ReasonKey {
  UnderAge = 'underAge',
  NoCitizenship = 'noCitizenship',
  NotInArea = 'notInArea',
  NotCurrentISResidency = 'noCurrenttISResidency',
  NotRecentISResidency = 'notRecentISResidency',
  NotISResidency = 'notISResidency',
  DeniedByService = 'deniedByService',
  CollectionNotOpen = 'collectionNotOpen',
  NoListToRemove = 'noListToRemove',
}
