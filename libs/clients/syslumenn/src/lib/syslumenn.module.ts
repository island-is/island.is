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


export class SyslumennModule {
  static register(config: SyslumennApiConfig): DynamicModule {
    return {
      module: SyslumennModule,
      providers: [
        {
          provide: SyslumennApi,
          useFactory: () => {
            return new SyslumennApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'clients-syslumenn',
                  timeout: 20000,
                }),
                basePath: config.url,
                headers: {
                  userName: `${config.username}`,
                  password: `${config.password}`,
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
