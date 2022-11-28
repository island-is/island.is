import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehicleInfolocksClientModule,
  VehicleInfolocksClientConfig,
} from '@island.is/clients/transport-authority/vehicle-infolocks'
import { MainResolver } from './graphql/main.resolver'
import { AnonymityInVehicleRegistryApi } from './anonymityInVehicleRegistry.service'

@Module({
  imports: [
    VehicleInfolocksClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleInfolocksClientConfig],
    }),
  ],
  providers: [MainResolver, AnonymityInVehicleRegistryApi],
  exports: [AnonymityInVehicleRegistryApi],
})
export class AnonymityInVehicleRegistryApiModule {}
