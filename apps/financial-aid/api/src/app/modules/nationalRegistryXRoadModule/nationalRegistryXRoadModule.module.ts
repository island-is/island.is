import { Module } from '@nestjs/common'

import { NationalRegistryXRoadResolver } from './nationalRegistryXRoad.resolver'
import { NationalRegistryXRoadModule as NationalRegistry } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [NationalRegistry],
  providers: [NationalRegistryXRoadResolver],
})
export class NationalRegistryXRoadModule {}
