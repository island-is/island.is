import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { Module } from '@nestjs/common'
import { NationalRegistryV3Resolver } from './nationalRegistryV3.resolver'
import { NationalRegistryV3Service } from './nationalRegistryV3.service'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [NationalRegistryV3Resolver, NationalRegistryV3Service],
  exports: [NationalRegistryV3Service],
})
export class NationalRegistryV3Module {}
