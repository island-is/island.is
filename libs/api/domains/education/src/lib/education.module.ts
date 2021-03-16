import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
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
        {
          provide: EMAIL_OPTIONS,
          useValue: config.emailOptions,
        },
        EmailService,
      ],
      exports: [],
    }
  }
}
