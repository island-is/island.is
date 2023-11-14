import { DynamicModule, Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { Configuration, RecyclingFundGraphQLClientApi } from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'
import { RecyclingFundClientService } from './RecyclingFundClient.service'

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

const configFactory = (idsClientConfig: any) => ({
  fetchApi: createEnhancedFetch({
    name: 'recycling-fund',
    organizationSlug: 'urvinnslusjodur',
    autoAuth: {
      mode: 'tokenExchange',
      issuer: 'idsClientConfig.issuer',
      clientId: 'idsClientConfig.clientId',
      clientSecret: 'dsClientConfig.clientSecret',
      scope: ['@island.is/applications/urvinnslusjodur'],
      //   scope: ['@urvinnslusjodur.is/skilavottord'],
    },
    logErrorResponseBody: true,
  }),
  basePath: 'http://localhost:3339',
})

@Module({
  providers: [RecyclingFundClientService],
  exports: [RecyclingFundClientService],
})
export class RecyclingFundClientModule {
  static register(): DynamicModule {
    // if (!config.apiKey) {
    //   logger.error('VMSTModule XROAD_VMST_API_KEY not provided.')
    // }

    // if (!config.xRoadClient) {
    //   logger.error('VMSTModule XROAD_CLIENT_ID not provided.')
    // }

    // const headers = {
    //   'api-key': config.apiKey,
    //   'X-Road-Client': config.xRoadClient,
    // }

    /* const providerConfiguration = new Configuration({
      fetchApi: isRunningOnProduction ? fetch : createWrappedFetchWithLogging,
    })
*/
    //const exportedApis = [RecyclingFundGraphQLClientApi]

    return {
      module: RecyclingFundClientModule,
      providers: [
        {
          provide: RecyclingFundClientService,
          //useFactory: () => {
          useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) => {
            const api = new RecyclingFundGraphQLClientApi(
              new Configuration(configFactory(idsClientConfig)),
            )

            return new RecyclingFundClientService(api)
          },
        },
      ],
      exports: [RecyclingFundClientService],
    }
  }
}
