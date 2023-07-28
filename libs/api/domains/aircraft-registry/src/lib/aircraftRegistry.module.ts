import { Module } from '@nestjs/common'
import { AircraftRegistryClientModule } from '@island.is/clients/aircraft-registry'
import { AircraftRegistryResolver } from './aircraftRegistry.resolver'
import { AircraftRegistryService } from './aircraftRegistry.service'

@Module({
  imports: [AircraftRegistryClientModule],
  providers: [AircraftRegistryService, AircraftRegistryResolver],
})
export class AircraftRegistryModule {}
