import { Module } from '@nestjs/common'

import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

import { MunicipalityNationalRegistryResolver } from './municipalityNationalRegistry.resolver'

@Module({
  imports: [NationalRegistryXRoadModule],
  providers: [MunicipalityNationalRegistryResolver],
})
export class MunicipalityNationalRegistryModule {}
