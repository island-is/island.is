import { Module } from '@nestjs/common'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { RskProcuringClientModule } from '@island.is/clients/rsk/procuring'

import { NationalRegistryXRoadResolver } from './nationalRegistryXRoad.resolver'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'

@Module({
  providers: [NationalRegistryXRoadResolver, NationalRegistryXRoadService],
  imports: [NationalRegistryClientModule, RskProcuringClientModule],
  exports: [NationalRegistryXRoadService],
})
export class NationalRegistryXRoadModule {}
