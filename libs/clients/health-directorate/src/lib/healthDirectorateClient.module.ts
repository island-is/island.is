import { Module } from '@nestjs/common'
import { HealthDirectorateClientService } from './healthDirectorateClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [HealthDirectorateClientService, ...exportedApis],
  exports: [HealthDirectorateClientService],
})
export class HealthDirectorateClientModule {}
