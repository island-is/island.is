import { Module, DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import {
  Configuration,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
} from '../../gen/fetch'

export interface VMSTClientModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}

@Module({})
export class VMSTClientModule {
  static register(config: VMSTClientModuleConfig): DynamicModule {
    const headers = {
      'api-key': config.apiKey,
      'X-Road-Client': config.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [ParentalLeaveApi, PensionApi, PregnancyApi, UnionApi]

    return {
      module: VMSTClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
