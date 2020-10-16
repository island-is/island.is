import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import { DataProvider, DataProviderResult } from '@island.is/application/core'
import { getDataProviderByType } from '@island.is/application/data-providers'
import { ExternalData } from '@island.is/application/core'

export function buildDataProviders(
  externalDataDTO: PopulateExternalDataDto,
): DataProvider[] {
  const providers: DataProvider[] = []
  externalDataDTO.dataProviders.forEach(({ type }) => {
    const provider = getDataProviderByType(type)
    if (provider) {
      providers.push(provider)
    }
  })
  return providers
}

export function buildExternalData(
  requestedProviders: PopulateExternalDataDto,
  results: DataProviderResult[],
): ExternalData {
  const externalData: ExternalData = {}
  requestedProviders.dataProviders.forEach(({ id }, index) => {
    externalData[id] = results[index]
  })
  return externalData
}
