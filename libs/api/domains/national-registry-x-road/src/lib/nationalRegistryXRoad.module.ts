import { Module } from '@nestjs/common'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { NationalRegistryXRoadResolver } from './nationalRegistryXRoad.resolver'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryKeysXRoadResolver } from './nationalRegistryKeysXRoad.resolver'

@Module({
  providers: [
    NationalRegistryXRoadResolver,
    NationalRegistryKeysXRoadResolver,
    NationalRegistryXRoadService,
  ],
  imports: [NationalRegistryClientModule],
  exports: [NationalRegistryXRoadService],
})
export class NationalRegistryXRoadModule {}
