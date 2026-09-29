import { Module } from '@nestjs/common'
import { NationalRegistryService } from './nationalRegistry.service'
import { CacheModule } from '../cache'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    CacheModule,
    NationalRegistryClientModule,
    NationalRegistryV3ClientModule,
    FeatureFlagModule,
  ],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
