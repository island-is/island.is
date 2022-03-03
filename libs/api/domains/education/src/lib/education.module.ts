import { DynamicModule,Module } from '@nestjs/common'

import { MMSApi,XRoadConfig } from '@island.is/clients/mms'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

import { EducationService } from './education.service'
import { MainResolver } from './graphql'
import { S3Service } from './s3.service'

export interface Config {
  fileDownloadBucket: string
  xroad: XRoadConfig
  nationalRegistry: NationalRegistryConfig
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
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instantiateClass(config.nationalRegistry),
        },
      ],
      exports: [],
    }
  }
}
