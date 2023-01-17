import { Module } from '@nestjs/common'
import { VehiclePlateOrderingClient } from './vehiclePlateOrderingClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehiclePlateOrderingClient],
  exports: [VehiclePlateOrderingClient],
})
export class VehiclePlateOrderingClientModule {}
