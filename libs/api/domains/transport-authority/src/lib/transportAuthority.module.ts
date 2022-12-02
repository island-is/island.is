import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './transportAuthority.service'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'

@Module({
  imports: [
    VehicleCodetablesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleCodetablesClientConfig],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
