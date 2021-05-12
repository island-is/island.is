import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { isRunningOnEnvironment } from '@island.is/utils/shared'
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
