import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehicleServiceFjsV1ClientModule,
  VehicleServiceFjsV1ClientConfig,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import {
  VehiclesMileageClientModule,
  VehiclesMileageClientConfig,
} from '@island.is/clients/vehicles-mileage'
import { ClientsPaymentsModule } from '@island.is/clients/payments'
@Module({
  imports: [
    SharedTemplateAPIModule,
    VehicleOperatorsClientModule,
    VehicleOwnerChangeClientModule,
    VehicleCodetablesClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ClientsPaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOperatorsClientConfig,
        VehicleOwnerChangeClientConfig,
        VehicleCodetablesClientConfig,
        VehicleServiceFjsV1ClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [ChangeOperatorOfVehicleService],
  exports: [ChangeOperatorOfVehicleService],
})
export class ChangeOperatorOfVehicleModule {}
