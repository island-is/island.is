import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { TransferOfVehicleOwnershipApiResolver } from './transferOfVehicleOwnership.resolver'
import { TransferOfVehicleOwnershipApi } from './transferOfVehicleOwnership.service'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleOwnerChangeClientConfig],
    }),
  ],
  providers: [
    TransferOfVehicleOwnershipApiResolver,
    TransferOfVehicleOwnershipApi,
  ],
  exports: [TransferOfVehicleOwnershipApi],
})
export class TransferOfVehicleOwnershipApiModule {}
