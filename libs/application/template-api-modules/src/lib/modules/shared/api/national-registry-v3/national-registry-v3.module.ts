import { Module } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'
import { NationalRegistryV3Service } from './national-registry-v3.service'
import { NationalRegistryModule } from '../national-registry/national-registry.module'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    NationalRegistryV3ApplicationsClientModule,
    NationalRegistryModule,
    FeatureFlagModule,
  ],
  providers: [NationalRegistryV3Service],
  exports: [NationalRegistryV3Service],
})
export class NationalRegistryV3Module {}
