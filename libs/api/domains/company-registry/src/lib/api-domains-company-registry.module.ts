import { Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { RskRelationshipsClientModule } from '@island.is/clients-rsk-relationships'

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
  imports: [CompanyRegistryClientModule, RskRelationshipsClientModule],
})
export class CompanyRegistryModule {}
