import { Module } from '@nestjs/common'

import { MunicipalityNationalRegistryResolver } from './municipalityNationalRegistry.resolver'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [NationalRegistryXRoadModule],
  providers: [MunicipalityNationalRegistryResolver],
})
export class MunicipalityNationalRegistryModule {}
