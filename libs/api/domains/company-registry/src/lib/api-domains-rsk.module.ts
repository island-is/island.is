import { DynamicModule, Module } from '@nestjs/common'
import {
  RSKService,
  RSKServiceOptions,
  RSK_OPTIONS,
} from '@island.is/clients/rsk/v1'
import { RSKResolver } from './api-domains-rsk.resolver'
import { RskCompanyInfoClientModule } from '@island.is/clients/rsk/company-registry'
import { RskCompanyInfoService } from './rsk-company-info.service'

@Module({})
export class RSKModule {
  static register(config: RSKServiceOptions): DynamicModule {
    return {
      module: RSKModule,
      providers: [
        RskCompanyInfoService,
        RSKResolver,
        {
          provide: RSK_OPTIONS,
          useValue: config,
        },
        RSKService,
      ],
      imports: [
        RskCompanyInfoClientModule.register({
          xRoadBaseUrl: config.xRoadBaseUrl,
          xRoadProviderId: config.xRoadProviderId,
          xRoadClientId: config.xRoadClientId,
        }),
      ],
    }
  }
}
