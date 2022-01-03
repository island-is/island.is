import { DynamicModule } from '@nestjs/common'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

import { DefaultApi as CompanyApi, Configuration } from './gen/fetch'
import { createWrappedFetchWithLogging } from './utils'

export interface RskCompanyInfoClientModuleConfig {
  xRoadBaseUrl: string
  xRoadProviderId: string
  xRoadClientId: string
}

const isRunningOnProduction = isRunningOnEnvironment('production')

export class RskCompanyInfoClientModule {
  static register(config: RskCompanyInfoClientModuleConfig): DynamicModule {
    if (!config.xRoadProviderId) {
      logger.error('RskCompanyInfoModule XROAD_PROVIDER_ID not provided')
    }

    if (!config.xRoadBaseUrl) {
      logger.error('RskCompanyInfoModule XROAD_BASE_URL not provided.')
    }

    if (!config.xRoadClientId) {
      logger.error('RskCompanyInfoModule XROAD_CLIENT_ID not provided.')
    }

    const headers = {
      Accept: 'application/json',
      'X-Road-Client': config.xRoadClientId,
    }
    const { xRoadBaseUrl, xRoadProviderId } = config
    const RSK_COMPANY_BASE_PATH = `${xRoadBaseUrl}/r1/${xRoadProviderId}/`

    const providerConfiguration = new Configuration({
      fetchApi: isRunningOnProduction ? fetch : createWrappedFetchWithLogging,
      basePath: RSK_COMPANY_BASE_PATH,
      headers,
    })

    return {
      module: RskCompanyInfoClientModule,
      providers: [
        {
          provide: CompanyApi,
          useFactory: () => new CompanyApi(providerConfiguration),
        },
      ],
      exports: [CompanyApi],
    }
  }
}
