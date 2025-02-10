import { Module, DynamicModule } from '@nestjs/common'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { XRoadConfig, MMSApi } from '@island.is/clients/mms'
import { FriggResolver, InnaResolver, MainResolver } from './graphql'
import { EducationService } from './education.service'
import { InnaClientModule } from '@island.is/clients/inna'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { AwsModule } from '@island.is/nest/aws'

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
        FriggResolver,
        InnaResolver,
        MainResolver,
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
        FriggClientModule,
        AwsModule,
      ],
      exports: [],
    }
  }
}
