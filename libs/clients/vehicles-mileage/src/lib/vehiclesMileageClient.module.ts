import { Module } from '@nestjs/common'
import { VehiclesMileageClientService } from './vehiclesMileageClient.service'
import { VehiclesMileageApiProvider } from './providers'

@Module({
  providers: [VehiclesMileageApiProvider, VehiclesMileageClientService],
  exports: [VehiclesMileageApiProvider, VehiclesMileageClientService],
})
export class VehiclesMileageClientModule {}
