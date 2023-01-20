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
  VehicleServiceFjsV1ClientConfig,
  VehicleServiceFjsV1ClientModule,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    DigitalTachographDriversCardClientModule,
    VehicleOperatorsClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        DigitalTachographDriversCardClientConfig,
        VehicleOperatorsClientConfig,
        VehicleServiceFjsV1ClientConfig,
        VehiclesClientConfig,
      ],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
