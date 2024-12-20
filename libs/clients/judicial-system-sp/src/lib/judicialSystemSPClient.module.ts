import { Module } from '@nestjs/common'
import { SharedApiConfig } from './shared.config'
import { exportedApis } from './providers'
import { JudicialSystemSPClientService } from './judicialSystemSPClient.service'

@Module({
  providers: [SharedApiConfig, ...exportedApis, JudicialSystemSPClientService],
  exports: [JudicialSystemSPClientService],
})
export class JudicialSystemSPClientModule {}
