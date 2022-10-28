import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import { MainResolver } from './graphql/main.resolver'
import { TransferOfVehicleOwnershipApi } from './transferOfVehicleOwnership.service'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    VehicleCodetablesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleOwnerChangeClientConfig, VehicleCodetablesClientConfig],
    }),
  ],
  providers: [MainResolver, TransferOfVehicleOwnershipApi],
  exports: [TransferOfVehicleOwnershipApi],
})
export class TransferOfVehicleOwnershipApiModule {}
