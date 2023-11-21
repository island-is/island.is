import { Module } from '@nestjs/common'
import { ShipRegistryClientModule } from '@island.is/clients/ship-registry'
import { ShipRegistryResolver } from './ship-registry.resolver'

@Module({
  imports: [ShipRegistryClientModule],
  providers: [ShipRegistryResolver],
})
export class ShipRegistryModule {}
