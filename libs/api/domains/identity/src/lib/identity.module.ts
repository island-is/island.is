import { Module } from '@nestjs/common'

import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

import { IdentityResolver } from './identity.resolver'
import { IdentityService } from './identity.service'

@Module({
  imports: [NationalRegistryXRoadModule],
  providers: [IdentityResolver, IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
