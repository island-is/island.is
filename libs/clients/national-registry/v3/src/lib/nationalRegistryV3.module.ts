import { Module } from '@nestjs/common'
import { NationalRegistryV3ClientService } from './nationalRegistryV3.service'
import { Apis } from './apis'
import { ApiConfiguration } from './apiConfiguration'

@Module({
  providers: [NationalRegistryV3ClientService, ApiConfiguration, ...Apis],
  exports: [NationalRegistryV3ClientService],
})
export class NationalRegistryV3ClientModule {}
