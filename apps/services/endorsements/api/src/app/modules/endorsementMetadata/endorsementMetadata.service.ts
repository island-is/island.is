import { Injectable } from '@nestjs/common'
import { EndorsementMetadata } from './endorsementMetadata.model'
import {
  EndorsementSystemSignedListsResponse,
  EndorsementSystemSignedListsService,
} from './providers/endorsementSystem/endorsementSystemSignedLists.service'
import {
  NationalRegistryUserResponse,
  NationalRegistryUserService,
} from './providers/nationalRegistry/nationalRegistryUser.service'
import {
  TemporaryVoterRegistryResponse,
  TemporaryVoterRegistryService,
} from './providers/temporaryVoterRegistry/temporaryVoterRegistry.service'

interface MetadataInput {
  fields: EndorsementMetaField[]
  nationalId: string
}
type MetadataProviderField = {
  [providerKey in EndorsementMetaField]: {
    provider: MetadataProvider
    dataResolver: (input: MetadataProviderResponse) => any
  }
}
type MetadataProviderService = {
  [providerKey in EndorsementMetaField]: MetadataProvider
}
export interface MetadataProvider {
  metadataKey: string
  getData: (
    input: MetadataInput,
  ) => Promise<MetadataProviderResponse[keyof MetadataProviderResponse]>
}

// add types for new metadata providers here
type MetadataProviderResponse = {
  [key: string]:
    | NationalRegistryUserResponse
    | EndorsementSystemSignedListsResponse
    | TemporaryVoterRegistryResponse
}

// add types for new metadata fields here
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
  SIGNED_TAGS = 'signedTags',
  VOTER_REGION = 'voterRegion',
}

@Injectable()
export class EndorsementMetadataService {
  fieldToProviderMap: MetadataProviderField
  constructor (
    private readonly nationalRegistryUserService: NationalRegistryUserService,
    private readonly endorsementSystemSignedListsService: EndorsementSystemSignedListsService,
    private readonly temporaryVoterRegistryService: TemporaryVoterRegistryService,
  ) {
    /**
     * We should assign minimal data to each metadata field since they optionally get appended to endorsements
     * Each data provider is called once
     */
    this.fieldToProviderMap = {
      [EndorsementMetaField.FULL_NAME]: {
        provider: this.nationalRegistryUserService,
        dataResolver: ({ nationalRegistryUser }) =>
          (nationalRegistryUser as NationalRegistryUserResponse).fullName,
      },
      [EndorsementMetaField.ADDRESS]: {
        provider: this.nationalRegistryUserService,
        dataResolver: ({ nationalRegistryUser }) =>
          (nationalRegistryUser as NationalRegistryUserResponse).address,
      },
      [EndorsementMetaField.SIGNED_TAGS]: {
        provider: this.endorsementSystemSignedListsService,
        dataResolver: ({ endorsementListSignedTags }) =>
          (endorsementListSignedTags as EndorsementSystemSignedListsResponse)
            .tags,
      },
      [EndorsementMetaField.VOTER_REGION]: {
        provider: this.temporaryVoterRegistryService,
        dataResolver: ({ temporaryVoterRegistry }) =>
          temporaryVoterRegistry as TemporaryVoterRegistryResponse,
      },
    }
  }

  findProvidersByRequestedMetadataFields (fields: EndorsementMetaField[]) {
    return fields.reduce((providers, field) => {
      // this is where we assign metadata key that is returned in final results object
      const metadataKey = this.fieldToProviderMap[field].provider.metadataKey
      return {
        ...providers,
        [metadataKey]: this.fieldToProviderMap[field].provider,
      }
    }, {} as MetadataProviderService)
  }

  async executeProviders (
    providers: MetadataProviderService,
    input: MetadataInput,
  ) {
    // execute all provided providers
    const metadataRequests = Object.entries(providers).map(
      async ([providerKey, provider]) => ({
        [providerKey]: await provider.getData(input),
      }),
    )

    // wait for all requests to finish
    const metadataResponses = await Promise.all(metadataRequests)

    // merge all objects into a flat key/value object
    return metadataResponses.reduce(
      (metadata, metadataResponse) => ({ ...metadata, ...metadataResponse }),
      {},
    ) as MetadataProviderResponse
  }

  mapProviderDataToFields (
    fields: EndorsementMetaField[],
    providerData: MetadataProviderResponse,
  ): EndorsementMetadata {
    return fields.reduce(
      (metadata, fieldName) => ({
        ...metadata,
        [fieldName]: this.fieldToProviderMap[fieldName].dataResolver(
          providerData,
        ),
      }),
      {} as EndorsementMetadata,
    )
  }

  pruneMetadataFields (
    allMetadataFields: EndorsementMetadata,
    fieldsToKeep: EndorsementMetaField[],
  ): EndorsementMetadata {
    // some meta fields are only required for validation and should not be persisted, we remove them here
    return Object.entries(allMetadataFields).reduce(
      (metadata, [metadataKey, metadataValue]) =>
        fieldsToKeep.includes(metadataKey as EndorsementMetaField)
          ? {
              ...metadata,
              [metadataKey]: metadataValue,
            }
          : metadata,
      {} as EndorsementMetadata,
    )
  }

  async getMetadata (input: MetadataInput): Promise<EndorsementMetadata> {
    const requiredProviders = this.findProvidersByRequestedMetadataFields(
      input.fields,
    )
    const providerData = await this.executeProviders(requiredProviders, input)
    return this.mapProviderDataToFields(input.fields, providerData)
  }
}
