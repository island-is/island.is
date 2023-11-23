import { DynamicModule, Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { createWrappedFetchWithLogging } from './utils'
import { RecyclingFundClientService } from './recyclingFundClient.service'

import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'

const isRunningOnProduction = isRunningOnEnvironment('production')

export interface BKApiConfig {
  tokenExchangeScope: ['@urvinnslusjodur.is/skilavottord']
  fetchOptions?: Partial<EnhancedFetchOptions>
}

const configFactory = (
  idsClientConfig?: ConfigType<typeof IdsClientConfig>,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-recycling-fund',
    organizationSlug: 'urvinnslusjodur',
    autoAuth: idsClientConfig?.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: ['@urvinnslusjodur.is/skilavottord'],
        }
      : undefined,
    logErrorResponseBody: true,
  }),
  basePath: 'http://localhost:3339',
})

@Module({
  providers: [
    // {
    //   provide: RecyclingFundClientService,
    //   //useFactory: () => {
    //   useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) => {
    //     const api = new RecyclingFundGraphQLClientApi(
    //       new Configuration(configFactory(idsClientConfig)),
    //     )
    //
    //     return new RecyclingFundClientService(api)
    //   },
    // },
    RecyclingFundClientService,
  ],
  exports: [RecyclingFundClientService],
})
export class RecyclingFundClientModule {}
