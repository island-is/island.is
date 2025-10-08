import { Module, DynamicModule } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationsApi, PaymentsApi, Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ApplicationAdminResolver } from './application-admin/application-admin.resolvers'
import {
  ApplicationsApi as FormSystemApplicationsApi,
  Configuration as FormSystemConfiguration,
} from '@island.is/clients/form-system'
export interface Config {
  baseApiUrl: string
  formSystemBaseApiUrl?: string
}

@Module({})
export class ApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [
        ApplicationResolver,
        ApplicationAdminResolver,
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
        {
          provide: FormSystemApplicationsApi,
          useValue: new FormSystemApplicationsApi(
            new FormSystemConfiguration({
              fetchApi: createEnhancedFetch({
                name: 'ApplicationModule.formSystemApplicationsApi',
                timeout: 60000,
              }),
              basePath: 'http://localhost:3434',
            }),
          ),
        },
      ],
      exports: [],
    }
  }
}
