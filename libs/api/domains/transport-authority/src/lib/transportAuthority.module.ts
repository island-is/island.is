import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './transportAuthority.service'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import {
  VehiclePlateRenewalClientModule,
  VehiclePlateRenewalClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import {
  ExemptionForTransportationClientConfig,
  ExemptionForTransportationClientModule,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import {
  VehicleServiceFjsV1ClientConfig,
  VehicleServiceFjsV1ClientModule,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import {
  VehiclesMileageClientConfig,
  VehiclesMileageClientModule,
} from '@island.is/clients/vehicles-mileage'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    DigitalTachographDriversCardClientModule,
    VehicleOperatorsClientModule,
    VehiclePlateOrderingClientModule,
    VehiclePlateRenewalClientModule,
    ExemptionForTransportationClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        DigitalTachographDriversCardClientConfig,
        VehicleOperatorsClientConfig,
        VehiclePlateOrderingClientConfig,
        VehiclePlateRenewalClientConfig,
        ExemptionForTransportationClientConfig,
        VehicleServiceFjsV1ClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
