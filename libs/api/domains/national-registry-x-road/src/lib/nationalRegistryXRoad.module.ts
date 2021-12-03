import { Module } from '@nestjs/common'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { NationalRegistryXRoadResolver } from './nationalRegistryXRoad.resolver'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'

@Module({
  providers: [NationalRegistryXRoadResolver, NationalRegistryXRoadService],
  imports: [NationalRegistryClientModule],
  exports: [NationalRegistryXRoadService],
})
export class NationalRegistryXRoadModule {}
