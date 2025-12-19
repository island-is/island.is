import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './mileCar.service'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    VehiclesClientModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclesClientConfig],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
