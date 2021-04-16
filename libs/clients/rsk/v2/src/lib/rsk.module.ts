import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { RskApi, RskApiConfiguration } from './rsk.api'

export interface RskModuleConfig {
  xRoadPath: string
  xRoadClient: string
  basicAuth: string
}

export class RskModule {
  static register(config: RskModuleConfig): DynamicModule {
    const headers = {
      Authorization: 'Basic ' + config.basicAuth,
      'X-Road-Client': config.xRoadClient,
      Accept: 'application/json',
    }

    const providerConfiguration = new RskApiConfiguration({
      fetchApi: fetch,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [RskApi]

    return {
      module: RskModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
