import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { exportedApis } from './providers'
import { IntellectualPropertyClientService } from './intellectualPropertyClient.service'

@Module({
  providers: [ApiConfig, ...exportedApis, IntellectualPropertyClientService],
  exports: [IntellectualPropertyClientService, ...exportedApis],
})
export class IntellectualPropertyClientModule {}
