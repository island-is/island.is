import { DynamicModule } from '@nestjs/common'
import { SyslumennApi, Configuration } from '../../gen/fetch'
import {
  createEnhancedFetch,
} from '@island.is/clients/middlewares'

export interface SyslumennApiConfig {
  url: string
  username: string
  password: string
}


export class SyslumennApiModule {
  static register(config: SyslumennApiConfig): DynamicModule {
    return {
      module: SyslumennApiModule,
      providers: [
        {
          provide: SyslumennApi,
          useFactory: () => {
            return new SyslumennApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'clients-syslumenn',
                  timeout: 5000,
                }),
                basePath: config.url,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }),
            )
          },
        },
      ],
      exports: [SyslumennApi],
    }
  }
}
