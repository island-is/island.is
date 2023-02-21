import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { JudicialAdministrationService } from './judicialAdministration.service'
import { exportedApis } from './providers'

@Module({
  providers: [ApiConfig, JudicialAdministrationService, ...exportedApis],
  exports: [JudicialAdministrationService],
})
export class JudicialAdministrationClientModule {}
