import { Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { RskProcuringClientModule } from '@island.is/clients/rsk/procuring'

import { CompanyRegistryResolver } from './api-domains-company-registry.resolver'
import { RskCompanyInfoService } from './rsk-company-info.service'
import { RskCompanyInfoResolver } from './resolvers/rskCompanyInfo.resolver'

@Module({
  providers: [
    RskCompanyInfoService,
    CompanyRegistryResolver,
    RskCompanyInfoResolver,
  ],
  exports: [RskCompanyInfoService],
  imports: [CompanyRegistryClientModule, RskProcuringClientModule],
})
export class CompanyRegistryModule {}
