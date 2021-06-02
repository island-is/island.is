// TODO: Fix this type

import { EndorsementSystemSignedListsResponse } from '../providers/endorsementSystemSignedLists.service'
import { NationalRegistryUserResponse } from '../providers/nationalRegistryUser.service'

// add types for new metadata providers here
export type MetadataProviderResponse = {
  [key: string]:
    | NationalRegistryUserResponse
    | EndorsementSystemSignedListsResponse
}

export interface MetadataInput {
  fields: EndorsementMetaField[]
  nationalId: string
}

export type MetadataProviderService = {
  [providerKey in EndorsementMetaField]: MetadataProvider
}

export type MetadataProviderField = {
  [providerKey in EndorsementMetaField]: {
    provider: MetadataProvider
    dataResolver: (input: MetadataProviderResponse) => any
  }
}

export interface MetadataProvider {
  metadataKey: string
  getData: (
    input: MetadataInput,
  ) => Promise<MetadataProviderResponse[keyof MetadataProviderResponse]>
}

// add types for new metadata fields here
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
  SIGNED_TAGS = 'signedTags',
}
