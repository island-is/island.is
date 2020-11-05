import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationsApi, Configuration } from '../../gen/fetch'

export interface Config {
  basePath: string
}

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
                fetchApi: fetch,
                basePath: config.basePath,
              }),
            ),
        },
      ],
    }
  }
}
