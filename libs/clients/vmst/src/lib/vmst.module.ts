import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { logger } from '@island.is/logging'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import {
  Configuration,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
} from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'

const isRunningOnProduction = isRunningOnEnvironment('production')

export interface VMSTModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}

export class VMSTModule {
  static register(config: VMSTModuleConfig): DynamicModule {
    if (!config.apiKey) {
      logger.error('VMSTModule XROAD_VMST_API_KEY not provided.')
    }

    if (!config.xRoadClient) {
      logger.error('VMSTModule XROAD_CLIENT_ID not provided.')
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

    const exportedApis = [ParentalLeaveApi, PensionApi, PregnancyApi, UnionApi]

    return {
      module: VMSTModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
