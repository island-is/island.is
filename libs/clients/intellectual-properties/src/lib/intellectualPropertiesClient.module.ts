import { Module } from '@nestjs/common'
import { exportedApis } from './providers'
import { IntellectualPropertiesClientService } from './intellectualPropertiesClient.service'
import { ApiConfig } from './api.config'

@Module({
  providers: [ApiConfig, ...exportedApis, IntellectualPropertiesClientService],
  exports: [IntellectualPropertiesClientService],
})
export class IntellectualPropertiesClientModule {}
