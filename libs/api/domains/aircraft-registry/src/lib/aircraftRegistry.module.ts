import { Module } from '@nestjs/common'
import { AircraftRegistryClientModule } from '@island.is/clients/aircraft-registry'

@Module({
  imports: [AircraftRegistryClientModule],
  providers: [],
  exports: [],
})
export class AircraftRegistryModule {}
