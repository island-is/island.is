import { DynamicModule, Module } from '@nestjs/common'
import {
  RskCompanyInfoClientModule,
  RskCompanyInfoServiceOptions,
} from '@island.is/clients/rsk-company-info'
import { RskCompanyInfoResolver } from './graphql/rsk-company-info.resolver'
import { RskCompanyInfoService } from './graphql/rsk-company-info.service'

@Module({})
export class RskCompanyInfoModule {
  static register(config: RskCompanyInfoServiceOptions): DynamicModule {
    return {
      module: RskCompanyInfoModule,
      providers: [RskCompanyInfoResolver, RskCompanyInfoService],
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
