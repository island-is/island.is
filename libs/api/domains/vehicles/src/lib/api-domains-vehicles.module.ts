import { Module } from '@nestjs/common'
import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesResolver } from './api-domains-vehicles.resolver'
import { VehiclesService } from './api-domains-vehicles.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  VehicleServiceFjsV1ClientConfig,
  VehicleServiceFjsV1ClientModule,
} from '@island.is/clients/vehicle-service-fjs-v1'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [VehiclesResolver, VehiclesService],
  imports: [
    VehiclesClientModule,
    AuthModule,
    VehicleServiceFjsV1ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleServiceFjsV1ClientConfig],
    }),
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
