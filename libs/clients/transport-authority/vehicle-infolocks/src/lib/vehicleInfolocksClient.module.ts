import { Module } from '@nestjs/common'
import { VehicleInfolocksClient } from './vehicleInfolocksClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleInfolocksClient],
  exports: [VehicleInfolocksClient],
})
export class VehicleInfolocksClientModule {}
