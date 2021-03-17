import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { EmailModule } from '@island.is/email-service'
import { S3Service } from './s3.service'
import { MMSApi } from './client'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  xroadLicenseServiceId: string
  fileDownloadBucket: string
}

@Module({})
export class EducationModule {
  static register(config: Config): DynamicModule {
    return {
      module: EducationModule,
      imports: [EmailModule.register(config.emailOptions)],
      providers: [
        MainResolver,
        S3Service,
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
