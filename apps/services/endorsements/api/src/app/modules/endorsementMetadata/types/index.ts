import { EndorsementSystemSignedListsResponse } from '../providers/endorsementSystem/endorsementSystemSignedLists.service'
import { TemporaryVoterRegistryResponse } from '../providers/temporaryVoterRegistry/temporaryVoterRegistry.service'
import { NationalRegistryUserResponse } from '../providers/nationalRegistry/nationalRegistry.service'
import type { Auth } from '@island.is/auth-nest-tools'

// add types for new metadata providers here
export type MetadataProviderResponse = {
  [key: string]:
    | NationalRegistryUserResponse
    | EndorsementSystemSignedListsResponse
    | TemporaryVoterRegistryResponse
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
    auth: Auth,
  ) => Promise<MetadataProviderResponse[keyof MetadataProviderResponse]>
}

// add types for new metadata fields here
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
  SIGNED_TAGS = 'signedTags',
  VOTER_REGION = 'voterRegion',
}
