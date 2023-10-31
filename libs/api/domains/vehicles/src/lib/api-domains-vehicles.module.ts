import { Module } from '@nestjs/common'

import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { VehiclesResolver } from './api-domains-vehicles.resolver'
import { VehiclesService } from './api-domains-vehicles.service'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  providers: [VehiclesResolver, VehiclesService],
  imports: [VehiclesClientModule, VehiclesMileageClientModule, AuthModule],
  exports: [VehiclesService],
})
export class VehiclesModule {}
