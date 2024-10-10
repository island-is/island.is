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
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
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

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehicleOwnerChangeClientModule,
    VehicleOperatorsClientModule,
    VehicleCodetablesClientModule,
    ChargeFjsV2ClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        VehicleOperatorsClientConfig,
        VehicleCodetablesClientConfig,
        ChargeFjsV2ClientConfig,
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
