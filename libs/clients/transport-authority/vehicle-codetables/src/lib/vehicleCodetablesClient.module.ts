import { Module } from '@nestjs/common'
import { VehicleCodetablesClient } from './vehicleCodetablesClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleCodetablesClient],
  exports: [VehicleCodetablesClient],
})
export class VehicleCodetablesClientModule {}
