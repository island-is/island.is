import { DynamicModule } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { DefaultApi as CompanyApi, Configuration } from './gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { RskCompanyInfoServiceOptions } from './types/service-options.type'

export class CompanyRegistryClientModule {
  static register(config: RskCompanyInfoServiceOptions): DynamicModule {
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
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-company-info',
        treat400ResponsesAsErrors: true,
        logErrorResponseBody: true,
      }),
      basePath: RSK_COMPANY_BASE_PATH,
      headers,
    })

    return {
      module: CompanyRegistryClientModule,
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
