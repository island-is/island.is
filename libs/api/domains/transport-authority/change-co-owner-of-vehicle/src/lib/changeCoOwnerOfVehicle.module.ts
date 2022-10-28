import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import { MainResolver } from './graphql/main.resolver'
import { ChangeCoOwnerOfVehicleApi } from './changeCoOwnerOfVehicle.service'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    VehicleOperatorsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleOwnerChangeClientConfig, VehicleOperatorsClientConfig],
    }),
  ],
  providers: [MainResolver, ChangeCoOwnerOfVehicleApi],
  exports: [ChangeCoOwnerOfVehicleApi],
})
export class ChangeCoOwnerOfVehicleApiModule {}
