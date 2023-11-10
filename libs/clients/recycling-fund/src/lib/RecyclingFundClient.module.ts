import { DynamicModule, Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { Configuration, RecyclingFundGraphQLClientApi } from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'
import { RecyclingFundClientService } from './RecyclingFundClient.service'

const isRunningOnProduction = isRunningOnEnvironment('production')

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

    const providerConfiguration = new Configuration({
      fetchApi: isRunningOnProduction ? fetch : createWrappedFetchWithLogging,
    })

    const exportedApis = [RecyclingFundGraphQLClientApi]

    return {
      module: RecyclingFundClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
