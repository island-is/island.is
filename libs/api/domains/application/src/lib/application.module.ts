import { Module, DynamicModule } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationsApi, PaymentsApi, Configuration } from '../../gen/fetch'
import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'

export interface Config {
  baseApiUrl: string
  fetch?: Partial<EnhancedFetchOptions>
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
                  ...config.fetch,
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
