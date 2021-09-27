import { DynamicModule, Module } from '@nestjs/common'
import {
  RskCompanyInfoServiceOptions,
  CompanyApi,
  Configuration as RestConfiguration,
} from '@island.is/clients/rsk-company-info'
import { RskCompanyInfoResolver } from './graphql/rsk-company-info.resolver'
import { RskCompanyInfoService } from './graphql/rsk-company-info.service'

@Module({})
export class RskCompanyInfoModule {
  static register(config: RskCompanyInfoServiceOptions): DynamicModule {
    const { xRoadBaseUrl, xRoadProviderId } = config
    const RSK_COMPANY_BASE_PATH = `${xRoadBaseUrl}/r1/${xRoadProviderId}/`
    return {
      module: RskCompanyInfoModule,
      providers: [
        RskCompanyInfoResolver,
        RskCompanyInfoService,
        {
          provide: CompanyApi,
          useFactory: () =>
            new CompanyApi(
              new RestConfiguration({
                fetchApi: fetch,
                basePath: RSK_COMPANY_BASE_PATH,
                headers: {
                  Accept: 'application/json',
                  'X-Road-Client': config.xRoadClientId,
                },
              }),
            ),
        },
      ],
    }
  }
}
