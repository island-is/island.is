import { DynamicModule } from '@nestjs/common'
import { Configuration, DelegationsApi, ApiScopeApi } from '../../gen/fetch'

export interface AuthPublicApiClientModuleConfig {
  baseApiUrl: string
}

export class AuthPublicApiClientModule {
  static register(config: AuthPublicApiClientModuleConfig): DynamicModule {
    return {
      module: AuthPublicApiClientModule,
      providers: [
        {
          provide: DelegationsApi,
          useFactory: () =>
            new DelegationsApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: ApiScopeApi,
          useFactory: () =>
            new ApiScopeApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
      ],
      exports: [DelegationsApi, ApiScopeApi],
    }
  }
}
