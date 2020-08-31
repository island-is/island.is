import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import {
  DataProvider,
  DataProviderResult,
  getDataProviderByType,
} from '@island.is/application/data-provider'
import { ExternalData } from '@island.is/application/schema'

export function buildDataProviders(
  externalDataDTO: PopulateExternalDataDto,
): DataProvider[] {
  const providers: DataProvider[] = []
  externalDataDTO.dataProviders.forEach(({ type }) => {
    const provider = getDataProviderByType(type, undefined)
    providers.push(provider)
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
