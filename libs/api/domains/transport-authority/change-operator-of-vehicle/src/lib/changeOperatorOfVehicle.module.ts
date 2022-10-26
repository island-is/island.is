import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import { MainResolver } from './graphql/main.resolver'
import { ChangeOperatorOfVehicleApi } from './changeOperatorOfVehicle.service'

@Module({
  imports: [
    VehicleOperatorsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleOperatorsClientConfig],
    }),
  ],
  providers: [MainResolver, ChangeOperatorOfVehicleApi],
  exports: [ChangeOperatorOfVehicleApi],
})
export class ChangeOperatorOfVehicleApiModule {}
