import { Module, DynamicModule } from '@nestjs/common'

import { Register } from '@island.is/infra-nest-server'
import { XRoadConfig, MMSApi } from '@island.is/clients/mms'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'

import { MainResolver } from './graphql'
import { EducationService } from './education.service'
import { S3Service } from './s3.service'

export interface Config {
  fileDownloadBucket: string
  xroad: XRoadConfig
}

@Module({})
export class EducationModule {
  static register({
    config,
    modules,
  }: Register<Config, [typeof NationalRegistryModule]>): DynamicModule {
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
          useFactory: async () => new MMSApi(config!.xroad),
        },
      ],
      imports: [...modules!],
      exports: [],
    }
  }
}
