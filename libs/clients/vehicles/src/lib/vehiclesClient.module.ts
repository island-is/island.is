import { Module } from '@nestjs/common'
import { VehiclesApiProvider } from './vehiclesClient.service'

@Module({
  providers: [VehiclesApiProvider],
  exports: [VehiclesApiProvider],
})
export class VehiclesClientModule {}
