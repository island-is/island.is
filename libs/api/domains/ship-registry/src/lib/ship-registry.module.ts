import { Module } from '@nestjs/common'
import { ShipRegistryClientModule } from '@island.is/clients/ship-registry'

@Module({
  imports: [ShipRegistryClientModule],
  providers: [],
})
export class ShipRegistryModule {}
