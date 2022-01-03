import { DynamicModule, Module } from '@nestjs/common'
import { RskCompanyInfoClientModule } from '@island.is/clients/rsk-company-info'
import { RskCompanyInfoResolver } from './graphql/rsk-company-info.resolver'
import { RskCompanyInfoService } from './graphql/rsk-company-info.service'

const XROAD_BASE_URL = process.env.xRoadBaseUrl ?? ''
const XROAD_PROVIDER_ID = process.env.xRoadProviderId ?? ''
const XROAD_CLIENT_ID = process.env.xRoadClientId ?? ''

@Module({})
export class RskCompanyInfoModule {
  static register(): DynamicModule {
    return {
      module: RskCompanyInfoModule,
      providers: [RskCompanyInfoResolver, RskCompanyInfoService],
      imports: [
        RskCompanyInfoClientModule.register({
          xRoadBaseUrl: XROAD_BASE_URL,
          xRoadProviderId: XROAD_PROVIDER_ID,
          xRoadClientId: XROAD_CLIENT_ID,
        }),
      ],
    }
  }
}
