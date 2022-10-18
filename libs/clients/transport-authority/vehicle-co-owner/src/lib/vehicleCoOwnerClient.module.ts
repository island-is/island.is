import { Module } from '@nestjs/common'
import { VehicleCoOwnerClient } from './vehicleCoOwnerClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleCoOwnerClient],
  exports: [VehicleCoOwnerClient],
})
export class VehicleCoOwnerClientModule {}
