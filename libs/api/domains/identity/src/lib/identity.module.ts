import { Module } from '@nestjs/common'

import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

import { IdentityResolver } from './identity.resolver'
import { IdentityService } from './identity.service'

@Module({
  imports: [NationalRegistryXRoadModule, CompanyRegistryModule],
  providers: [IdentityResolver, IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
