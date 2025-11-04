import { Module, DynamicModule } from '@nestjs/common'
// import { ApplicationsApi, Configuration } from '../../../application/gen/fetch'
import {
  ApplicationsApi,
  Configuration,
} from '@island.is/api/domains/application'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ApplicationsApi as FormSystemApplicationsApi,
  Configuration as FormSystemConfiguration,
} from '@island.is/clients/form-system'
import { MyPagesApplicationResolver } from './myPagesApplication.resolver'
import { MyPagesApplicationService } from './myPagesApplication.service'

export interface Config {
  baseApiUrl: string
  formSystemBaseApiUrl: string
}

@Module({})
export class MyPagesApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: MyPagesApplicationModule,
      providers: [
        MyPagesApplicationResolver,
        MyPagesApplicationService,
        {
          provide: ApplicationsApi,
          useValue: new ApplicationsApi(
            new Configuration({
              fetchApi: createEnhancedFetch({
                name: 'MyPagesApplicationModule.applicationsApi',
                timeout: 60000,
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
      ],
      exports: [],
    }
  }
}
