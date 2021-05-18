import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'

export interface ModuleConfig {
  token: string
  xRoadPath: string
  xRoadClient: string
}

export class TjodskraModule {
  static register(config: ModuleConfig): DynamicModule {
    const headers = {
      Authorization: `Bearer ${config.token}`,
      'X-Road-Client': config.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi]

    return {
      module: TjodskraModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
