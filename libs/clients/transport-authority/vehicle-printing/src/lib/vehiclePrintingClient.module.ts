import { Module } from '@nestjs/common'
import { VehiclePrintingClient } from './vehiclePrintingClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, VehiclePrintingClient],
  exports: [VehiclePrintingClient],
})
export class VehiclePrintingClientModule {}
