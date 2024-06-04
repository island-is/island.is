import { Module } from '@nestjs/common'
import { SharedApiConfig } from './shared.config'
import { exportedApis } from './providers'
import { LawAndOrderClientService } from './lawAndOrderClient.service'

@Module({
  providers: [SharedApiConfig, ...exportedApis, LawAndOrderClientService],
  exports: [LawAndOrderClientService],
})
export class LawAndOrderClientModule {}
