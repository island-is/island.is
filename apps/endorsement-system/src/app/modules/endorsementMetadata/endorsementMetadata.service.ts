import { Injectable } from '@nestjs/common'
import {
  NationalRegistryResponse,
  NationalRegistryService,
} from './providers/nationalRegistry.service'

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
export type EndorsementMetaData = {
  [key in EndorsementMetaField]?: any
}
export interface MetadataProvider {
  metadataKey: string
  getData: (
    input: MetadataInput,
  ) => Promise<MetadataProviderResponse[keyof MetadataProviderResponse]>
}

// add types for new metadata providers here
type MetadataProviderResponse = {
  [key in NationalRegistryService['metadataKey']]: NationalRegistryResponse
}

// add types for new metadata fields here
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
}

@Injectable()
export class EndorsementMetadataService {
  private fieldToProviderMap: MetadataProviderField
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {
    /**
     * We should assign minimal data to each metadata field since they optionally get appended to endorsements
     * Each data provider is called once
     */
    this.fieldToProviderMap = {
      [EndorsementMetaField.FULL_NAME]: {
        provider: this.nationalRegistryService,
        dataResolver: ({ nationalRegistry }) => nationalRegistry.fullName,
      },
      [EndorsementMetaField.ADDRESS]: {
        provider: this.nationalRegistryService,
        dataResolver: ({ nationalRegistry }) => nationalRegistry.address,
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

  mapProviderDataToFields(
    fields: EndorsementMetaField[],
    providerData: MetadataProviderResponse,
  ): EndorsementMetaData {
    return fields.reduce(
      (metadata, fieldName) => ({
        ...metadata,
        [fieldName]: this.fieldToProviderMap[fieldName].dataResolver(
          providerData,
        ),
      }),
      {},
    )
  }

  pruneMetadataFields(
    allMetadataFields: EndorsementMetaData,
    fieldsToKeep: EndorsementMetaField[],
  ): EndorsementMetaData {
    // some meta fields are only required for validation and should not be persisted, we remove them here
    return Object.entries(allMetadataFields).reduce(
      (metadata, [metadataKey, metadataValue]) =>
        fieldsToKeep.includes(metadataKey as EndorsementMetaField)
          ? {
              ...metadata,
              [metadataKey]: metadataValue,
            }
          : metadata,
      {},
    )
  }

  async getMetadata(input: MetadataInput): Promise<EndorsementMetaData> {
    const requiredProviders = this.findProvidersByRequestedMetadataFields(
      input.fields,
    )
    const providerData = await this.executeProviders(requiredProviders, input)
    return this.mapProviderDataToFields(input.fields, providerData)
  }
}
