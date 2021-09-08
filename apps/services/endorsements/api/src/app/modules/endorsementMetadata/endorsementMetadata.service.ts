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
  EndorsementMetaField,
  MetadataInput,
  MetadataProviderField,
  MetadataProviderResponse,
  MetadataProviderService,
} from './types'
import {
  TemporaryVoterRegistryResponse,
  TemporaryVoterRegistryService,
} from './providers/temporaryVoterRegistry/temporaryVoterRegistry.service'
import type { Auth } from '@island.is/auth-nest-tools'

interface ExecuteProvidersInput {
  providers: MetadataProviderService
  input: MetadataInput
}

@Injectable()
export class EndorsementMetadataService {
  fieldToProviderMap: MetadataProviderField
  constructor(
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

  findProvidersByRequestedMetadataFields(fields: EndorsementMetaField[]) {
    return fields.reduce((providers, field) => {
      // this is where we assign metadata key that is returned in final results object
      const metadataKey = this.fieldToProviderMap[field].provider.metadataKey
      return {
        ...providers,
        [metadataKey]: this.fieldToProviderMap[field].provider,
      }
    }, {} as MetadataProviderService)
  }

  async executeProviders(
    { providers, input }: ExecuteProvidersInput,
    auth?: Auth,
  ) {
    // execute all provided providers
    const metadataRequests = Object.entries(providers).map(
      async ([providerKey, provider]) => ({
        [providerKey]: await provider.getData(input, auth),
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

  mapProviderDataToFields(
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

  pruneMetadataFields(
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

  async getMetadata(
    input: MetadataInput,
    auth?: Auth,
  ): Promise<EndorsementMetadata> {
    const providers = this.findProvidersByRequestedMetadataFields(input.fields)
    const providerData = await this.executeProviders({ providers, input }, auth)
    return this.mapProviderDataToFields(input.fields, providerData)
  }
}
