import { DynamicModule, Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { logger } from '@island.is/logging'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import {
  Configuration,
  GetStatusApi,
  HelloOddurApi,
  SendApplicationApi,
} from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'
import { SocialInsuranceAdministrationClientService } from './socialInsuranceAdministrationClient.service'

const isRunningOnProduction = isRunningOnEnvironment('production')

export interface SocialInsuranceAdministrationModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}

@Module({
  providers: [SocialInsuranceAdministrationClientService],
  exports: [SocialInsuranceAdministrationClientService],
})
export class SocialInsuranceAdministrationClientModule {
  static register(
    config: SocialInsuranceAdministrationModuleConfig,
  ): DynamicModule {
    if (!config.apiKey) {
      logger.error(
        'SocialInsuranceAdministrationModule XROAD_TR_API_KEY not provided.',
      )
    }

    if (!config.xRoadClient) {
      logger.error(
        'SocialInsuranceAdministrationModule XROAD_CLIENT_ID not provided.',
      )
    }

    const headers = {
      'api-key': config.apiKey,
      'X-Road-Client': config.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: isRunningOnProduction ? fetch : createWrappedFetchWithLogging,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [HelloOddurApi, GetStatusApi, SendApplicationApi]

    return {
      module: SocialInsuranceAdministrationClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
