import { Module } from '@nestjs/common'
import { VehicleOwnerChangeClient } from './vehicleOwnerChangeClient.service'
import { exportedApis } from './apiConfiguration'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'

@Module({
  imports: [VehiclesMileageClientModule],
  providers: [...exportedApis, VehicleOwnerChangeClient],
  exports: [VehicleOwnerChangeClient],
})
export class VehicleOwnerChangeClientModule {}
