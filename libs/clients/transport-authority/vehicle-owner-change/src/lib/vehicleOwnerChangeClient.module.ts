import { Module } from '@nestjs/common'
import { VehicleOwnerChangeClient } from './vehicleOwnerChangeClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleOwnerChangeClient],
  exports: [VehicleOwnerChangeClient],
})
export class VehicleOwnerChangeClientModule {}
