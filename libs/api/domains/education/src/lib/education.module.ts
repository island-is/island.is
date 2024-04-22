import { Module, DynamicModule } from '@nestjs/common'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { XRoadConfig, MMSApi } from '@island.is/clients/mms'
import { InnaResolver, MainResolver } from './graphql'
import { EducationService } from './education.service'
import { S3Service } from './s3.service'
import { InnaClientModule } from '@island.is/clients/inna'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'

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
      ],
      imports: [
        InnaClientModule,
        FeatureFlagModule,
        NationalRegistryV3ClientModule,
      ],
      exports: [],
    }
  }
}
