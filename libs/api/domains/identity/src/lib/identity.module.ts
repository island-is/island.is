import { Module } from '@nestjs/common'

import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { IdentityClientModule } from '@island.is/clients/identity'

import { IdentityResolver } from './identity.resolver'
import { IdentityLoader } from './identity.loader'

@Module({
  imports: [
    NationalRegistryXRoadModule,
    CompanyRegistryModule,
    IdentityClientModule,
  ],
  providers: [IdentityResolver, IdentityLoader],
  exports: [IdentityLoader],
})
export class IdentityModule {}
