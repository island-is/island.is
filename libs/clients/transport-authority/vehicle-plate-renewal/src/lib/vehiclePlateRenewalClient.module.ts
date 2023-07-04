import { Module } from '@nestjs/common'
import { VehiclePlateRenewalClient } from './vehiclePlateRenewalClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehiclePlateRenewalClient],
  exports: [VehiclePlateRenewalClient],
})
export class VehiclePlateRenewalClientModule {}
