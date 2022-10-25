import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleOwnerChangeResolver } from './vehicleOwnerChange.resolver'
import { VehicleOwnerChangeService } from './vehicleOwnerChange.service'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleOwnerChangeClientConfig],
    }),
  ],
  providers: [VehicleOwnerChangeResolver, VehicleOwnerChangeService],
  exports: [VehicleOwnerChangeService],
})
export class VehicleOwnerChangeModule {}
