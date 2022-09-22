import { Module } from '@nestjs/common'

import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { IdentityClientService } from './identityClient.service'

@Module({
  imports: [NationalRegistryXRoadModule, CompanyRegistryModule],
  providers: [IdentityClientService],
  exports: [IdentityClientService],
})
export class IdentityClientModule {}
