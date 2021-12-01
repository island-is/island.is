import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { EnhancedFetchOptions } from '@island.is/clients/middlewares'

import { Configuration, FasteignirApi } from '../../gen/fetch'

export interface ModuleConfig {
  xRoadPath?: string
  xRoadClient: string
  userAuth?: any
  fetch?: Partial<EnhancedFetchOptions>
}

export class AssetsClientModule {
  static register(config: ModuleConfig): DynamicModule {
    const headers = {
      'X-Road-Client': config.xRoadClient,
      Accept: 'application/json',
    }
    const providerConfiguration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-assets',
        ...config.fetch,
      }),
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [FasteignirApi]

    return {
      module: AssetsClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
