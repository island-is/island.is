import { Module } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'
import { NationalRegistryV3Service } from './national-registry.service'

@Module({
  imports: [NationalRegistryV3ApplicationsClientModule],
  providers: [NationalRegistryV3Service],
  exports: [NationalRegistryV3Service],
})
export class NationalRegistryV3Module {}
