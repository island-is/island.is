import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  Configuration,
  MeDelegationsApi,
  ScopesApi,
  ActorDelegationsApi,
} from '../../gen/fetch'

export interface AuthPublicApiClientModuleConfig {
  baseApiUrl: string
}

export class AuthPublicApiClientModule {
  static register(config: AuthPublicApiClientModuleConfig): DynamicModule {
    const fetch = createEnhancedFetch({
      name: 'auth-public-api-client',
    })

    return {
      module: AuthPublicApiClientModule,
      providers: [
        {
          provide: MeDelegationsApi,
          useFactory: () =>
            new MeDelegationsApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: ActorDelegationsApi,
          useFactory: () =>
            new ActorDelegationsApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: ScopesApi,
          useFactory: () =>
            new ScopesApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
      ],
      exports: [MeDelegationsApi, ActorDelegationsApi, ScopesApi],
    }
  }
}
