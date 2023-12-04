import { Module } from '@nestjs/common'
import { VehiclesMileageApiProvider } from './vehiclesMileageClient.service'

@Module({
  providers: [VehiclesMileageApiProvider],
  exports: [VehiclesMileageApiProvider],
})
export class VehiclesMileageClientModule {}
