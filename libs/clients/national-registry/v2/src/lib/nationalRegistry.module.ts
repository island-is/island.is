import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { EnhancedFetchOptions } from '@island.is/clients/middlewares'

import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'

export interface ModuleConfig {
  xRoadPath: string
  xRoadClient: string
  fetch?: Partial<EnhancedFetchOptions>
}

export class NationalRegistryModule {
  static register(config: ModuleConfig): DynamicModule {
    const providerConfiguration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v2',
        ...config.fetch,
      }),
      basePath: config.xRoadPath,
    })

    const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi]

    return {
      module: NationalRegistryModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
