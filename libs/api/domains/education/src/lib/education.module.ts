import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { EmailModule } from '@island.is/email-service'
import { MMSApi } from './client'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  xroadLicenseServiceId: string
  emailOptions: {
    sendFromEmail: string
    useTestAccount: boolean
    options?: {
      region: string
    }
  }
}

@Module({})
export class EducationModule {
  static register(config: Config): DynamicModule {
    return {
      module: EducationModule,
      imports: [EmailModule.register(config.emailOptions)],
      providers: [
        MainResolver,
        EducationService,
        {
          provide: 'CONFIG',
          useFactory: async () => config as Config,
        },
        {
          provide: MMSApi,
          useFactory: async () =>
            new MMSApi(
              config.xroadBaseUrl,
              config.xroadClientId,
              config.xroadLicenseServiceId,
            ),
        },
      ],
      exports: [],
    }
  }
}
