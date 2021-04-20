import {
  BasicDataProvider,
  DataProviderConfig,
  DataProviderResult,
} from '@island.is/application/core'
import { ExternalData } from '@island.is/application/core'
import { Locale } from '@island.is/shared/types'

import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import { environment } from '../../../../environments'

class NotImplemented extends BasicDataProvider {
  provide(): Promise<unknown> {
    return Promise.reject(
      `This dataProvider has not been implemented yet: ${this.type}`,
    )
  }
}

export function buildDataProviders(
  externalDataDTO: PopulateExternalDataDto,
  templateDataProviders: Record<
    string,
    new (dataProviderConfig: DataProviderConfig) => BasicDataProvider
  >,
  authorization: string,
  locale: Locale,
): BasicDataProvider[] {
  const providers: BasicDataProvider[] = []
  externalDataDTO.dataProviders.forEach(({ type }) => {
    const Provider = templateDataProviders[type]
    if (Provider) {
      providers.push(
        new Provider({
          baseApiUrl: environment.baseApiUrl,
          authorization,
          locale,
        }),
      )
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
