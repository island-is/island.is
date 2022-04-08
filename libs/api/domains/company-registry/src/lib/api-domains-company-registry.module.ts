import { Module } from '@nestjs/common'
import { CompanyRegistryResolver } from './api-domains-company-registry.resolver'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { RskCompanyInfoService } from './rsk-company-info.service'

@Module({
  providers: [RskCompanyInfoService, CompanyRegistryResolver],
  exports: [RskCompanyInfoService],
  imports: [CompanyRegistryClientModule],
})
export class CompanyRegistryModule {}
