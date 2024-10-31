import { Module } from '@nestjs/common'
import { VehicleOperatorsClient } from './vehicleOperatorsClient.service'
import { exportedApis } from './apiConfiguration'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'

@Module({
  imports: [VehiclesMileageClientModule],
  providers: [...exportedApis, VehicleOperatorsClient],
  exports: [VehicleOperatorsClient],
})
export class VehicleOperatorsClientModule {}
