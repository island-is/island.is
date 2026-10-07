import { Module } from '@nestjs/common'
import { NationalRegistryService } from './nationalRegistry.service'
import { CacheModule } from '../cache'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'

@Module({
  imports: [CacheModule, NationalRegistryV3ClientModule],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
