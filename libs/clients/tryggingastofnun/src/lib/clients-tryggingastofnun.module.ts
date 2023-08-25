import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { logger } from '@island.is/logging'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { Configuration, HelloOddurApi } from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'

const isRunningOnProduction = isRunningOnEnvironment('production')

export interface TryggingastofnunModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}

export class ClientsTryggingastofnunModule {
  static register(config: TryggingastofnunModuleConfig): DynamicModule {
    if (!config.apiKey) {
      logger.error(
        'ClientsTryggingastofnunModule XROAD_VMST_API_KEY not provided.',
      )
    }

    if (!config.xRoadClient) {
      logger.error(
        'ClientsTryggingastofnunModule XROAD_CLIENT_ID not provided.',
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

    const exportedApis = [HelloOddurApi]

    return {
      module: ClientsTryggingastofnunModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
