import { Module, DynamicModule } from '@nestjs/common'

import { XRoadConfig, MMSApi } from '@island.is/clients/mms'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { S3Service } from './s3.service'

export interface Config {
  fileDownloadBucket: string
  xroad: XRoadConfig
}

@Module({})
export class EducationModule {
  static register(config: Config): DynamicModule {
    return {
      module: EducationModule,
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
          useFactory: async () => new MMSApi(config.xroad),
        },
      ],
      exports: [],
    }
  }
}
