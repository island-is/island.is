import { Module, DynamicModule } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationsApi, PaymentsApi, Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

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
          useValue: new ApplicationsApi(
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
          useValue: new PaymentsApi(
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
