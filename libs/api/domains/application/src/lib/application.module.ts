import { Module, DynamicModule } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
import { ApplicationV2Resolver } from './applicationV2.resolver'
import { ApplicationService } from './application.service'
import { ApplicationV2Service } from './applicationV2.service'
import { ApplicationsApi, PaymentsApi, Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ApplicationAdminV2Resolver } from './application-admin/application-adminV2.resolver'
import { ApplicationAdminV2Service } from './application-admin/application-adminV2.service'
import { ApplicationTranslationResolver } from './application-translation/application-translation.resolver'
import {
  ApplicationTranslationApiService,
  TRANSLATION_API_CONFIG,
} from './application-translation/application-translation.service'
import {
  ApplicationsApi as FormSystemApplicationsApi,
  AdminApi as FormSystemAdminApi,
  Configuration as FormSystemConfiguration,
} from '@island.is/clients/form-system'

export interface Config {
  baseApiUrl: string
  formSystemBaseApiUrl: string
}

@Module({})
export class ApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [
        ApplicationResolver,
        ApplicationV2Resolver,
        ApplicationAdminV2Resolver,
        ApplicationTranslationResolver,
        ApplicationService,
        ApplicationV2Service,
        ApplicationAdminV2Service,
        ApplicationTranslationApiService,
        {
          provide: TRANSLATION_API_CONFIG,
          useValue: { baseApiUrl: config.baseApiUrl },
        },
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
                name: 'MyPagesApplicationModule.formSystemApplicationsApi',
                timeout: 60000,
              }),
              basePath: config.formSystemBaseApiUrl,
            }),
          ),
        },
        {
          provide: FormSystemAdminApi,
          useValue: new FormSystemAdminApi(
            new FormSystemConfiguration({
              fetchApi: createEnhancedFetch({
                name: 'MyPagesApplicationModule.formSystemAdminApi',
                timeout: 60000,
              }),
              basePath: config.formSystemBaseApiUrl,
            }),
          ),
        },
      ],
      exports: [],
    }
  }
}
