import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { EnhancedFetchOptions } from '@island.is/clients/middlewares'
import { RskApi, RskApiConfiguration } from './rsk.api'

export interface RskModuleConfig {
  xRoadPath: string
  xRoadClient: string
  basicAuth: string
  fetch?: Partial<EnhancedFetchOptions>
}

export class RskModule {
  static register(config: RskModuleConfig): DynamicModule {
    const headers = {
      Authorization: 'Basic ' + config.basicAuth,
      'X-Road-Client': config.xRoadClient,
      Accept: 'application/json',
    }

    const providerConfiguration = new RskApiConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-v2',
        ...config.fetch,
      }),
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
