import { DynamicModule, Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ApplicationsApi, Configuration } from '@island.is/api/domains/application'
import { DirectorateOfEqualityClientModule } from '@island.is/clients/directorate-of-equality'

import { DirectorateOfEqualityApplicationResolver } from './directorate-of-equality-application.resolver'
import { DirectorateOfEqualityApplicationService } from './directorate-of-equality-application.service'

export interface Config {
  baseApiUrl: string
}

// `ApplicationModule` (`@island.is/api/domains/application`) doesn't export
// its `ApplicationService`/`ApplicationsApi` providers (`exports: []`), so
// the ownership check this module needs can't be borrowed via DI — it
// configures its own `ApplicationsApi` instance the same way, pointed at the
// same application-system base URL.
@Module({})
export class DirectorateOfEqualityApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: DirectorateOfEqualityApplicationModule,
      imports: [DirectorateOfEqualityClientModule],
      providers: [
        DirectorateOfEqualityApplicationResolver,
        DirectorateOfEqualityApplicationService,
        {
          provide: ApplicationsApi,
          useValue: new ApplicationsApi(
            new Configuration({
              fetchApi: createEnhancedFetch({
                name: 'DirectorateOfEqualityApplicationModule.applicationsApi',
                timeout: 60000,
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
