import { Module } from '@nestjs/common'
import { IdsClientConfig } from '@island.is/nest/config'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { VehicleServiceFjsV1ClientService } from './vehicleServiceFjsV1Client.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [
    ApiConfiguration,
    VehicleServiceFjsV1ClientService,
    ...exportedApis,
  ],
  exports: [VehicleServiceFjsV1ClientService],
})
export class VehicleServiceFjsV1ClientModule {}
