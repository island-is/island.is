import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { AnonymityInVehicleRegistryService } from './anonymity-in-vehicle-registry.service'
import {
  VehicleInfolocksClientModule,
  VehicleInfolocksClientConfig,
} from '@island.is/clients/transport-authority/vehicle-infolocks'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehicleInfolocksClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehicleInfolocksClientConfig],
    }),
  ],
  providers: [AnonymityInVehicleRegistryService],
  exports: [AnonymityInVehicleRegistryService],
})
export class AnonymityInVehicleRegistryModule {}
