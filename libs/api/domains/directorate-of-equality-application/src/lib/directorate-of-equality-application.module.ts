import { DynamicModule, Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ApplicationsApi,
  Configuration,
} from '@island.is/api/domains/application'
import { DirectorateOfEqualityClientModule } from '@island.is/clients/directorate-of-equality'
import { LoggingModule } from '@island.is/logging'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { DirectorateOfEqualityApplicationResolver } from './directorate-of-equality-application.resolver'
import { DirectorateOfEqualityApplicationService } from './directorate-of-equality-application.service'

export interface Config {
  baseApiUrl: string
}

// ApplicationModule doesn't export ApplicationsApi, so DI can't provide it here — we configure our own instance instead.
@Module({})
export class DirectorateOfEqualityApplicationModule {
  static register(config: Config): DynamicModule {
    return {
      module: DirectorateOfEqualityApplicationModule,
      imports: [
        DirectorateOfEqualityClientModule,
        LoggingModule,
        FeatureFlagModule,
      ],
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
