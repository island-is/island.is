import { Module } from '@nestjs/common'
import { NationalRegistryService } from './nationalRegistry.service'
import { CacheModule } from '../cache'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
@Module({
  imports: [CacheModule, NationalRegistryClientModule],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
