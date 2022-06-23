import { Module } from '@nestjs/common'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { MunicipalityNationalRegistryResolver } from './municipalityNationalRegistry.resolver'
import { MunicipalityNationalRegistryService } from './municipalityNationalRegistry.service'

@Module({
  imports: [NationalRegistryClientModule],
  providers: [
    MunicipalityNationalRegistryResolver,
    MunicipalityNationalRegistryService,
  ],
})
export class MunicipalityNationalRegistryModule {}
