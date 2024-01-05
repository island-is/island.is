import { Module } from '@nestjs/common'
import { ShipRegistryClientService } from './ship-registry.service'
import { ApiConfig, ApiProviders } from './ship-registry.provider'

@Module({
  providers: [ApiConfig, ...ApiProviders, ShipRegistryClientService],
  exports: [ShipRegistryClientService],
})
export class ShipRegistryClientModule {}
