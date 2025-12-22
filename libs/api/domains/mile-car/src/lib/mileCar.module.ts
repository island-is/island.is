import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { MileCarApi } from './mileCar.service'
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
  providers: [MainResolver, MileCarApi],
  exports: [MileCarApi],
})
export class MileCarApiModule {}
