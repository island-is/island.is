import { Module } from '@nestjs/common'
import { VehiclesClientService } from './vehiclesClient.service'
import { ApiConfig, PublicApiConfig } from './api.config'
import { apiProviders, publicApiProviders } from './providers'
import { PublicVehicleSearchApi, VehicleSearchApi } from '../../gen/fetch'

@Module({
  providers: [
    ApiConfig,
    PublicApiConfig,
    ...apiProviders,
    ...publicApiProviders,
    VehiclesClientService,
  ],
  exports: [VehiclesClientService, VehicleSearchApi, PublicVehicleSearchApi],
})
export class VehiclesClientModule {}
