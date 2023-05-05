import { Module } from '@nestjs/common'
import { NationalRegistryV3ClientService } from './nationalRegistryV3.service'
import { NationalRegistryV3Provider } from './nationalRegistryV3Provider'

@Module({
  providers: [NationalRegistryV3ClientService, NationalRegistryV3Provider],
  exports: [NationalRegistryV3ClientService],
})
export class NationalRegistryV3ClientModule {}
