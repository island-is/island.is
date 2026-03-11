import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { ChangeCoOwnerOfVehicleService } from './change-co-owner-of-vehicle.service'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
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
    VehicleOwnerChangeClientModule,
    VehicleOperatorsClientModule,
    VehicleCodetablesClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ClientsPaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        VehicleOperatorsClientConfig,
        VehicleCodetablesClientConfig,
        VehicleServiceFjsV1ClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [ChangeCoOwnerOfVehicleService],
  exports: [ChangeCoOwnerOfVehicleService],
})
export class ChangeCoOwnerOfVehicleModule {}
