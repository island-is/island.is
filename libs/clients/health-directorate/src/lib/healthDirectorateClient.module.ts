import { Module } from '@nestjs/common'
import { HealthDirectorateClientService } from './healthDirectorateClient.service'
import { HealthDirectorateApiProvider } from './apiProvider'

@Module({
  providers: [HealthDirectorateApiProvider, HealthDirectorateClientService],
  exports: [HealthDirectorateClientService],
})
export class HealthDirectorateClientModule {}
