import { Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  NationalRegistryResponse,
  NationalRegistryService,
} from './providers/nationalRegistry.service'

interface MetadataInput {
  fields: EndorsementMetaField[]
  nationalId: string
}
interface MetadataProvider {
  getData: (
    input: MetadataInput,
  ) => Promise<MetadataProviderResponse[keyof MetadataProviderResponse]>
}
// TODO: Use TS magic to extract types here
type MetadataProviderResponse = {
  [EndorsementProvider.NATIONAL_REGISTRY]: NationalRegistryResponse
}
type MetadataProviderField = {
  [providerKey in EndorsementMetaField]: {
    providerName: EndorsementProvider
    dataResolver: (input: MetadataProviderResponse) => any
  }
}
type MetadataProviderService = {
  [providerKey in EndorsementProvider]: MetadataProvider
}
export enum EndorsementProvider {
  NATIONAL_REGISTRY = 'nationalRegistry',
}
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
}
export type EndorsementMetaData = {
  [key in EndorsementMetaField]?: any
}

@Injectable()
export class MetadataService {
  fieldToProviderMap: MetadataProviderField
  ProviderNameToProviderServiceMap: MetadataProviderService
  constructor (
    private readonly nationalRegistryService: NationalRegistryService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    this.fieldToProviderMap = {
      [EndorsementMetaField.FULL_NAME]: {
        providerName: EndorsementProvider.NATIONAL_REGISTRY,
        dataResolver: ({ nationalRegistry }) => nationalRegistry.fullName,
      },
      [EndorsementMetaField.ADDRESS]: {
        providerName: EndorsementProvider.NATIONAL_REGISTRY,
        dataResolver: ({ nationalRegistry }) => nationalRegistry.address,
      },
    }
    this.ProviderNameToProviderServiceMap = {
      [EndorsementProvider.NATIONAL_REGISTRY]: this.nationalRegistryService,
    }
  }

  findProvidersByRequestedMetadataFields (fields: EndorsementMetaField[]) {
    const providerNames = new Set<EndorsementProvider>()

    fields.forEach((field) => {
      providerNames.add(this.fieldToProviderMap[field].providerName)
    })

    return [...providerNames].reduce(
      (providers, field) => ({
        ...providers,
        [field]: this.ProviderNameToProviderServiceMap[field],
      }),
      {} as MetadataProviderService,
    )
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

  async getMetadata (input: MetadataInput): Promise<EndorsementMetaData> {
    const requiredProviders = this.findProvidersByRequestedMetadataFields(
      input.fields,
    )
    const providerData = await this.executeProviders(requiredProviders, input)
    return this.mapProviderDataToFields(input.fields, providerData)
  }
}

// TODO: Simplify this
