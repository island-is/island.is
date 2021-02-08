import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { MMSApi } from './client'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

@Module({})
export class EducationModule {
  static register(config: Config): DynamicModule {
    return {
      module: EducationModule,
      providers: [
        MainResolver,
        EducationService,
        {
          provide: MMSApi,
          useFactory: async () =>
            new MMSApi(
              config.xroadBaseUrl,
              config.xroadClientId,
              config.secret,
            ),
        },
      ],
      exports: [],
    }
  }
}
