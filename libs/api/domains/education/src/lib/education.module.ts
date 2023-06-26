import { Module, DynamicModule } from '@nestjs/common'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { XRoadConfig, MMSApi } from '@island.is/clients/mms'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

import { InnaResolver, MainResolver } from './graphql'
import { EducationService } from './education.service'
import { S3Service } from './s3.service'
import { InnaClientModule } from '@island.is/clients/inna'

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
        InnaResolver,
        MainResolver,
        S3Service,
        EducationService,
        {
          provide: 'CONFIG',
          useValue: config as Config,
        },
        {
          provide: MMSApi,
          useValue: new MMSApi(config.xroad),
        },
        {
          provide: NationalRegistryApi,
          // See method doc for disable reason.
          // eslint-disable-next-line local-rules/no-async-module-init
          useFactory: async () =>
            NationalRegistryApi.instantiateClass(config.nationalRegistry),
        },
      ],
      imports: [InnaClientModule, FeatureFlagModule],
      exports: [],
    }
  }
}
