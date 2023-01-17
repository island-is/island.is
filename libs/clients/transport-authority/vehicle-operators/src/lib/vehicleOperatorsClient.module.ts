import { Module } from '@nestjs/common'
import { VehicleOperatorsClient } from './vehicleOperatorsClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleOperatorsClient],
  exports: [VehicleOperatorsClient],
})
export class VehicleOperatorsClientModule {}
