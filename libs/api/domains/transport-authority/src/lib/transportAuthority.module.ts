import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './transportAuthority.service'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'

@Module({
  imports: [
    VehicleCodetablesClientModule,
    DigitalTachographDriversCardClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleCodetablesClientConfig,
        DigitalTachographDriversCardClientConfig,
      ],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
