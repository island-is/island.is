import { Module } from '@nestjs/common'

import { NationalRegistryRealEstateClientModule } from '@island.is/clients/national-registry-real-estate/v1'

import { NationalRegistryRealEstateResolver } from './nationalRegistryRealEstate.resolver'
import { NationalRegistryRealEstateService } from './nationalRegistryRealEstate.service'

@Module({
  providers: [
    NationalRegistryRealEstateResolver,
    NationalRegistryRealEstateService,
  ],
  imports: [NationalRegistryRealEstateClientModule],
  exports: [NationalRegistryRealEstateService],
})
export class NationalRegistryRealEstateModule {}
