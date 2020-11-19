import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import {
  BasicDataProvider,
  DataProviderResult,
} from '@island.is/application/core'
import { ExternalData } from '@island.is/application/core'

class NotImplemented extends BasicDataProvider {
  provide(): Promise<unknown> {
    return Promise.reject(
      `This dataProvider has not been implemented yet: ${this.type}`,
    )
  }
}

export function buildDataProviders(
  externalDataDTO: PopulateExternalDataDto,
  templateDataProviders: Record<string, new () => BasicDataProvider>,
): BasicDataProvider[] {
  const providers: BasicDataProvider[] = []
  externalDataDTO.dataProviders.forEach(({ type }) => {
    const Provider = templateDataProviders[type]
    if (Provider) {
      providers.push(new Provider())
    } else {
      providers.push(new NotImplemented())
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
