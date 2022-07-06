import {
  BasicDataProvider,
  DataProviderConfig,
  DataProviderResult,
  ExternalData,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { User } from '@island.is/auth-nest-tools'

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
  user: User,
  locale: Locale,
): BasicDataProvider[] {
  const providers: BasicDataProvider[] = []
  externalDataDTO.dataProviders.forEach(({ type }) => {
    const providerExists =
      Object.prototype.hasOwnProperty.call(templateDataProviders, type) &&
      typeof templateDataProviders[type] === 'function'

    if (providerExists) {
      const Provider = templateDataProviders[type]
      providers.push(
        new Provider({
          baseApiUrl: environment.baseApiUrl,
          user,
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
