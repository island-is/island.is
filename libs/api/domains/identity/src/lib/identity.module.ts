import { Module } from '@nestjs/common'

import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { IdentityClientModule } from '@island.is/clients/identity'

import { IdentityResolver } from './identity.resolver'

@Module({
  imports: [
    NationalRegistryXRoadModule,
    CompanyRegistryModule,
    IdentityClientModule,
  ],
  providers: [IdentityResolver],
  exports: [],
})
export class IdentityModule {}
