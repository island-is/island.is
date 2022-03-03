import { DynamicModule,Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

import { ApplicationsApi, Configuration,PaymentsApi } from '../../gen/fetch'

import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'

export interface Config {
  baseApiUrl: string
}

@Module({})
export class ApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [
        ApplicationResolver,
        ApplicationService,
        {
          provide: ApplicationsApi,
          useFactory: async () =>
            new ApplicationsApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'ApplicationModule.applicationsApi',
                  timeout: 60000,
                }),
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: PaymentsApi,
          useFactory: async () =>
            new PaymentsApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'ApplicationModule.paymentsApi',
                }),
                basePath: config.baseApiUrl,
              }),
            ),
        },
      ],
      exports: [],
    }
  }
}
