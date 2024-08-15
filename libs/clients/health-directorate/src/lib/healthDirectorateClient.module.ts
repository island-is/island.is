import { Module } from '@nestjs/common'
import { HealthDirectorateClientService } from './healthDirectorateClient.service'
import { apiProvider } from './apiConfiguration'

@Module({
  providers: [...apiProvider, HealthDirectorateClientService],
  exports: [HealthDirectorateClientService],
})
export class HealthDirectorateClientModule {}
