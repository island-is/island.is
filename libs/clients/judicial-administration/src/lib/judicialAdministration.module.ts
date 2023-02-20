import { IdsClientConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { JudicialAdministrationService } from './judicialAdministration.service'
import { exportedApis } from './providers'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfig, JudicialAdministrationService, ...exportedApis],
  exports: [JudicialAdministrationService],
})
export class JudicialAdministrationClientModule {}
