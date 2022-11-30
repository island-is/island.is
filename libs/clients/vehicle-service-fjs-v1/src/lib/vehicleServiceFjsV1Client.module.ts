import { Module } from '@nestjs/common'
import { VehicleServiceFjsV1Client } from './vehicleServiceFjsV1Client.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehicleServiceFjsV1Client],
  exports: [VehicleServiceFjsV1Client],
})
export class VehicleServiceFjsV1ClientModule {}
