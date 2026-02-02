import { Module } from '@nestjs/common'
import { ShipRegistryResolver } from './ship-registry.resolver'
import { ShipRegistryClientService } from '@island.is/clients/ship-registry'

@Module({
  imports: [ShipRegistryClientService],
  providers: [ShipRegistryResolver],
})
export class ShipRegistryModule {}
